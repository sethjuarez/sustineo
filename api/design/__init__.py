from fastapi import APIRouter, Response, status

from api.model import Design
from api.cosmos import (
    create_item,
    delete_item,
    get_item_by_id,
    get_items,
    get_items_by_query,
    update_all_items,
    update_item,
)

from azure.cosmos.exceptions import CosmosResourceNotFoundError

DATABASE_NAME = "sustineo"
CONTAINER_NAME = "DesignConfigurations"

router = APIRouter(
    prefix="/api/design",
    tags=["design"],
    responses={404: {"description": "Not found"}},
    dependencies=[],
)


def design_mapper(item: dict) -> Design:
    return Design(
        id=item["id"],
        default=item.get("default", False),
        background=item["background"],
        logo=item.get("logo", ""),
        title=item.get("title", ""),
        sub_title=item.get("sub_title", ""),
        description=item.get("description", ""),
    )


def design_to_dict(design: Design) -> dict:
    return {
        "id": design.id,
        "default": design.default,
        "background": design.background,
        "logo": design.logo,
        "title": design.title,
        "sub_title": design.sub_title,
        "description": design.description,
    }


@router.get("/")
async def get_designs():
    async with get_items(DATABASE_NAME, CONTAINER_NAME, design_mapper) as designs:
        return designs


@router.get("/default")
async def get_default_design(response: Response) -> Design | dict[str, str]:
    try:
        async with get_items_by_query(
            DATABASE_NAME,
            CONTAINER_NAME,
            "SELECT * FROM c WHERE c.default = true",
            design_mapper,
        ) as designs:
            if not designs:
                response.status_code = status.HTTP_404_NOT_FOUND
                return {"error": "No default design found."}
            return designs[0]
    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": str(e)}


@router.get("/{id}")
async def get_design(id: str, response: Response):
    try:
        async with get_item_by_id(
            DATABASE_NAME, CONTAINER_NAME, id, design_mapper
        ) as design:
            if design is None:
                response.status_code = status.HTTP_404_NOT_FOUND
                return {
                    "error": f"Design with id {id} not found.",
                    "message": "Please check the id and try again.",
                }
            return design

    except Exception:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {
            "message": f"Configuration with id {id} not found.",
        }


@router.post("/")
async def create_design(
    design: Design,
    response: Response,
) -> Design | dict[str, str]:

    design_item = design_to_dict(design)

    try:
        async with create_item(
            DATABASE_NAME, CONTAINER_NAME, design_item, design_mapper
        ) as item:
            return item

    except Exception as e:
        response.status_code = status.HTTP_409_CONFLICT
        return {
            "id": design.id,
            "name": "error",
            "content": f"Design with id {design.id} already exists.\n{str(e)}",
        }


@router.put("/{id}")
async def update_design(
    id: str, design: Design, response: Response
) -> Design | dict[str, str]:

    design_item = design_to_dict(design)

    try:
        async with update_item(
            DATABASE_NAME, CONTAINER_NAME, id, "id", design_item, design_mapper
        ) as item:
            return item
    except ValueError as e:
        response.status_code = status.HTTP_409_CONFLICT
        return {
            "id": design.id,
            "name": "error",
            "content": str(e),
        }


@router.delete("/{id}")
async def delete_design(id: str, response: Response) -> dict[str, str]:

    try:
        async with delete_item(DATABASE_NAME, CONTAINER_NAME, id) as item:
            return item
    except Exception as e:
        if isinstance(e, CosmosResourceNotFoundError):
            response.status_code = status.HTTP_404_NOT_FOUND
            return {
                "id": id,
                "action": "delete",
                "error": f"Design with id {id} not found.",
            }
        else:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return {
                "id": id,
                "action": "delete",
                "error": str(e),
            }


@router.put("/default/{id}")
async def set_default_design(id: str, response: Response) -> dict[str, str]:
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
