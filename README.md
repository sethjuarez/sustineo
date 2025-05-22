# Sustineo

Sustineo is an agent-based application framework that enables powerful interactions between different types of AI agents. It provides a flexible architecture for connecting and orchestrating various agents, allowing them to collaborate and share information.

- Magic function calling mapping for generic local function calls (A)
- Figure out backchannel with utility function calls (A+S)*

## Architecture

Sustineo is built on a multi-agent architecture with specialized agents working together through a central voice agent that maintains the global context. The system consists of the following components:

### Agent Types

Sustineo supports three types of agents:

1. **Foundry Agents** - External agents hosted on Azure AI Foundry, accessed through the Azure AI Project Client
2. **Custom Agents** - Defined in `.prompty` files and loaded dynamically at runtime
3. **Function Agents** - Python functions decorated with the `@agent` decorator

The Voice Agent serves as the central orchestrator with global context, while other agents provide specialized services with more local contexts.

### Agent Capabilities

The system includes several specialized agents:

1. **Voice Agent** - Central coordinator with global context that manages interactions with other agents
2. **Researcher Agent** - Performs searches and provides structured information based on user queries
3. **Image Generation Agent** - Creates images based on descriptive prompts using Azure OpenAI
4. **Function Agents** - Execute specific tasks like saving files or processing data
5. **Custom Prompty Agents** - Specialized agents defined in `.prompty` files for specific use cases
6. **Azure AI Foundry Agents** - Cloud-hosted agents that provide additional capabilities

### System Components

```mermaid
graph TD
    subgraph "Web Frontend"
        UI[User Interface]
        VC[Voice Configuration]
        WS[WebSocket Client]
    end

    subgraph "API Backend"
        API[FastAPI Server]
        VH[Voice Handler]
        AM[Agent Manager]
        WC[WebSocket Connection]
    end

    subgraph "Agents"
        VA[Voice Agent - Global Context]
        subgraph "Local Context Agents"
            RA[Researcher Agent]
            IGA[Image Generation Agent]
            FA[Function Agents]
            CA[Custom Agents]
            FDA[Foundry Agents]
        end
    end

    UI --> VC
    VC --> WS
    WS <--> WC
    API --> VH
    API --> AM
    AM --> VA
    VA --> RA
    VA --> IGA
    VA --> FA
    VA --> CA
    VA --> FDA
    WC --> AM
```

### Communication Patterns

The application follows these communication patterns:

1. **Voice Agent Orchestration** - The Voice Agent has access to the global context and can invoke other agents as tools
2. **Function Calling** - Agents can call functions on other agents through a standardized mechanism
3. **WebSocket Communication** - Real-time communication between the frontend and backend
4. **Agent Configuration** - The Voice Configuration component allows for dynamic selection of which agents to include as tools

#### Agent Interaction Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Web UI
    participant WS as WebSocket
    participant VA as Voice Agent
    participant AA as Additional Agents
    
    U->>UI: User Input
    UI->>WS: Send Request
    WS->>VA: Forward Request
    VA->>VA: Process with Global Context
    VA->>AA: Function Call (if needed)
    AA->>VA: Return Result
    VA->>WS: Stream Response
    WS->>UI: Update UI
    UI->>U: Display Result
```

#### Function Calling Mechanism

The function calling mechanism allows agents to leverage each other's capabilities. When an agent needs functionality from another agent:

1. It makes a function call with necessary parameters
2. The call is routed to the appropriate agent
3. The called agent executes the function and returns results
4. Results are integrated back into the calling agent's context

This mechanism enables complex multi-agent workflows while maintaining separation of concerns between agents.

### Component Descriptions

- **Voice Agent**: Central agent with global context that orchestrates interactions with other agents
- **Agent Manager**: Handles agent registration, discovery, and execution
- **Voice Configuration**: Allows configuration of the Voice Agent and selection of other agents as tools
- **WebSocket Connection**: Enables real-time communication between clients and agents

### Agent Execution Flow

When an agent is executed:
1. A thread is created for the execution
2. Messages are passed between the client and agent through this thread
3. Results are streamed back to the client in real-time
4. The Voice Agent can make calls to other agents as needed

This architecture allows for flexible, extensible agent interactions while maintaining a central context through the Voice Agent.

## Implementation Technologies

Sustineo is built using the following technologies:

### Backend
- **FastAPI**: High-performance web framework for building APIs
- **Azure AI Projects**: SDK for interacting with Azure AI Foundry agents
- **Prompty**: Framework for loading and executing prompt-based agents
- **WebSockets**: For real-time bidirectional communication

### Frontend
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **TanStack Query**: Data synchronization library for React
- **Mermaid.js**: JavaScript-based diagramming and charting tool