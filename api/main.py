import os
import json
import asyncio
from pathlib import Path
from openai import AsyncAzureOpenAI
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Response, WebSocket, WebSocketDisconnect

from api.connection import connections
from api.voice.common import get_default_configuration_data
from api.voice.session import Message, RealtimeSession
from api.voice import router as voice_configuration_router
from api.agent import router as agent_router
from azure.identity.aio import DefaultAzureCredential
from azure.storage.blob.aio import BlobServiceClient
from api.agent.common import get_custom_agents, create_foundry_thread

from dotenv import load_dotenv

load_dotenv()

AZURE_VOICE_ENDPOINT = os.getenv("AZURE_VOICE_ENDPOINT") or ""
AZURE_VOICE_KEY = os.getenv("AZURE_VOICE_KEY", "fake_key")
LOCAL_TRACING_ENABLED = os.getenv("LOCAL_TRACING_ENABLED", "false").lower() == "true"
COSMOSDB_CONNECTION = os.getenv("COSMOSDB_CONNECTION", "fake_connection")
SUSTINEO_STORAGE = os.environ.get("SUSTINEO_STORAGE", "EMPTY")

base_path = Path(__file__).parent


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Load agents from prompty files in directory
        await get_custom_agents()
        yield
    finally:
        await connections.clear()


app = FastAPI(lifespan=lifespan)

app.include_router(voice_configuration_router, tags=["voice"])
app.include_router(agent_router, tags=["agents"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimpleMessage(BaseModel):
    name: str
    text: str


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/images/{image_id}")
async def get_image(image_id: str):
    async with DefaultAzureCredential() as credential:
        async with BlobServiceClient(
            account_url=SUSTINEO_STORAGE, credential=credential
        ) as blob_service_client:
            container_client = blob_service_client.get_container_client("sustineo")
            # get the blob client for the image
            blob_client = container_client.get_blob_client(f"images/{image_id}")

            # check if the blob exists
            if not await blob_client.exists():
                return Response(status_code=404, content="Image not found")

            # return bytes as png image
            image_data = await blob_client.download_blob()
            image_bytes = await image_data.readall()
            return Response(content=image_bytes, media_type="image/png")


@app.post("/api/message")
async def message(message: SimpleMessage):    
    return {"message": f"Hello {message.name}, you sent: {message.text}"}


@app.websocket("/api/voice/{id}")
async def voice_endpoint(id: str, websocket: WebSocket):

    connection = await connections.connect(id, websocket)

    try:
        client = AsyncAzureOpenAI(
            azure_endpoint=AZURE_VOICE_ENDPOINT,
            api_key=AZURE_VOICE_KEY,
            api_version="2024-10-01-preview",
        )
        async with client.beta.realtime.connect(
            model="gpt-4o-realtime-preview",
        ) as realtime_client:

            # get current username and receive any parameters
            user_message = await connection.receive_json()
            user = Message(**user_message)

            settings = json.loads(user.payload)
            print(
                "Starting voice session with settings:\n",
                json.dumps(settings, indent=2),
            )

            # create voice system message
            args = {
                "customer": settings["user"] if "user" in settings else "unnamed user"
            }
            if "date" in settings:
                args["date"] = settings["date"]
            if "time" in settings:
                args["time"] = settings["time"]

            prompt_settings = await get_default_configuration_data(**args)
            if prompt_settings is None:
                await connection.send_json(
                    {
                        "error": "No default configuration found.",
                        "message": "Please contact support.",
                    }
                )
                await connection.close()
                return
            
            # create a new thread in the foundry
            thread_id = await create_foundry_thread()

            session = RealtimeSession(
                realtime=realtime_client,
                client=connection,
                thread_id=thread_id,
            )

            await session.update_realtime_session(
                instructions=prompt_settings.system_message,
                threshold=settings["threshold"] if "threshold" in settings else 0.8,
                silence_duration_ms=(
                    settings["silence"] if "silence" in settings else 500
                ),
                prefix_padding_ms=(settings["prefix"] if "prefix" in settings else 300),
                tools=prompt_settings.tools,
            )

            tasks = [
                asyncio.create_task(session.receive_realtime()),
                asyncio.create_task(session.receive_client()),
            ]
            await asyncio.gather(*tasks)

    except WebSocketDisconnect as e:
        connections.remove(id)
        print("Voice Socket Disconnected", e)
