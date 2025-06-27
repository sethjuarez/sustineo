import prompty
import aiofiles
from pathlib import Path
from typing import Union
from datetime import datetime

from prompty.utils import parse
from prompty.core import Prompty
from prompty import _load_with_slots
from prompty.tracer import trace

from azure.cosmos.aio import ContainerProxy

from openai.types.beta.realtime.session_update_event import SessionTool
from api.cosmos import get_cosmos_container
from api.model import Configuration, DefaultConfiguration


DATABASE_NAME = "sustineo"
CONTAINER_NAME = "VoiceConfigurations"


async def seed_configurations(container: ContainerProxy) -> list[Configuration]:
    configs = []
    # Load default configuration from file
    config = await load_prompty_file("voice.prompty")
    if config:
        await container.upsert_item(
            {
                "id": config.id,
                "name": config.name,
                "default": config.default,
                "content": config.content,
            }
        )
        configs.append(config)

    config = await load_prompty_file("travel.prompty", True)
    if config:
        await container.upsert_item(
            {
                "id": config.id,
                "name": config.name,
                "default": config.default,
                "content": config.content,
            }
        )
        configs.append(config)

    return configs


def load_prompty(contents: str, date: datetime = datetime.now()) -> Prompty:
    matter = parse(contents)
    attributes = matter.pop("attributes", {})
    if "model" not in attributes:
        attributes["model"] = {}

    if "api" not in attributes["model"]:
        attributes["model"]["api"] = "chat"

    # add default inputs
    attributes["inputs"] = [
        {
            "name": "customer",
            "type": "string",
            "description": "Customer name",
            "required": True,
        },
        {
            "name": "date",
            "type": "string",
            "description": "Current date",
            "default": date.strftime("%Y-%m-%d"),
            "required": False,
        },
        {
            "name": "time",
            "type": "string",
            "description": "Current time",
            "default": date.strftime("%H:%M"),
            "required": False,
        },
    ]
    return _load_with_slots(attributes, matter["body"], {}, Path(__file__).parent)


def load_prompty_config(contents: str, default: bool = False) -> Configuration:
    matter = parse(contents)
    atttributes = matter.pop("attributes", {})
    config = Configuration(
        id=atttributes.get("id", "default"),
        name=atttributes.get("name", "Default"),
        default=default,
        content=contents,
    )
    return config


async def load_prompty_file(
    prompty: str, default: bool = False
) -> Union[Configuration, None]:
    file = Path(__file__).parent / prompty
    config = None
    try:
        async with aiofiles.open(file, "r", encoding="utf-8") as f:
            file_content = await f.read()

        config = load_prompty_config(file_content, default=default)
    except Exception as e:
        print(f"Error loading default configuration: {e}")
    finally:
        return config


@trace
async def get_default_configuration() -> Union[Configuration, None]:
    async with get_cosmos_container(DATABASE_NAME, CONTAINER_NAME) as container:
        query = "SELECT * FROM c WHERE c.default = true"
        items = container.query_items(query=query)
        async for item in items:
            return Configuration(
                id=item["id"],
                name=item["name"],
                default=item["default"],
                content=item["content"],
                tools=item["tools"] if "tools" in item else [],
            )
        return None


def convert_function_params(params: list[dict]) -> dict:
    return {
        "type": "object",
        "properties": {
            p["name"]: {
                "type": p["type"],
                "description": (
                    p["description"] if "description" in p else "No Description"
                ),
            }
            for p in params
        },
        "required": [p["name"] for p in params if p["required"]],
    }


@trace
async def get_default_configuration_data(**args) -> Union[DefaultConfiguration, None]:
    config = await get_default_configuration()
    if config:
        p = load_prompty(config.content)
        msgs = await prompty.prepare_async(p, inputs={**args})
        system_message = msgs[0]["content"] if len(msgs) > 0 else ""
        tools: list[SessionTool] = []
        if config.tools is not None and len(config.tools) > 0:
            for tool in config.tools:
                tools.append(
                    SessionTool(
                        type="function",
                        name=tool["name"].strip().lower().replace(" ", "_"),
                        description=(
                            tool["description"]
                            if "description" in tool
                            else "No Description"
                        ),
                        parameters=convert_function_params(tool["parameters"]),
                    )
                )

        return DefaultConfiguration(system_message=system_message, tools=tools)
    return None
