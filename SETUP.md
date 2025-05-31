# Sustineo Development Setup Guide

This guide provides comprehensive instructions for setting up your development environment to run the Sustineo project successfully.

## 📋 Project Overview

**Sustineo** (also known as BuildEvents by Contoso) is an intelligent event management application that allows users to capture ideas about events they attend and adds agentic AI features to enhance the experience. The application supports voice input and helps users build and manage their own events.

For more details about the project's purpose and features, see the [README.md](./README.md).

## 🏗️ Architecture

The project consists of two main components:

- **API Backend** (`/api`): FastAPI-based Python server providing voice processing, AI agent management, and real-time communication
- **Web Frontend** (`/web`): React TypeScript application with real-time voice interaction capabilities

## 🔧 Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) for VS Code
- [Git](https://git-scm.com/)
- [Docker](https://docker.com/) (for dev containers)

### Alternative Prerequisites (for manual setup)
If you prefer not to use dev containers:
- [Python 3.12+](https://python.org/)
- [Node.js 20+](https://nodejs.org/)
- [npm 10+](https://npmjs.com/)

## 🚀 Quick Start (Recommended: Dev Containers)

The easiest way to get started is using VS Code Dev Containers, which provides a consistent, pre-configured development environment.

### 1. Clone and Open
```bash
git clone https://github.com/sethjuarez/sustineo.git
cd sustineo
code .
```

### 2. Open in Dev Container
When VS Code opens, you'll be prompted to "Reopen in Container". Click this, or:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Run "Dev Containers: Reopen in Container"

### 3. Automatic Setup
The dev container will automatically:
- Install Python 3.12 and Node.js 20
- Create a Python virtual environment in `/api/.venv`
- Install all Python dependencies
- Install all Node.js dependencies
- Start both development servers

### 4. Access the Application
Once setup completes:
- **Web Frontend**: http://localhost:5173
- **API Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Manual Setup (Alternative)

If you prefer to set up the environment manually without dev containers:

### 1. Clone Repository
```bash
git clone https://github.com/sethjuarez/sustineo.git
cd sustineo
```

### 2. Setup API Backend

#### Install Python Dependencies
```bash
cd api
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt debugpy
cd ..
```

#### Configure Environment Variables
Create a `.env` file in the `/api` directory with the following variables:

```bash
# Azure OpenAI Configuration
AZURE_VOICE_ENDPOINT=your_azure_openai_endpoint
AZURE_VOICE_KEY=your_azure_openai_api_key
AZURE_IMAGE_ENDPOINT=your_azure_image_endpoint  
AZURE_IMAGE_API_KEY=your_azure_image_api_key

# Azure Cosmos DB
COSMOSDB_CONNECTION=your_cosmos_db_connection_string

# Azure Storage
SUSTINEO_STORAGE=your_azure_storage_url

# Azure AI Foundry
FOUNDRY_CONNECTION=your_foundry_connection

# Monitoring (optional)
APPINSIGHTS_CONNECTIONSTRING=your_app_insights_connection
LOCAL_TRACING_ENABLED=true
```

### 3. Setup Web Frontend
```bash
cd web
npm install
cd ..
```

### 4. Start Development Servers

#### Start API Server (with debugger)
```bash
python scripts/start_api.py
```

#### Start Web Server (in a new terminal)
```bash
cd web
npm run dev
```

## 🌐 Environment Variables

### Required Variables
The following environment variables are required for full functionality:

| Variable | Description | Example |
|----------|-------------|---------|
| `AZURE_VOICE_ENDPOINT` | Azure OpenAI Realtime API endpoint | `https://your-resource.openai.azure.com/` |
| `AZURE_VOICE_KEY` | Azure OpenAI API key | `abc123...` |
| `COSMOSDB_CONNECTION` | Cosmos DB connection string | `AccountEndpoint=https://...` |
| `SUSTINEO_STORAGE` | Azure Storage account URL | `https://yourstorage.blob.core.windows.net/` |
| `FOUNDRY_CONNECTION` | Azure AI Foundry connection | Connection string for AI Foundry |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `AZURE_IMAGE_ENDPOINT` | Azure OpenAI image generation endpoint | Not set |
| `AZURE_IMAGE_API_KEY` | Azure OpenAI image API key | Not set |
| `APPINSIGHTS_CONNECTIONSTRING` | Application Insights for monitoring | Not set |
| `LOCAL_TRACING_ENABLED` | Enable local telemetry tracing | `false` |

## 🔄 Development Workflow

### Running the Application
```bash
# Start both servers (from project root)
./scripts/start.sh

# Stop all servers
./scripts/stop.sh
```

### Debugging
- **API Debugger**: Available on port 5678 (configured in `start_api.py`)
- **Web Dev Tools**: Available through browser developer tools
- **VS Code**: Debugging configurations included for both components

### Testing
```bash
# Run API tests
cd api
python -m pytest

# Type checking for web frontend  
cd web
npm run typecheck
```

### Building for Production
```bash
# Build web frontend
cd web
npm run build

# API runs directly with uvicorn (see Dockerfile)
```

## 🚢 Deployment

The project uses GitHub Actions to deploy to Azure Container Apps.

### Deployment Architecture
- **API**: Deployed as `sustineo-api` container app
- **Web**: Deployed as `sustineo-web` container app
- **Environment**: `contoso-concierge-env` on Azure
- **Resource Group**: `contoso-concierge`

### GitHub Actions Workflows

#### API Deployment (`.github/workflows/azure-container-api.yml`)
- **Trigger**: Push to `release` branch with changes in `api/**`
- **Process**: 
  1. Builds Docker container from `/api`
  2. Pushes to Azure Container Registry
  3. Deploys to Azure Container Apps
  4. Configures environment variables from GitHub secrets

#### Web Deployment (`.github/workflows/azure-container-web.yml`)
- **Trigger**: Push to `release` branch with changes in `web/**`
- **Process**:
  1. Retrieves API endpoint from deployed API container
  2. Updates endpoint configuration in web app
  3. Builds Docker container from `/web`
  4. Pushes to Azure Container Registry  
  5. Deploys to Azure Container Apps

### Required GitHub Secrets
For deployment to work, the following secrets must be configured in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Azure service principal client ID |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `REGISTRY_ENDPOINT` | Azure Container Registry endpoint |
| `REGISTRY_USERNAME` | Azure Container Registry username |
| `REGISTRY_PASSWORD` | Azure Container Registry password |

And these secrets for environment variables:
- `azure-openai-endpoint`
- `azure-openai-api-key`
- `azure-voice-endpoint`
- `azure-voice-key`
- `appinsights-connectionstring`
- `cosmosdb-connection`
- `foundry-connection`
- `azure-image-endpoint`
- `azure-image-api-key`
- `sustineo-storage`

### Deployment Process
1. Make your changes in a feature branch
2. Test locally to ensure everything works
3. Merge to `release` branch
4. GitHub Actions will automatically build and deploy

## 🛠️ Troubleshooting

### Common Issues

#### Dev Container Issues
- **Container won't start**: Ensure Docker is running and you have sufficient resources (4+ CPU cores recommended)
- **Extensions not working**: The container includes pre-configured VS Code extensions for the best development experience

#### API Issues
- **Import errors**: Ensure the Python virtual environment is activated and dependencies are installed
- **Port conflicts**: Default API port is 8000, debugger port is 5678
- **Azure connection errors**: Verify your environment variables are set correctly

#### Web Issues  
- **Build errors**: Run `npm install` to ensure dependencies are up to date
- **Port conflicts**: Default web port is 5173
- **API connection errors**: Ensure the API server is running on port 8000

#### Environment Variables
- **Missing variables**: The app will log warnings for missing environment variables
- **Local development**: Many Azure services can be mocked for local development

### Getting Help
- Check the individual README files in `/api` and `/web` directories for component-specific information
- Review the GitHub Issues for known problems and solutions
- The dev container setup should handle most configuration automatically

## 📝 Next Steps

After setup:
1. Explore the API documentation at http://localhost:8000/docs
2. Review the voice processing capabilities in `/api/voice/`
3. Understand the agent system in `/api/agent/`
4. Examine the React components in `/web/components/`
5. Test the real-time voice interaction features

For more detailed information about the project structure and components, refer to the [README.md](./README.md) and the component-specific README files in each directory.