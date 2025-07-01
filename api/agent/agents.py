import asyncio
import os
import io
import base64
import json
from typing import Annotated

import aiohttp
import prompty
import prompty.azure  # type: ignore
from api.agent.decorators import agent
from api.model import AgentUpdateEvent, Content
from api.storage import save_image_blobs, save_video_blob
from api.agent.common import execute_foundry_agent, post_request


AZURE_IMAGE_ENDPOINT = os.environ.get("AZURE_IMAGE_ENDPOINT", "EMPTY").rstrip("/")
AZURE_IMAGE_API_KEY = os.environ.get("AZURE_IMAGE_API_KEY", "EMPTY")
AZURE_SORA_ENDPOINT = os.environ.get("AZURE_SORA_ENDPOINT", "EMPTY").rstrip("/")
AZURE_SORA_API_KEY = os.environ.get("AZURE_SORA_API_KEY", "EMPTY")
AZURE_OPENAI_ENDPOINT = os.environ.get("AZURE_OPENAI_ENDPOINT", "EMPTY").rstrip("/")
AZURE_OPENAI_API_KEY = os.environ.get("AZURE_OPENAI_API_KEY", "EMPTY")


@agent(
    name="Image Generation Agent",
    description="This agent can generate a number of images based upon a detailed description. This agent is based on the GPT-Image-1 model and is capable of generating images in a variety of styles. It can also generate images in a specific style, such as a painting or a photograph. The agent can also generate images with different levels of detail and complexity.",
)
async def gpt_image_generation(
    description: Annotated[
        str,
        "The detailed description of the image to be generated. The more detailed the description, the better the image will be. Make sure to include the style of the image, the colors, and any other details that will help the model generate a better image.",
    ],
    n: Annotated[int, "number of images to generate"],
    notify: AgentUpdateEvent,
) -> list[str]:

    await notify(
        id="image_generation",
        status="run in_progress",
        information="Starting image generation",
    )

    size: str = "1024x1024"
    quality: str = "low"
    api_version = "2025-04-01-preview"
    deployment_name = "gpt-image-1"
    endpoint = f"{AZURE_IMAGE_ENDPOINT}/openai/deployments/{deployment_name}/images/generations?api-version={api_version}"

    await notify(
        id="image_generation", status="step in_progress", information="Executing Model"
    )

    async with post_request(
        endpoint,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AZURE_IMAGE_API_KEY}",
        },
        json={
            "prompt": description,
            "size": size,
            "quality": quality,
            "output_compression": 100,
            "output_format": "png",
            "n": n,
        },
    ) as response:
        if "error" in response:
            print(response["error"])
            await notify(
                id="image_generation",
                status="step failed",
                information=response["error"],
            )
            return []

        await notify(
            id="image_generation",
            status="step in_progress",
            information="fetching images" if n > 1 else "fetching image",
        )

        # save the image to a file
        # iterate through the images and save them
        if not response["data"]:
            print("No images found in the response.")
            return []

        await notify(
            id="image_generation",
            status="step in_progress",
            information="storing images" if n > 1 else "storing image",
        )

        base64_images = [
            item["b64_json"] for item in response["data"] if item["b64_json"]
        ]

        images = []
        async for blob_name in save_image_blobs(base64_images):
            images.append(blob_name)
            await notify(
                id="image_generation",
                status="step completed",
                content=Content(
                    type="image",
                    content=[
                        {
                            "type": "image",
                            "description": description,
                            "size": size,
                            "quality": quality,
                            "image_url": blob_name,
                        }
                    ],
                ),
                output=True,
            )

        await notify(
            id="image_generation",
            status="run completed",
            information="Image generation complete",
        )

        return images


description_prompty = prompty.load("description.prompty")


@agent(
    name="Image Capture Agent",
    description="""
        This tool can capture an image using the user's camera.
        Trigger this tool when the user wants to take a picture.
        The system will automatically handle the camera capture
        and provide the image data to the agent for it to process.
        The agent will receive the image data as a base64 encoded string
        and create a description of the image based on the captured content.
        The agent should not ask the user to upload an image or take a picture,
        as the UI will handle this automatically based on the kind parameter.
        """,
)
async def gpt_image_capture(
    image: Annotated[
        str,
        "The base64 encoded image data captured from the user's camera. The UI will handle the camera capture and provide the image data to the agent.",
    ],
    kind: Annotated[
        str,
        'This can be either a file upload or an image that is captured with the users camera. Choose "FILE" if the image is uploaded from the users device. Choose "CAMERA" if the image should be captured with the users camera.',
    ],
    notify: AgentUpdateEvent,
):
    await notify(
        id="image_capture",
        status="run_in_progress",
        information="Starting image description generation",
    )

    if not image.startswith("data:image/jpeg;base64,"):
        image = "data:image/jpeg;base64," + image

    description = await prompty.execute_async(
        description_prompty, inputs={"image": image}
    )

    await notify(
        id="image_capture",
        status="run_in_progress",
        information="Persisting image and description",
    )

    images: list[str] = []
    async for blob in save_image_blobs([image.replace("data:image/jpeg;base64,", "")]):
        images.append(blob)
        await notify(
            id="image_capture",
            status="step completed",
            content=Content(
                type="image",
                content=[
                    {
                        "type": "image",
                        "description": description,
                        "image_url": blob,
                        "kind": kind,
                    }
                ],
            ),
            output=True,
        )

    await notify(
        id="image_capture",
        status="run completed",
        information="Image capture complete",
    )

    return images


@agent(
    name="Image Editing Agent",
    description="""
    This tool can edit an image based upon a detailed description and a provided image. 
    Trigger this tool with a description of the edit to be made along with
    a kind parameter that indicates whether the image is a file upload
    or a camera capture. The image will be used as a starting point for the edit.
    The more detailed the description, the better the image will be.
    The image itself will be automatically provided as a file or a camera capture,
    so you do not need to include the image in the request. If the user is uploading a file, 
    set the kind to "FILE" - the user will explictly mention an "upload". If the user is 
    capturing an image with their camera, set the kind to "CAMERA" - the user will explicitly 
    mention a "camera capture" or say "take a picture". IMPORTANT: Do not ask the user to upload an image,
    or to take a picture, as soon as you issue the function call the UI will handle this for 
    you based on the kind parameter - it is important that you do not ask the user to upload an image or take a picture,
    as this will cause the UI to not work correctly - just provide the description and the kind parameter.
    The image will be edited based on the description provided.
    """,
)
async def gpt_image_edit(
    description: Annotated[
        str,
        "The detailed prompt of image to be edited. The more detailed the description, the better the image will be. Make sure to include the style of the image, the colors, and any other details that will help the model generate a better image.",
    ],
    image: Annotated[
        str,
        "The base64 encoded image to be used as a starting point for the generation. You do not need to include the image itself, you can add a placeholder here since the UI will handle the image upload.",
    ],
    kind: Annotated[
        str,
        'This can be either a file upload or an image that is captured with the users camera. Choose "FILE" if the image is uploaded from the users device. Choose "CAMERA" if the image should be captured with the users camera.',
    ],
    notify: AgentUpdateEvent,
) -> list[str]:
    await notify(
        id="image_edit",
        status="run in_progress",
        information="Starting image edit",
    )

    api_version = "2025-04-01-preview"
    deployment_name = "gpt-image-1"
    endpoint = f"{AZURE_IMAGE_ENDPOINT}/openai/deployments/{deployment_name}/images/edits?api-version={api_version}"

    await notify(
        id="image_edit", status="step in_progress", information="Executing Model"
    )

    size: str = "1024x1024"
    quality: str = "low"

    # send image as multipart/form-data
    if image.startswith("data:image/jpeg;base64,"):
        image = image.replace("data:image/jpeg;base64,", "")

    form_data = aiohttp.FormData()
    img = io.BytesIO(base64.b64decode(image))
    form_data.add_field("image", img, filename="image.jpg", content_type="image/jpeg")
    form_data.add_field("prompt", description, content_type="text/plain")
    form_data.add_field("size", size, content_type="text/plain")
    form_data.add_field("quality", quality, content_type="text/plain")

    async with post_request(
        endpoint,
        headers={
            "Authorization": f"Bearer {AZURE_IMAGE_API_KEY}",
        },
        data=form_data,
    ) as response:
        if "error" in response:
            print(json.dumps(response, indent=2))
            await notify(
                id="image_generation",
                status="step failed",
                information=response["error"],
            )
            return []

        await notify(
            id="image_edit",
            status="step in_progress",
            information="fetching image",
        )

        # save the image to a file
        # iterate through the images and save them
        if not response["data"]:
            print("No images found in the response.")
            return []

        await notify(
            id="image_edit",
            status="step in_progress",
            information="storing image",
        )

        base64_images = [
            item["b64_json"] for item in response["data"] if item["b64_json"]
        ]

        images = []
        async for blob in save_image_blobs(base64_images):
            images.append(blob)
            await notify(
                id="image_edit",
                status="step completed",
                content=Content(
                    type="image",
                    content=[
                        {
                            "type": "image",
                            "description": description,
                            "image_url": blob,
                            "kind": kind,
                        }
                    ],
                ),
                output=True,
            )

        await notify(
            id="image_edit",
            status="run completed",
            information="Image edit complete",
        )

        return images


@agent(
    name="Sora Video Generation Agent",
    description="This agent can generate a video based on a detailed description. It is capable of generating videos in various styles and formats. The agent can also generate videos with different levels of detail and complexity.",
)
async def sora_video_generation(
    description: Annotated[
        str,
        "The detailed description of the video to be generated. The more detailed the description, the better the video will be. Make sure to include the style of the video, the colors, and any other details that will help the model generate a better video.",
    ],
    seconds: Annotated[
        int,
        "Duration of the video in seconds. The video can be between 1 and 20 seconds long. If unclear, consult the user or choose 10.",
    ],
    notify: AgentUpdateEvent,
) -> list[str]:
    await notify(
        id="sora_video_generation",
        status="run in_progress",
        information="Starting video generation",
    )

    await notify(
        id="sora_video_generation",
        status="step in_progress",
        information="Executing Model",
    )

    api_version = "preview"
    create_url = f"{AZURE_SORA_ENDPOINT}/openai/v1/video/generations/jobs?api-version={api_version}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AZURE_SORA_API_KEY}",
    }
    body = {
        "prompt": description,
        "width": 480,
        "height": 480,
        "n_seconds": seconds,
        "n_variants": 1,
        "model": "sora",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(create_url, headers=headers, json=body) as response:
            if response.status != 201:
                error_response = await response.json()
                print(error_response)
                await notify(
                    id="sora_video_generation",
                    status="step failed",
                    information=error_response.get("detail", "Unknown error"),
                )
                return []

            response_data = await response.json()
            job_id = response_data["id"]

            await notify(
                id="sora_video_generation",
                status="step_in_progress",
                information=f"Video generation job created: {job_id}",
            )

            status_url = f"{AZURE_SORA_ENDPOINT}/openai/v1/video/generations/jobs/{job_id}?api-version={api_version}"
            status = "started"
            status_data: dict = {}
            while status not in ("succeeded", "failed", "cancelled"):
                # async sleep to avoid hitting the API too frequently
                await asyncio.sleep(5)

                async with session.get(status_url, headers=headers) as status_response:
                    if status_response.status != 200:
                        error_response = await status_response.json()
                        print(error_response)
                        await notify(
                            id="sora_video_generation",
                            status="step failed",
                            information=error_response.get("error", "Unknown error"),
                        )
                        return []

                    status_data = await status_response.json()
                    if status != status_data["status"]:
                        await notify(
                            id="sora_video_generation",
                            status="step in_progress",
                            information=f'job status: {status_data["status"]}',
                        )

                    status = status_data["status"]

            if status == "succeeded":
                generations = status_data.get("generations", [])
                if generations:
                    generation_id = generations[0].get("id")
                    video_url = f"{AZURE_SORA_ENDPOINT}/openai/v1/video/generations/{generation_id}/content/video?api-version={api_version}"
                    async with session.get(
                        video_url, headers=headers
                    ) as video_response:
                        if video_response.status != 200:
                            error_response = await video_response.json()
                            print(error_response)
                            await notify(
                                id="video_generation",
                                status="step failed",
                                information=error_response.get(
                                    "error", "Unknown error"
                                ),
                            )
                            return []

                        await notify(
                            id="sora_video_generation",
                            status="step in_progress",
                            information="Moving video to storage",
                        )

                        # Save the video content
                        video_blob = await save_video_blob(video_response.content)

                        await notify(
                            id="sora_video_generation",
                            status="step completed",
                            content=Content(
                                type="video",
                                content=[
                                    {
                                        "type": "video",
                                        "description": description,
                                        "video_url": video_blob,
                                        "duration": seconds,
                                    }
                                ],
                            ),
                            output=True,
                        )
        await notify(
            id="sora_video_generation",
            status="run completed",
            information="Video generation complete",
        )

        return [""]

    return []


@agent(
    name="BuildEvents - Post to LinkedIn Agent - Local",
    description="""
You are a publishing agent responsible for posting finalized and approved LinkedIn posts. 

You will receive as input:
- title (string): Title of the post.
- content (string): Body of the post or finalized draft.
- image_url (string, optional): Format should always start with https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/
- example image_url: https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/acd7fe97-8d22-48ca-a06c-d38b769a8924.png
- use the provided image_url

You will take the draft and publish the post on LinkedIn by calling the OpenAPI tool.""",
)
async def publish_linkedin_post(
    content: Annotated[str, "Body of the post or finalized draft in markdown."],
    image_url: Annotated[
        str,
        "Format should always start with https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/",
    ],
    notify: AgentUpdateEvent,
):
    instructions = f"""
Use the following `image_url`: {image_url}
Use this `image_url` exactly as it is. Do not change the image_url or the content of the post.
The post should be in markdown format.
"""
    await execute_foundry_agent(
        agent_id="asst_MbvKNQxeTr5DL1wuE8DRYR3M",
        additional_instructions=instructions,
        query=f"Can you write a LinkedIn post based on the following content?\n\n{content}",
        tools={},
        notify=notify,
    )


@agent(
    name="Zava Custom Apparel Design Agent",
    description="""
    You are a custom apparel design agent for Zava that can take an image and a description of the design request and create a custom apparel design based on the provided image and description.
    You will receive as input:
    - description (string): The full design request description formulated in a specific way so as to elicit the desired response from the agent.
    - image_url (string, optional): Format should always start with https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/
    - example image_url: https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/acd7fe97-8d22-48ca-a06c-d38b769a8924.png
    - use the provided image_url
    """,
)
async def zava_custom_agent(
    description: Annotated[str, "The full design request description formulated in a specific way so as to elicit the desired response from the agent."],
    image_url: Annotated[
        str,
        "Format should always start with https://sustineo-api.jollysmoke-a2364653.eastus2.azurecontainerapps.io/images/",
    ],
    notify: AgentUpdateEvent,
):
    instructions = f"""
Use the following `image_url`: {image_url}
IMPORTANT: Use this `image_url` exactly as it is when calling your tools. Do not change the image_url.
"""
    await execute_foundry_agent(
        agent_id="asst_rdQIFaUBX7dVbdSFedJbQSpJ",
        additional_instructions=instructions,
        query=description,
        tools={},
        notify=notify,
    )
