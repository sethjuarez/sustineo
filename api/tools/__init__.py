from fastapi import FastAPI
from dataclasses import dataclass
from api.tools.image import app as ImageApp

@dataclass
class Tool():
    name: str
    app: FastAPI
    description: str


tool_collection = [
    Tool(name="image", app=ImageApp, description="Image processing tools"),
]
