from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Response, status
from azure.cosmos.exceptions import CosmosResourceNotFoundError

from api.cosmos import (
    create_item,
    delete_item,
    get_items,
    get_item_by_id,
    update_all_items,
    update_item,
)
from api.model import Configuration
from api.voice.common import load_prompty_config

DATABASE_NAME = "sustineo"
CONTAINER_NAME = "VoiceConfigurations"

router = APIRouter(
    prefix="/api/configuration",
    tags=["voice"],
    responses={404: {"description": "Not found"}},
    dependencies=[],
)


class Config(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    default: Optional[bool] = False
    tools: Optional[list[dict]] = None
    content: str


def configuration_mapper(item: dict) -> Configuration:
    return Configuration(
        id=item["id"],
        name=item["name"],
        default=item.get("default", False),
        content=item["content"],
        tools=item.get("tools", []),
    )


@router.get("/")
async def get_configurations():
    async with get_items(
        DATABASE_NAME, CONTAINER_NAME, configuration_mapper
    ) as configurations:
        return configurations


@router.get("/{id}")
async def get_configuration(id: str, response: Response):
    try:
        async with get_item_by_id(
            DATABASE_NAME, CONTAINER_NAME, id, configuration_mapper
        ) as configuration:
            if configuration is None:
                response.status_code = status.HTTP_404_NOT_FOUND
                return {
                    "error": f"Configuration with id {id} not found.",
                    "message": "Please check the id and try again.",
                }
            return configuration

    except Exception:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {
            "message": f"Configuration with id {id} not found.",
        }


@router.post("/")
async def create_configuration(
    configuration: Config,
    response: Response,
) -> Configuration | dict[str, str]:

    config = load_prompty_config(configuration.content)
    config_item = {
        "id": config.id,
        "name": config.name,
        "default": configuration.default,
        "content": config.content,
        "tools": configuration.tools if configuration.tools else [],
    }

    try:
        async with create_item(
            DATABASE_NAME, CONTAINER_NAME, config_item, configuration_mapper
        ) as item:
            return item

    except Exception as e:
        response.status_code = status.HTTP_409_CONFLICT
        return {
            "id": config.id,
            "name": "error",
            "content": f"Configuration with id {config.id} already exists.\n{str(e)}",
        }


@router.put("/{id}")
async def update_configuration(
    id: str, configuration: Config, response: Response
) -> Configuration | dict[str, str]:

    config = load_prompty_config(configuration.content)
    config_item = {
        "id": config.id,
        "name": config.name,
        "default": configuration.default,
        "content": config.content,
        "tools": configuration.tools if configuration.tools else [],
    }

    try:
        async with update_item(
            DATABASE_NAME, CONTAINER_NAME, id, "id", config_item, configuration_mapper
        ) as item:
            return item
    except ValueError as e:
        response.status_code = status.HTTP_409_CONFLICT
        return {
            "id": config.id,
            "name": "error",
            "content": str(e),
        }


@router.delete("/{id}")
async def delete_configuration(id: str, response: Response) -> dict[str, str]:

    try:
        async with delete_item(DATABASE_NAME, CONTAINER_NAME, id) as item:
            return item
    except Exception as e:
        if isinstance(e, CosmosResourceNotFoundError):
            response.status_code = status.HTTP_404_NOT_FOUND
            return {
                "id": id,
                "action": "delete",
                "error": f"Configuration with id {id} not found.",
            }
        else:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "id": id,
                "action": "delete",
                "error": str(e),
            }


@router.put("/default/{id}")
async def set_default_configuration(id: str, response: Response) -> dict[str, str]:
    def update_mapper(item: dict) -> dict:
        item["default"] = item["id"] == id
        return item

    try:
        async with update_all_items(
            DATABASE_NAME, CONTAINER_NAME, update_mapper
        ) as item:
            return item
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {
            "id": id,
            "action": "default",
            "error": str(e),
        }
