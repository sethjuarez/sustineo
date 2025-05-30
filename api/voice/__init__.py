from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Response, status
from azure.cosmos.exceptions import CosmosResourceNotFoundError

from api.model import Configuration
from api.voice.common import (
    get_cosmos_container,
    load_prompty_config,
    query_configurations,
)


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


@router.get("/")
async def get_configurations():
    configurations = await query_configurations()
    return configurations


@router.get("/{id}")
async def get_configuration(id: str, response: Response):
    async with get_cosmos_container() as container:
        try:
            item = await container.read_item(item=id, partition_key=id)
            return Configuration(
                id=item["id"],
                name=item["name"],
                default=item["default"] if "default" in item else False,
                content=item["content"],
                tools=item["tools"] if "tools" in item else [],
            )
        except Exception as e:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {
                "error": str(e),
                "message": f"Configuration with id {id} not found.",
            }


@router.post("/")
async def create_configuration(
    configuration: Config,
    response: Response,
) -> Configuration:
    async with get_cosmos_container() as container:
        config = load_prompty_config(configuration.content)

        try:
            # Upsert the configuration
            item = await container.create_item(
                {
                    "id": config.id,
                    "name": config.name,
                    "default": False,
                    "content": config.content,
                    "tools": configuration.tools if configuration.tools else [],
                }
            )
            return Configuration(
                id=item["id"],
                name=item["name"],
                default=item["default"],
                content=item["content"],
                tools=configuration.tools if configuration.tools else [],
            )
        except Exception as e:
            response.status_code = status.HTTP_409_CONFLICT
            return Configuration(
                id=config.id,
                name="error",
                default=False,
                content=f"Configuration with id {config.id} already exists.\n{str(e)}",
                tools=[],
            )


@router.put("/{id}")
async def update_configuration(
    id: str, configuration: Config, response: Response
) -> Configuration:
    async with get_cosmos_container() as container:
        config = load_prompty_config(configuration.content)

        if config.id != id:

            async def check_id_exists(item_id):
                try:
                    await container.read_item(item=item_id, partition_key=item_id)
                    return True
                except CosmosResourceNotFoundError:
                    return False

            # check if target id already exists
            if await check_id_exists(config.id):
                response.status_code = status.HTTP_409_CONFLICT
                return Configuration(
                    id=config.id,
                    name="error",
                    default=False,
                    content=f"Configuration with id {id} already exists.",
                    tools=[],
                )

            # remove the old id from the configuration
            await container.delete_item(id, partition_key=id)

        # Update the configuration
        item = await container.upsert_item(
            {
                "id": config.id,
                "name": config.name,
                "default": configuration.default,
                "content": config.content,
                "tools": configuration.tools if configuration.tools else [],
            }
        )

        return Configuration(
            id=item["id"],
            name=item["name"],
            default=item["default"] if "default" in item else False,
            content=item["content"],
            tools=item["tools"] if "tools" in item else [],
        )


@router.delete("/{id}")
async def delete_configuration(id: str, response: Response) -> dict[str, str]:
    async with get_cosmos_container() as container:
        try:
            await container.delete_item(id, partition_key=id)
            return {
                "id": id,
                "action": "delete",
            }
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
    async with get_cosmos_container() as container:
        try:
            # set all other configurations to not default
            items = container.read_all_items()
            async for item in items:
                if item["id"] != id:
                    item["default"] = False
                    await container.upsert_item(item)
                else:
                    item["default"] = True
                    await container.upsert_item(item)
            return {
                "id": id,
                "action": "default",
            }
        except Exception as e:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "id": id,
                "action": "default",
                "error": str(e),
            }
