import os
import pytest
from api.tools.image import create_image, ImageCreateRequest


@pytest.mark.asyncio
async def test_gpt_image_generation():

    """Test the image generation functionality."""
    request = ImageCreateRequest(
        description="""A custom Zava jersey design featuring a light blue color scheme with intricate floral designs. 
        The logo on the jersey is an abstract, cartoonified depiction the provided water bottle, designed for tasteful needlework stitching.
        The overall aesthetic is modern, professional, and appealing, suitable for production, highlighting Zava's innovative approach 
        to wearable technology.
        """,
        image="https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/a461189e-6778-4a20-9f1e-68e64cc25965.png",
    )
    response = await create_image(
        request=request
    )

    print(f"Image URL: {response.image_url}")

    image_path = response.image_url.replace(
        "localhost:8000/",
        "sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/",
    )
    os.system(f"start \"\" {image_path}")  # Clean up the image file after test
