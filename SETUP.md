# Sustineo Development Setup Guide

## Project Overview

Sustineo is a personal AI assistant application built with modern web technologies and Azure AI services. The application provides voice-enabled AI interactions, agent management, and real-time communication capabilities.

**Architecture:**
- **Backend API**: FastAPI-based Python application with Azure AI integrations
- **Frontend Web**: React Router TypeScript application with real-time voice capabilities
- **Deployment**: Azure Container Apps with automated CI/CD via GitHub Actions

For more detailed information about the project, see the [README.md](./README.md).

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

### Required Software
- **Python 3.11+** - for the API backend
- **Node.js 18+** - for the web frontend  
- **npm 11.3.0+** - Node package manager
- **Git** - version control
- **Visual Studio Code** (recommended) - with Remote Development extension pack

### Azure Services (for full functionality)
- Azure OpenAI service with Realtime API access
- Azure Cosmos DB account
- Azure Storage account
- Azure AI Foundry (formerly Azure AI Studio)
- Azure Application Insights (optional, for telemetry)

### Development Environment Options
You can set up your development environment using one of these approaches:
1. **VS Code Dev Containers** (Recommended - fully automated)
2. **Manual Setup** (Step-by-step local installation)
3. **GitHub Codespaces** (Cloud-based development)

## Setup Option 1: VS Code Dev Containers (Recommended)

This is the easiest and most consistent way to get started, as it provides a pre-configured development environment.

### Prerequisites
- Visual Studio Code
- [Remote Development extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
- Docker Desktop (for local containers) or GitHub Codespaces

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/sethjuarez/sustineo.git
   cd sustineo
   ```

2. **Open in VS Code:**
   ```bash
   code .
   ```

3. **Reopen in Container:**
   - When prompted, click "Reopen in Container"
   - Or use Command Palette: `Remote-Containers: Reopen in Container`

4. **Wait for setup:**
   - The dev container will automatically build and configure everything
   - This includes Python virtual environment, Node.js dependencies, and VS Code extensions

5. **Automatic startup:**
   - The container runs `./scripts/postCreate.sh` to initialize dependencies
   - Then runs `./scripts/start.sh` to start all services
   - API server starts on port 8000 (with debugger on port 5678)
   - Web server starts on port 5173

### MCP Server Configuration (Optional)

The development environment includes optional MCP (Model Context Protocol) server configurations for enhanced development capabilities:
- **GitHub MCP Server**: Requires a GitHub Personal Access Token
- **Figma MCP Server**: Requires a Figma API key

These are configured in `.vscode/mcp.json` and are optional for basic development. Configuration instructions will be added in future updates.

## Setup Option 2: Manual Local Setup

If you prefer to set up the environment manually on your local machine:

### Backend API Setup

1. **Navigate to the API directory:**
   ```bash
   cd api
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   # Create virtual environment
   python3 -m venv .venv
   
   # Activate it
   # On macOS/Linux:
   source .venv/bin/activate
   # On Windows:
   .venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `api` directory with your Azure service credentials:
   ```env
   # Azure OpenAI Services
   AZURE_VOICE_ENDPOINT=your_azure_openai_endpoint
   AZURE_VOICE_KEY=your_azure_openai_api_key
   AZURE_IMAGE_ENDPOINT=your_azure_openai_endpoint
   AZURE_IMAGE_API_KEY=your_azure_openai_api_key
   
   # Azure Services
   COSMOSDB_CONNECTION=your_cosmos_db_connection_string
   SUSTINEO_STORAGE=your_azure_storage_url
   FOUNDRY_CONNECTION=your_azure_ai_foundry_connection
   
   # Optional: Application Insights
   APPINSIGHTS_CONNECTIONSTRING=your_appinsights_connection_string
   
   # Development settings
   LOCAL_TRACING_ENABLED=true
   ```

5. **Start the API server:**
   ```bash
   # Development server with auto-reload
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Or using FastAPI CLI
   fastapi dev main.py
   ```

### Frontend Web Setup

1. **Navigate to the web directory:**
   ```bash
   cd web
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The web application will be available at http://localhost:5173

### Verify Setup

1. **Check API health:**
   - Open http://localhost:8000/docs to see the FastAPI documentation
   - The API should be running and accessible

2. **Check web application:**
   - Open http://localhost:5173 to see the web interface
   - The application should connect to the API backend

## Running the Complete Application

### Using the Provided Scripts

The repository includes convenience scripts for common development tasks:

1. **Initialize/Reset everything:**
   ```bash
   # From project root
   ./scripts/postCreate.sh
   ```

2. **Start all services:**
   ```bash
   ./scripts/start.sh
   ```

3. **Stop all services:**
   ```bash
   ./scripts/stop.sh
   ```

### Manual Service Management

**Start API (from `api/` directory):**
```bash
# With virtual environment activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Start Web (from `web/` directory):**
```bash
npm run dev
```

### Service Endpoints

- **Web Application**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **API Redoc**: http://localhost:8000/redoc
- **WebSocket Connection**: ws://localhost:8000

## Environment Variables & Configuration

### Required Environment Variables

The application requires several Azure service credentials to function fully:

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_VOICE_ENDPOINT` | Azure OpenAI voice service endpoint | Yes |
| `AZURE_VOICE_KEY` | Azure OpenAI API key | Yes |
| `COSMOSDB_CONNECTION` | Cosmos DB connection string | Yes |
| `SUSTINEO_STORAGE` | Azure Storage account URL | Yes |
| `FOUNDRY_CONNECTION` | Azure AI Foundry connection | Yes |
| `AZURE_IMAGE_ENDPOINT` | Azure OpenAI image generation endpoint | Optional |
| `AZURE_IMAGE_API_KEY` | Azure OpenAI image generation API key | Optional |
| `APPINSIGHTS_CONNECTIONSTRING` | Application Insights connection | Optional |
| `LOCAL_TRACING_ENABLED` | Enable local telemetry tracing | Optional |

### Configuration Files

- **API Configuration**: Environment variables and `.env` file in `api/` directory
- **Web Configuration**: Endpoint configuration in `web/store/endpoint.ts`
- **Development Containers**: `.devcontainer/devcontainer.json`

## Production Deployment

### Azure Container Apps

The application is designed to deploy to Azure Container Apps using GitHub Actions workflows.

### GitHub Actions Workflows

The repository includes automated deployment pipelines:

1. **API Deployment** (`.github/workflows/azure-container-api.yml`):
   - **Trigger**: Push to `release` branch with changes in `api/**`
   - **Process**:
     - Builds Docker image from `api/Dockerfile`
     - Pushes to Azure Container Registry
     - Deploys to Azure Container Apps
     - Configures environment variables from GitHub secrets
   - **Target**: `sustineo-api` container app

2. **Web Deployment** (`.github/workflows/azure-container-web.yml`):
   - **Trigger**: Push to `release` branch with changes in `web/**`
   - **Process**:
     - Retrieves API endpoint from deployed API container
     - Updates endpoint configuration in web application
     - Builds Docker image from `web/Dockerfile`
     - Pushes to Azure Container Registry
     - Deploys to Azure Container Apps with auto-scaling
   - **Target**: `sustineo-web` container app

### Required GitHub Secrets

For deployment, configure these secrets in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Azure service principal client ID |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `REGISTRY_ENDPOINT` | Azure Container Registry endpoint |
| `REGISTRY_USERNAME` | Container registry username |
| `REGISTRY_PASSWORD` | Container registry password |

### Azure Resources Setup

1. **Resource Group**: `contoso-concierge`
2. **Container Apps Environment**: `contoso-concierge-env`
3. **Container Registry**: For storing Docker images
4. **Application Configuration**: Store connection strings as secrets

### Deployment Process

1. **Development**: Work on feature branches
2. **Testing**: Merge to main branch for integration testing
3. **Release**: Merge to `release` branch triggers deployment
4. **Production**: Applications are automatically deployed to Azure

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - API default: 8000, Web default: 5173
   - Change ports in startup commands if needed

2. **Python virtual environment issues:**
   ```bash
   # Recreate virtual environment
   rm -rf .venv
   python3 -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. **Node.js dependency issues:**
   ```bash
   # Clear npm cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Dev container script path issues:**
   - The `postCreate.sh` script may reference hardcoded paths
   - If dev container setup fails, run setup commands manually from the project root

5. **Azure service connectivity:**
   - Verify all environment variables are set correctly
   - Check Azure service endpoints and credentials
   - Review Azure service quotas and access permissions

6. **WebSocket connection issues:**
   - Ensure API server is running on port 8000
   - Check firewall settings
   - Verify CORS configuration in the API

### Development Tips

1. **API Development:**
   - Use FastAPI's automatic documentation at `/docs`
   - Enable debug mode for detailed error messages
   - Use pytest for running tests: `pytest tests/ -v`

2. **Web Development:**
   - Hot reload is enabled in development mode
   - Use browser dev tools for debugging
   - Check console for WebSocket connection status

3. **Container Development:**
   - Use VS Code dev containers for consistent environment
   - Container logs are available in VS Code terminal
   - Rebuild container if dependencies change

### Getting Help

- **Documentation**: Check component-specific READMEs in `api/` and `web/` directories
- **API Issues**: Review FastAPI documentation and Azure AI service docs
- **Web Issues**: Check React Router and TypeScript documentation
- **Deployment Issues**: Review GitHub Actions logs and Azure portal

## Additional Resources

- [Azure OpenAI Service Documentation](https://docs.microsoft.com/azure/ai-services/openai/)
- [Azure Container Apps Documentation](https://docs.microsoft.com/azure/container-apps/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Router Documentation](https://reactrouter.com/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)