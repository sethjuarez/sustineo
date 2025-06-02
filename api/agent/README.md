# Agent Directory

This directory contains the agent management and execution system for the Sustineo application. It provides a comprehensive framework for creating, managing, and executing AI agents with function calling capabilities.

## Overview

The agent system supports multiple types of agents:
- **Function Agents**: Custom Python functions decorated as agents
- **Prompty Agents**: AI agents defined using Prompty files
- **Foundry Agents**: Azure AI Foundry-based agents
- **Client Agents**: Browser-side agents for user interactions

## Core Components

### Agent Decorators (`decorators.py`)
Provides decorators for creating function-based agents:

**@agent Decorator:**
- Converts Python functions into callable agents
- Automatically extracts parameter types and descriptions
- Generates agent metadata for the system
- Supports type hints and annotations for parameter validation

**@function Decorator:**
- Creates standalone functions that can be called by agents
- Supports async operations and notifications
- Provides automatic parameter extraction and validation

**Features:**
- Automatic type inference from function signatures
- Parameter description extraction from type annotations
- Function registration and management
- Type-safe parameter handling

### Agent Functions (`functions.py`)
Contains example function implementations:

**Example Functions:**
- `example_function`: Basic async function with notification support
- `example_function_other`: Extended function with multiple parameter types

**Features:**
- Async operation support
- Agent update notifications
- Parameter validation and type checking
- Return value handling

### Agent Storage (`storage.py`)
Handles Azure Storage integration for agent assets:

**Storage Client:**
- Azure Blob Storage integration
- Async context manager for storage operations
- Container management and creation
- Credential handling with DefaultAzureCredential

**Image Storage:**
- Base64 image processing and storage
- UUID-based blob naming
- Batch image upload support
- Async generator for efficient processing

**Features:**
- Automatic container creation
- Secure credential management
- Efficient async file operations
- Error handling and cleanup

### Agent Handler (`handler.py`)
Manages Azure AI Foundry agent event handling:

**SustineoAgentEventHandler Class:**
- Extends Azure AI Projects AsyncAgentEventHandler
- Processes agent run events and status updates
- Handles tool calls and function execution
- Manages message history and deduplication

**Event Processing:**
- ThreadRun event handling
- RunStep processing with tool call support
- ThreadMessage content extraction
- Status update notifications

**Tool Execution:**
- Function tool call handling
- Parameter extraction and validation
- Async function execution
- Result processing and return

### Common Utilities (`common.py`)
Provides shared utilities and client management:

**Agent Management:**
- Custom agent loading from Prompty files
- Foundry agent integration
- Client agent definitions
- Agent registry and caching

**HTTP Utilities:**
- Async HTTP request helpers
- Azure service integration
- Request context management
- Error handling and retries

**Azure AI Projects:**
- Project client management
- Thread creation and management
- Message handling
- Credential management

### Built-in Agents (`agents.py`)
Contains pre-built agent implementations:

**Image Generation Agent:**
- GPT-Image-1 model integration
- Azure OpenAI DALL-E support
- Multiple image generation
- Storage integration for generated images

**Features:**
- Detailed prompt processing
- Quality and size configuration
- Batch image generation
- Automatic storage and URL generation
- Progress notifications

## Agent Types

### Function Agents
Python functions decorated with `@agent`:
```python
@agent(
    name="My Agent",
    description="Agent description"
)
async def my_agent(param: str, notify: AgentUpdateEvent) -> str:
    # Agent implementation
    return result
```

### Prompty Agents
AI agents defined in `.prompty` files with structured prompts and metadata.

### Foundry Agents
Agents created and managed through Azure AI Foundry with full lifecycle support.

### Client Agents
Browser-side agents that handle user interactions like file selection and input.

## Configuration

### Environment Variables
- `FOUNDRY_CONNECTION`: Azure AI Foundry connection string
- `AZURE_IMAGE_ENDPOINT`: Azure OpenAI image generation endpoint
- `AZURE_IMAGE_API_KEY`: Azure OpenAI API key
- `SUSTINEO_STORAGE`: Azure Storage account URL

### Agent Registration
Agents are automatically registered through:
1. Function decoration with `@agent`
2. Prompty file loading from `/agents` directory
3. Azure AI Foundry project integration
4. Manual client agent definitions

## Usage

### Creating a Function Agent
```python
from api.agent.decorators import agent
from api.model import AgentUpdateEvent

@agent(
    name="Example Agent",
    description="Processes data and returns results"
)
async def example_agent(
    data: str,
    count: int,
    notify: AgentUpdateEvent
) -> list[str]:
    await notify(id="processing", status="in_progress")
    # Process data
    await notify(id="processing", status="completed")
    return results
```

### Executing Agents
Agents are executed through:
1. Voice interface function calls
2. Direct API invocation
3. WebSocket message handling
4. Foundry agent orchestration

## Dependencies

- **Azure AI Projects**: Foundry agent integration
- **Azure Storage**: Asset storage and management
- **Azure Identity**: Authentication and credentials
- **Prompty**: AI prompt management
- **OpenTelemetry**: Observability and tracing
- **aiohttp**: Async HTTP operations

## Error Handling

The agent system includes comprehensive error handling:
- Function execution errors with detailed logging
- Azure service connectivity issues
- Parameter validation and type checking
- Resource cleanup and proper disposal
- Graceful degradation for missing services
