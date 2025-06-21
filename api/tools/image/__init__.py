from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
async def read_main():
    return {"message": "Hello World from main app"}

class ImageEditRequest(BaseModel):
    image_id: str
    edits: dict  # Define the structure of edits as needed

@app.post("/edit")
async def edit_image(request: ImageEditRequest):
    return {"message": "Image editing endpoint", "data": request.model_dump()}
