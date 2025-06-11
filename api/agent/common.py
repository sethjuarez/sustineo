import os
import aiohttp
import prompty
from prompty.tracer import trace
import contextlib
from pathlib import Path
from typing import AsyncGenerator, Union, Unpack, Any
from aiohttp.client import _RequestOptions

from azure.ai.projects.aio import AIProjectClient
from azure.ai.projects.models import (
    MessageInputContentBlock,
    MessageAttachment,
)

from azure.identity.aio import DefaultAzureCredential
from prompty.core import Prompty

from api.model import Agent, AgentUpdateEvent, Function
from api.agent.handler import SustineoAgentEventHandler

FOUNDRY_CONNECTION = os.environ.get("FOUNDRY_CONNECTION", "EMPTY")
foundry_agents: dict[str, Agent] = {}
custom_agents: dict[str, Prompty] = {}


# load agents from prompty files in directory
async def get_custom_agents() -> dict[str, Prompty]:
    global custom_agents
    agents_dir = Path(__file__).parent / "agents"
    if not agents_dir.exists():
        # print(f"No custom agents found in {agents_dir}")
        return {}

    custom_agents.clear()
    for agent_file in agents_dir.glob("*.prompty"):
        agent_name = agent_file.stem
        prompty_agent = await prompty.load_async(str(agent_file))
        custom_agents[prompty_agent.id] = prompty_agent
        print(f"Loaded agent: {agent_name}")

    return custom_agents


def get_client_agents() -> dict[str, Agent]:
    # selection_agent = Agent(
    #    id="client_image_selection",
    #    name="Client Image Selection Task",
    #    type="client-agent",
    #    description="If the user needs to provide an image, call this agent to select the image. This agent will return the selected image.",
    #    parameters=[
    #        {
    #            "name": "image",
    #            "type": "string",
    #            "description": "The exact imnage url selected by the user. Use whatever is returned EXACTLY as it is.",
    #            "required": True,
    #        },
    #    ],
    # )

    return {
        # "selection_agent": selection_agent,
    }


@contextlib.asynccontextmanager
async def get_foundry_project_client():
    """Get a context manager for the Foundry project client."""
    creds = DefaultAzureCredential()
    project_client = AIProjectClient.from_connection_string(
        conn_str=FOUNDRY_CONNECTION, credential=creds
    )
    try:
        yield project_client
    finally:
        await creds.close()
        await project_client.close()


async def get_foundry_agents() -> dict[str, Agent]:
    global foundry_agents
    foundry_agents.clear()
    async with get_foundry_project_client() as project_client:
        last_id: Union[str, None] = None
        has_more = True

        while has_more:
            agents = await project_client.agents.list_agents(after=last_id)
            last_id = agents.last_id
            has_more = agents.has_more
            for agent in agents.data:
                last_id = agent["id"]
                if (
                    agent["description"] is not None
                    and len(str(agent["description"]).strip()) > 0
                ):
                    name =  agent["name"].strip().replace(" ", "_").lower()
                    foundry_agents[name] = Agent(
                        id=agent["id"],
                        name=agent["name"],
                        type="foundry-agent",
                        description=agent["description"],
                        parameters=[
                            {
                                "name": "additional_instructions",
                                "type": "string",
                                "description": f"Additional instructions for the \"{agent['name']}\" agent. Provide additional instructions for the system message of the agent to fulfill the task with the following description: {agent['description']}",
                                "required": True,
                            },
                            {
                                "name": "query",
                                "type": "string",
                                "description": f"Query for the \"{agent['name']}\" agent. Provide enough context to fulfill the task with the following description: {agent['description']}. Provide the query to the agent as if you were talking to it.",
                                "required": True,
                            },
                        ],
                    )

        return foundry_agents


@trace
async def execute_foundry_agent(
    agent_id: str,
    additional_instructions: str,
    query: str,
    tools: dict[str, Function],
    notify: AgentUpdateEvent,
):
    """Execute a Foundry agent."""

    async with get_foundry_project_client() as project_client:
        server_agent = await project_client.agents.get_agent(agent_id)
        thread = await project_client.agents.create_thread()
        await project_client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=query,
        )

        handler = SustineoAgentEventHandler(project_client, tools, notify)
        async with await project_client.agents.create_stream(
            agent_id=server_agent.id,
            thread_id=thread.id,
            additional_instructions=additional_instructions,
            event_handler=handler,
        ) as stream:
            await stream.until_done()


@trace
async def create_foundry_thread():
    async with get_foundry_project_client() as project_client:
        thread = await project_client.agents.create_thread()
        return thread.id


async def create_thread_message(
    thread_id: str,
    role: str,
    content: Union[str, list[MessageInputContentBlock]],
    attachments: list[MessageAttachment] = [],
    metadata: dict[str, str] = {},
):
    async with get_foundry_project_client() as project_client:
        message = await project_client.agents.create_message(
            thread_id=thread_id,
            role=role,
            content=content,
            metadata=metadata,
            attachments=attachments,
        )
        return message.id


@contextlib.asynccontextmanager
async def post_request(
    url: str, **kwargs: Unpack[_RequestOptions]
) -> AsyncGenerator[dict[str, Any], None]:
    async with aiohttp.ClientSession() as session:
        async with session.post(url, **kwargs) as response:
            if response.status != 200:
                state = await response.json()
                yield state
            else:
                response_data = await response.json()
                yield response_data
