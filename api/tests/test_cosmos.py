import pytest
from dotenv import load_dotenv
from api.model import Configuration
from api.cosmos import create_item, delete_item, get_items, get_item_by_id, update_all_items, update_item

load_dotenv()


def configuration_mapper(item: dict) -> Configuration:
    return Configuration(
        id=item["id"],
        name=item["name"],
        default=item.get("default", False),
        content=item["content"],
        tools=item.get("tools", []),
    )


@pytest.mark.asyncio
async def test_get_all_items():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    async with get_items(database_name, container_name, configuration_mapper) as items:
        assert len(items) > 1


@pytest.mark.asyncio
async def test_get_item_by_id():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    item_id = "social-media-manager"
    async with get_item_by_id(
        database_name, container_name, item_id, configuration_mapper
    ) as item:
        assert item is not None
        assert isinstance(item, Configuration)
        assert item.id == item_id


@pytest.mark.asyncio
async def test_create_item():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    new_item = {
        "id": "test-item",
        "name": "Test Item",
        "default": False,
        "content": "This is a test item.",
        "tools": [],
    }

    async with create_item(
        database_name, container_name, new_item, configuration_mapper
    ) as item:
        assert item is not None
        assert isinstance(item, Configuration)
        assert item.id == new_item["id"]
        assert item.name == new_item["name"]
        assert item.content == new_item["content"]
        assert item.default == new_item["default"]
        assert item.tools == new_item["tools"]


@pytest.mark.asyncio
async def test_update_item():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    item_id = "test-item-1"
    new_item = {
        "id": "test-item-2",
        "name": "Test Item",
        "default": False,
        "content": "This is a test item.",
        "tools": [],
    }

    async with update_item(
        database_name, container_name, item_id, "id", new_item, configuration_mapper
    ) as item:
        assert item is not None
        assert isinstance(item, Configuration)
        assert item.id == new_item["id"]
        assert item.name == new_item["name"]
        assert item.content == new_item["content"]
        assert item.default == new_item["default"]
        assert item.tools == new_item["tools"]


@pytest.mark.asyncio
async def test_bad_update_item():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    item_id = "test-item-2"
    new_item = {
        "id": "developer-control-agent",
        "name": "Test Item",
        "default": False,
        "content": "This is a test item.",
        "tools": [],
    }

    # this should catch a ValueError because the item_id does not match the new_item id
    with pytest.raises(ValueError, match="Item with id developer-control-agent already exists."):
        async with update_item(
            database_name, container_name, item_id, "id", new_item, configuration_mapper
        ) as item:
            assert item is not None
            assert isinstance(item, Configuration)
            assert item.id == new_item["id"]
            assert item.name == new_item["name"]
            assert item.content == new_item["content"]
            assert item.default == new_item["default"]
            assert item.tools == new_item["tools"]


@pytest.mark.asyncio
async def test_update_all_items():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    
    id = "test-item-2"

    def update_mapper(item: dict) -> dict:
        item["default"] = item["id"] == id
        return item

    async with update_all_items(
        database_name, container_name, update_mapper
    ) as item:
        assert item is not None
        assert item["status"] == "All items updated successfully"


@pytest.mark.asyncio
async def test_delete_items():
    database_name = "sustineo"
    container_name = "VoiceConfigurations"
    id = "test-item-2"

    async with delete_item(
        database_name, container_name, id
    ) as item:
        assert item is not None
        assert item["id"] == id
