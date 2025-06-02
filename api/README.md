# API Directory

This directory contains the core API components for the Sustineo application, a FastAPI-based backend that provides voice processing, agent management, and real-time communication capabilities.

## Overview

The API is built using FastAPI and provides several key functionalities:
- Real-time voice processing and Azure OpenAI Realtime API integration
- Agent management and execution system
- WebSocket connections for real-time communication
- Telemetry and observability
- Azure service integrations (Storage, Cosmos DB, AI services)

## Core Components

### Main Application (`main.py`)
The FastAPI application entry point that:
- Configures CORS middleware for cross-origin requests
- Sets up application lifespan management
- Includes routers for voice and agent functionality
- Manages WebSocket connections for real-time communication
- Initializes telemetry and tracing

**Key Features:**
- Environment variable configuration for Azure services
- Application startup/shutdown lifecycle management
- Router inclusion for modular API organization

### Data Models (`model.py`)
Defines the core data structures used throughout the application:

**Configuration Classes:**
- `Configuration`: Agent system configuration with tools and content
- `DefaultConfiguration`: Default settings for voice/agent configurations

**Agent Classes:**
- `Agent`: Represents an AI agent with parameters and options
- `Function`: Represents callable functions with typed parameters
- `FunctionParameter`: Typed parameters for function definitions

**Event Classes:**
- `Update`: Base update event for WebSocket communication
- `AgentUpdateEvent`: Specific events for agent status updates
- `Content`: Content wrapper for various data types

### Connection Management (`connection.py`)
Handles WebSocket connections and real-time communication:

**Connection Class:**
- Wraps FastAPI WebSocket for enhanced functionality
- Provides methods for JSON communication
- Manages connection state and lifecycle

**ConnectionManager Class:**
- Manages multiple WebSocket connections by ID
- Handles connection creation, updates, and cleanup
- Supports broadcasting updates to connected clients

### Telemetry (`telemetry.py`)
Implements observability and monitoring:

**GenAIOTel Class:**
- Custom telemetry wrapper for AI operations
- Semantic mapping for telemetry attributes
- OpenTelemetry integration with Azure Monitor

**Features:**
- Span tracing for operations
- Attribute mapping and normalization
- Azure Monitor integration for production telemetry

## Directory Structure

```
api/
├── agent/          # Agent management and execution system
├── voice/          # Voice processing and realtime communication
├── tests/          # Test suite for API components
├── main.py         # FastAPI application entry point
├── model.py        # Data models and type definitions
├── connection.py   # WebSocket connection management
├── telemetry.py    # Observability and telemetry
├── requirements.txt # Python dependencies
└── Dockerfile      # Container configuration
```

## Dependencies

Key dependencies include:
- **FastAPI**: Modern web framework for APIs
- **OpenAI**: Azure OpenAI and Realtime API integration
- **Azure SDK**: Storage, Cosmos DB, AI Projects integration
- **Prompty**: AI prompt management and execution
- **OpenTelemetry**: Observability and tracing
- **WebSockets**: Real-time communication
- **Pydantic**: Data validation and serialization

## Environment Variables

Required environment variables:
- `AZURE_VOICE_ENDPOINT`: Azure OpenAI voice service endpoint
- `AZURE_VOICE_KEY`: Azure OpenAI API key
- `COSMOSDB_CONNECTION`: Cosmos DB connection string
- `SUSTINEO_STORAGE`: Azure Storage account URL
- `FOUNDRY_CONNECTION`: Azure AI Foundry connection
- `LOCAL_TRACING_ENABLED`: Enable local telemetry tracing

## Usage

The API serves as the backend for the Sustineo application, providing:
1. Voice interaction capabilities through Azure OpenAI Realtime API
2. AI agent management and execution
3. Real-time WebSocket communication
4. Data persistence through Azure services
5. Comprehensive telemetry and monitoring

## Getting Started

1. Install dependencies: `pip install -r requirements.txt`
2. Set required environment variables
3. Run the application: `uvicorn main:app --reload`
4. Access API documentation at `http://localhost:8000/docs`
