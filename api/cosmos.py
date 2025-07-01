import os
import contextlib
from typing import Any, Callable
from azure.cosmos import PartitionKey
from azure.cosmos.aio import CosmosClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError

COSMOSDB_CONNECTION = os.getenv("COSMOSDB_CONNECTION", "fake_connection")


@contextlib.asynccontextmanager
async def get_cosmos_container(
    database_name: str = "sustineo", container_name: str = "VoiceConfigurations"
):
    # Create a Cosmos DB client
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    database = await client.create_database_if_not_exists(database_name)
    container = await database.create_container_if_not_exists(
        id=container_name,
        partition_key=PartitionKey(path="/id"),
        offer_throughput=400,
    )
    try:
        yield container
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def get_items(
    database_name, container_name, mapper: Callable[[dict], Any] | None = None
):
    # Create a Cosmos DB client
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)
        items = container.read_all_items()
        if mapper:
            yield [mapper(item) async for item in items]
        else:
            yield [item async for item in items]
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def get_item_by_id(
    database_name: str,
    container_name: str,
    item_id: str,
    mapper: Callable[[dict], Any] | None = None,
):
    # Create a Cosmos DB client
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)
        item = await container.read_item(item=item_id, partition_key=item_id)
        if mapper:
            yield mapper(item)
        else:
            yield item
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def create_item(
    database_name: str,
    container_name: str,
    item: dict,
    mapper: Callable[[dict], Any] | None = None,
):

    # Create a Cosmos DB client
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)
        item = await container.create_item(item)
        if mapper:
            yield mapper(item)
        else:
            yield item
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def update_item(
    database_name: str,
    container_name: str,
    item_id: str,
    key: str,
    item: dict,
    mapper: Callable[[dict], Any] | None = None,
):
    # Create a Cosmos DB client
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)

        async def check_id_exists(item_id: str):
            try:
                await container.read_item(item=item_id, partition_key=item_id)
                return True
            except CosmosResourceNotFoundError:
                return False

        # check id edit conflicts with the item_id
        incoming_id = item.get(key, "")
        if incoming_id != item_id:
            if await check_id_exists(incoming_id):
                raise ValueError(f"Item with id {incoming_id} already exists.")
            await container.delete_item(item=item_id, partition_key=item_id)

        item = await container.upsert_item(item)
        if mapper:
            yield mapper(item)
        else:
            yield item
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def delete_item(
    database_name: str, container_name: str, item_id: str
):
    # Create a Cosmos DB client
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)
        await container.delete_item(item=item_id, partition_key=item_id)
        yield {"id": item_id, "action": "delete"}
    except CosmosResourceNotFoundError:
        raise CosmosResourceNotFoundError(f"Item with id {item_id} not found.")
    except Exception as e:
        raise Exception(f"An error occurred while deleting item {item_id}: {str(e)}")
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def update_all_items(
    database_name: str,
    container_name: str,
    mapper: Callable[[dict], dict],
):
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)

        items = container.read_all_items()
        async for item in items:
            updated_item = mapper(item)
            if updated_item:
                await container.upsert_item(updated_item)

        yield {"status": "All items updated successfully"}

    except Exception as e:
        raise Exception(f"An error occurred while updating items: {str(e)}")
    finally:
        await client.close()


@contextlib.asynccontextmanager
async def get_items_by_query(
    database_name: str,
    container_name: str,
    query: str,
    mapper: Callable[[dict], Any] | None = None,
):
    client = CosmosClient.from_connection_string(COSMOSDB_CONNECTION)
    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)

        items = container.query_items(query=query)
        if mapper:
            yield [mapper(item) async for item in items]
        else:
            yield [item async for item in items]
    finally:
        await client.close()