import os
import uuid
import base64
import contextlib
from typing import AsyncGenerator
from aiohttp.streams import StreamReader
from azure.storage.blob.aio import BlobServiceClient
from azure.identity.aio import DefaultAzureCredential


SUSTINEO_STORAGE = os.environ.get("SUSTINEO_STORAGE", "EMPTY")
SUSTINEO_CONTAINER = "sustineo"


@contextlib.asynccontextmanager
async def get_storage_client(container: str):
    # Create credential and blob service client
    credential = DefaultAzureCredential()
    blob_service_client = BlobServiceClient(
        account_url=SUSTINEO_STORAGE, credential=credential
    )
    try:
        # Create the container if it doesn't exist
        container_client = blob_service_client.get_container_client(container)

        # remove the comment below if you want to ensure
        # the container exists. commenting to avoid unnecessary
        # creation
        # if not await container_client.exists():
        #    await container_client.create_container()

        yield container_client
    finally:
        await credential.close()
        await blob_service_client.close()


async def save_image_blobs(
    images: list[str], path: str | None = None
) -> AsyncGenerator[str, None]:
    async with get_storage_client(SUSTINEO_CONTAINER) as container_client:
        for image in images:
            image_bytes = base64.b64decode(image)
            blob_name = (
                f"images/{str(uuid.uuid4())}.png"
                if path is None
                else f"images/{path}/{str(uuid.uuid4())}.png"
            )
            await container_client.upload_blob(
                name=blob_name, data=image_bytes, overwrite=True
            )
            yield blob_name

async def save_image_blob(image: str, path: str | None = None) -> str:
    async with get_storage_client(SUSTINEO_CONTAINER) as container_client:
        image_bytes = base64.b64decode(image)
        blob_name = (
            f"images/{str(uuid.uuid4())}.png"
            if path is None
            else f"images/{path}/{str(uuid.uuid4())}.png"
        )
        await container_client.upload_blob(name=blob_name, data=image_bytes, overwrite=True)
        return blob_name


async def save_video_blob(stream_reader: StreamReader, path: str | None = None) -> str:
    async with get_storage_client(SUSTINEO_CONTAINER) as container_client:
        blob_name = (
            f"videos/{str(uuid.uuid4())}.mp4"
            if path is None
            else f"videos/{path}/{str(uuid.uuid4())}.mp4"
        )
        content = await stream_reader.read()
        await container_client.upload_blob(name=blob_name, data=content, overwrite=True)
        return blob_name
