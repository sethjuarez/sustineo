import pytest
from api.tools.image import create_image, ImageCreateRequest


@pytest.mark.asyncio
async def test_gpt_image_generation():

    """Test the image generation functionality."""
    request = ImageCreateRequest(
        description="A custom Zava hoodie design featuring a light blue color scheme with intricate floral designs. The hoodie is worn by an abstract model in a serene woodland setting, conveying a fresh and natural vibe. The logo on the hoodie is an abstract, cartoonified depiction of Seth Juarez's face, designed for tasteful needlework stitching. The overall aesthetic is modern, professional, and appealing, suitable for production, highlighting Zava's innovative approach to wearable technology.",
        image="https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/6187080e-1020-4e76-bc4b-9a0167f25f56.png",
    )
    response = await create_image(
        request=request
    )

    print(f"Image URL: {response.image_url}")

    assert response is not None
