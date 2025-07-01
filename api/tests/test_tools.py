import pytest
from api.tools.image import create_image, ImageCreateRequest


@pytest.mark.asyncio
async def test_gpt_image_generation():

    """Test the image generation functionality."""
    request = ImageCreateRequest(
        description="A beautiful sunset over the mountains",
        image="https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/c0abeec1-c7fd-4ceb-a1b3-73d84617a078.png",
    )
    response = await create_image(
        request=request
    )

    assert response is not None
