# Sustineo Development Setup Guide

## Project Overview

Sustineo (BuildEvents by Contoso) is an AI-powered event management application that allows users to capture ideas about events they attend and enhance them with agentic AI features. The application includes voice input capabilities and helps users build their own events.

For more information about the project, see the [README.md](README.md).

## Architecture

The project consists of two main components:
- **API Backend**: FastAPI-based server providing voice processing, agent management, and real-time communication
- **Web Frontend**: React-based user interface with real-time WebSocket communication

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Python 3.12+**: For the API backend
- **Node.js 20+**: For the web frontend  
- **npm**: Node package manager (comes with Node.js)
- **Git**: Version control
- **Visual Studio Code** (recommended): With Remote Development extension pack

### Optional but Recommended
- **Docker**: For containerized deployment
- **Azure CLI**: For Azure service management and deployment

## Development Environment Options

### Option 1: VS Code Dev Container (Recommended)

The easiest way to get started is using the pre-configured dev container:

1. **Install Prerequisites**:
   - [Visual Studio Code](https://code.visualstudio.com/)
   - [Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Clone and Open**:
   ```bash
   git clone https://github.com/sethjuarez/sustineo.git
   cd sustineo
   code .
   ```

3. **Reopen in Container**:
   - When prompted, click "Reopen in Container"
   - Or run the "Remote-Containers: Reopen in Container" command
   - The container will automatically build and set up the environment

4. **Automatic Setup**:
   - The dev container runs `./scripts/postCreate.sh` to install dependencies
   - It runs `./scripts/start.sh` to start both services automatically
   - API server will be available at http://localhost:8000
   - Web application will be available at http://localhost:5173

### Option 2: Local Development Setup

If you prefer to set up the environment locally:

#### 1. Clone the Repository
```bash
git clone https://github.com/sethjuarez/sustineo.git
cd sustineo
```

#### 2. Set Up the API Backend

```bash
# Navigate to API directory
cd api

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install debugpy  # For debugging support
```

#### 3. Set Up the Web Frontend

```bash
# Navigate to web directory (from project root)
cd web

# Install Node.js dependencies
npm install
```

#### 4. Environment Configuration

Create a `.env` file in the project root with the required environment variables:

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_api_key

# Azure Voice Services
AZURE_VOICE_ENDPOINT=your_azure_voice_endpoint
AZURE_VOICE_KEY=your_azure_voice_key

# Azure Storage
SUSTINEO_STORAGE=your_azure_storage_url

# Azure Cosmos DB
COSMOSDB_CONNECTION=your_cosmosdb_connection_string

# Azure AI Foundry
FOUNDRY_CONNECTION=your_foundry_connection_string

# Azure Image Generation
AZURE_IMAGE_ENDPOINT=your_azure_image_endpoint
AZURE_IMAGE_API_KEY=your_azure_image_api_key

# Application Insights (optional)
APPINSIGHTS_CONNECTIONSTRING=your_appinsights_connection

# Development Settings
LOCAL_TRACING_ENABLED=true
```

> **Note**: For development, you can start with mock/test credentials, but full functionality requires valid Azure service credentials.

## Running the Application

### Using Scripts (Recommended)

The project includes convenience scripts for easy development:

```bash
# From project root directory

# Set up the project (creates venv, installs dependencies)
make setup

# Start both API and web servers
make start

# Stop all services
make stop
```

### Manual Startup

If you prefer to run services manually:

#### Start API Server
```bash
# From project root
python scripts/start_api.py
```
This starts the API server with debugging enabled on:
- API: http://localhost:8000
- Debugger: port 5678

#### Start Web Server
```bash
# From web directory
cd web
npm run dev
```
This starts the web development server on http://localhost:5173

### Accessing the Application

Once both servers are running:
- **Web Application**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health

## Development Workflow

### API Development

The API is built with FastAPI and includes:
- **Real-time voice processing** with Azure OpenAI Realtime API
- **Agent management system** for AI agents
- **WebSocket communication** for real-time updates
- **Azure service integrations** (Storage, Cosmos DB, AI services)

Key files:
- `api/main.py`: Main FastAPI application
- `api/model.py`: Data models and types
- `api/agent/`: Agent management system
- `api/voice/`: Voice processing components

### Web Development

The web application is built with React and includes:
- **Real-time communication** via WebSocket
- **Voice interaction** capabilities
- **Event management** interface
- **AI agent interactions**

Key files:
- `web/app/`: React Router application structure
- `web/components/`: Reusable React components
- `web/store/`: State management with Zustand

### Testing

#### API Tests
```bash
# From api directory
cd api
source .venv/bin/activate
pytest
```

#### Web Tests
```bash
# From web directory  
cd web
npm run test  # If test script exists
```

## Deployment

The project uses GitHub Actions for automated deployment to Azure Container Apps.

### GitHub Actions Workflows

The project includes two main deployment workflows:

#### 1. API Deployment (`.github/workflows/azure-container-api.yml`)
- **Trigger**: Push to `release` branch with changes in `api/` directory
- **Process**:
  1. Builds Docker container for the API
  2. Pushes to Azure Container Registry
  3. Deploys to Azure Container Apps as `sustineo-api`
  4. Configures environment variables from GitHub secrets
- **Target**: Deploys to port 8000 with external ingress

#### 2. Web Deployment (`.github/workflows/azure-container-web.yml`)
- **Trigger**: Push to `release` branch with changes in `web/` directory  
- **Process**:
  1. Retrieves API endpoint from deployed API service
  2. Updates web configuration with correct endpoints
  3. Builds Docker container for the web application
  4. Pushes to Azure Container Registry
  5. Deploys to Azure Container Apps as `sustineo-web`
- **Target**: Deploys to port 3000 with external ingress and auto-scaling

### Required GitHub Secrets

For deployment to work, configure these secrets in your GitHub repository:

```
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id  
AZURE_SUBSCRIPTION_ID=your_azure_subscription_id
REGISTRY_ENDPOINT=your_container_registry_endpoint
REGISTRY_USERNAME=your_container_registry_username
REGISTRY_PASSWORD=your_container_registry_password
```

### Azure Resources Required

The deployment assumes these Azure resources exist:
- **Resource Group**: `contoso-concierge`
- **Container Environment**: `contoso-concierge-env`
- **Container Registry**: For storing Docker images
- **Azure Services**: OpenAI, Storage, Cosmos DB, etc.

### Manual Deployment

To deploy manually:

1. **Build and push containers**:
   ```bash
   # API
   cd api
   docker build -t your-registry/sustineo-api:latest .
   docker push your-registry/sustineo-api:latest
   
   # Web
   cd web
   docker build -t your-registry/sustineo-web:latest .
   docker push your-registry/sustineo-web:latest
   ```

2. **Deploy to Azure Container Apps**:
   ```bash
   az containerapp up --name sustineo-api \
     --image your-registry/sustineo-api:latest \
     --resource-group your-resource-group \
     --environment your-container-environment
   ```

## Troubleshooting

### Common Issues

1. **Port conflicts**: 
   - Stop any existing services on ports 8000, 5173, or 5678
   - Use `make stop` or `./scripts/stop.sh` to clean up

2. **Python virtual environment issues**:
   - Delete and recreate: `rm -rf api/.venv && cd api && python3 -m venv .venv`
   - Ensure you're using Python 3.12+

3. **Node.js dependency issues**:
   - Clear cache: `cd web && rm -rf node_modules package-lock.json && npm install`
   - Ensure you're using Node.js 20+

4. **Azure service connection issues**:
   - Verify environment variables are set correctly
   - Check Azure service credentials and permissions
   - For development, you can mock some services

### Getting Help

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the component-specific README files:
  - [API Documentation](api/README.md)
  - [Web Documentation](web/README.md)
  - [Agent System](api/agent/README.md)
  - [Testing](api/tests/README.md)

## Next Steps

After setup is complete:
1. Explore the API documentation at http://localhost:8000/docs
2. Try the voice interaction features in the web interface
3. Review the agent system in `api/agent/`
4. Check out the example agent in `demo_agent.py`
5. Consider contributing to the project!