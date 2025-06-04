# Sustineo Development Setup Guide

This guide provides comprehensive setup instructions for first-time developers to get the Sustineo project running on their local development environment.

## Project Overview

**Sustineo** (also known as BuildEvents by Contoso) is an AI-powered event management application that allows users to capture ideas about events they attend and enjoy. The application includes agentic features, voice input support, and helps users build their own events.

For more detailed information about the project, roles, and responsibilities, see the main [README.md](./README.md).

### Architecture

The project consists of two main components:

- **API Backend**: FastAPI-based Python application with real-time voice processing, AI agent management, and Azure services integration
- **Web Frontend**: React/TypeScript application built with React Router for the user interface

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for dev containers)
- [Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) for VS Code

## Quick Start (Recommended)

The easiest way to get started is using VS Code Dev Containers, which provides a pre-configured development environment.

### 1. Clone and Open in Dev Container

```bash
# Clone the repository
git clone https://github.com/sethjuarez/sustineo.git
cd sustineo

# Open in VS Code
code .
```

When VS Code opens:
1. Click "Reopen in Container" when prompted, or
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and run "Remote-Containers: Reopen in Container"

### 2. Automatic Setup

The dev container will automatically:
- Build the container with Python 3, Node.js, and all required tools
- Run `./scripts/postCreate.sh` to install dependencies
- Run `./scripts/start.sh` to start both API and web servers

**Note**: The project can also be run in [GitHub Codespaces](https://github.com/codespaces) for an instant development environment.

### 3. Access the Application

Once setup is complete:
- **Web Frontend**: http://localhost:5173
- **API Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Manual Setup (Alternative)

If you prefer not to use dev containers, you can set up the project manually.

### Prerequisites for Manual Setup

- **Python 3.11+** with pip
- **Node.js 18+** with npm
- **Git**

### API Backend Setup

1. **Navigate to the API directory**:
   ```bash
   cd api
   ```

2. **Create and activate a Python virtual environment**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (optional for basic development):
   Create a `.env` file in the `api` directory with the following variables:
   ```env
   # Required for voice features (optional for basic setup)
   AZURE_VOICE_ENDPOINT=your_azure_openai_endpoint
   AZURE_VOICE_KEY=your_azure_openai_api_key
   
   # Required for data persistence (optional for basic setup)
   COSMOSDB_CONNECTION=your_cosmos_db_connection_string
   
   # Required for storage features (optional for basic setup)
   SUSTINEO_STORAGE=your_azure_storage_url
   
   # Required for AI agent features (optional for basic setup)
   FOUNDRY_CONNECTION=your_azure_ai_foundry_connection
   
   # Optional: Enable local tracing
   LOCAL_TRACING_ENABLED=true
   ```

5. **Start the API server**:
   
   From the project root directory:
   ```bash
   # Method 1: Using the provided script (recommended)
   python scripts/start_api.py
   ```
   
   Or alternatively from the API directory:
   ```bash
   # Method 2: Direct uvicorn command
   cd api
   source .venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Note**: The API server must be started from the project root directory for imports to work correctly.

### Web Frontend Setup

1. **Navigate to the web directory**:
   ```bash
   cd web
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Running Everything Together

### Using Scripts (Recommended)

From the project root directory:

```bash
# Start both API and web servers
./scripts/start.sh

# Stop all services
./scripts/stop.sh
```

### Manual Process

1. **Start the API backend** (in one terminal):
   ```bash
   # From the project root directory
   python scripts/start_api.py
   ```

2. **Start the web frontend** (in another terminal):
   ```bash
   cd web
   npm run dev
   ```

**Important**: Always start the API server from the project root directory to ensure proper module imports.

## Development Workflow

### Available Commands

The project provides several convenience scripts:

- **`./scripts/postCreate.sh`**: Initialize project dependencies (designed for dev containers, uses hardcoded paths)
- **`./scripts/start.sh`**: Start both API and web development servers
- **`./scripts/stop.sh`**: Stop all running services
- **`./scripts/start_api.py`**: Start API server with debugger support (port 5678)

**Note**: 
- The original README mentions `make` commands, but the project uses shell scripts instead. Use the script commands listed above.
- The `postCreate.sh` script is designed for dev containers and may not work correctly in manual setups due to hardcoded paths.

### Development Ports

- **API Server**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`
- **Web Server**: `http://localhost:5173`
- **Python Debugger**: `localhost:5678` (when using `start_api.py`)

### Testing

To run tests:

```bash
# API tests
cd api
source .venv/bin/activate
python -m pytest

# API tests with verbose output
python -m pytest -v

# Run specific test file
python -m pytest tests/test_agents_simple.py -v

# Web tests (build verification)
cd web
npm run build
npm run typecheck
```

**Note**: Some API tests may fail due to missing Azure environment variables - this is expected for local development without full Azure service configuration.

## Azure Deployment

The project uses GitHub Actions to automatically deploy to Azure Container Apps when changes are pushed to the `release` branch.

### Deployment Workflows

#### API Deployment (`.github/workflows/azure-container-api.yml`)

**Triggers**:
- Push to `release` branch with changes in `api/**`
- Manual workflow dispatch

**Process**:
1. Creates a timestamped tag (format: `vYYYYMMDD.HHMMSS`)
2. Authenticates with Azure using federated credentials
3. Builds Docker container from `api/Dockerfile`
4. Pushes container to Azure Container Registry
5. Deploys to Azure Container Apps with:
   - External ingress on port 8000
   - Heavy workload profile
   - Environment variables from Azure Key Vault secrets

**Required Secrets**:
- `AZURE_CLIENT_ID`: Azure service principal client ID
- `AZURE_TENANT_ID`: Azure tenant ID
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID
- `REGISTRY_ENDPOINT`: Container registry URL
- `REGISTRY_USERNAME`: Container registry username
- `REGISTRY_PASSWORD`: Container registry password

**Environment Variables**:
All sensitive configuration is stored as secrets in Azure Container Apps:
- `azure-openai-endpoint`, `azure-openai-api-key`: OpenAI services
- `azure-voice-endpoint`, `azure-voice-key`: Voice processing
- `cosmosdb-connection`: Database connection
- `foundry-connection`: AI Foundry connection
- `sustineo-storage`: Storage account
- `appinsights-connectionstring`: Application monitoring

#### Web Deployment (`.github/workflows/azure-container-web.yml`)

**Triggers**:
- Push to `release` branch with changes in `web/**`
- Manual workflow dispatch

**Process**:
1. Creates a timestamped tag
2. Retrieves API and web endpoints from existing deployments
3. Updates configuration files (`endpoint.ts`, `version.ts`) with deployment URLs
4. Builds Docker container from `web/Dockerfile`
5. Deploys to Azure Container Apps with:
   - External ingress on port 3000
   - Auto-scaling (1-5 replicas based on HTTP load)
   - 100 concurrent requests per replica scaling rule

### Deployment Configuration

The deployment targets the following Azure resources:
- **Resource Group**: `contoso-concierge`
- **Environment**: `contoso-concierge-env`
- **Applications**: `sustineo-api`, `sustineo-web`

### Manual Deployment

To deploy manually:

1. Ensure you have the required Azure CLI access and secrets configured
2. Push changes to the `release` branch:
   ```bash
   git checkout release
   git merge main
   git push origin release
   ```
3. Monitor the GitHub Actions workflows for deployment status

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8000 and 5173 are not in use by other applications
2. **Python virtual environment**: Make sure you're using the correct virtual environment in the `api` directory
3. **Node.js version**: Ensure you're using Node.js 18 or higher
4. **Docker issues**: Restart Docker Desktop if dev container setup fails
5. **API import errors**: Always start the API server from the project root directory, not from the `api/` subdirectory
6. **Azure service errors**: The application will show warnings about missing Azure services (like Application Insights) but will still function for local development
7. **Test failures**: Some tests may fail due to missing Azure environment variables - this is expected for local development

### Getting Help

- Check the [API documentation](./api/README.md) for backend-specific issues
- Check the [Web documentation](./web/README.md) for frontend-specific issues
- Review the project's [main README](./README.md) for additional context

### Development Notes

- The API includes a debugger that listens on port 5678 when started via `scripts/start_api.py`
- The web application uses React Router for client-side routing
- Both applications support hot reloading during development
- Azure services integration requires proper environment configuration

## Next Steps

After completing the setup:

1. Explore the API documentation at `http://localhost:8000/docs`
2. Review the codebase structure in the [main README](./README.md)
3. Check out the agent system in `api/agent/` for AI functionality
4. Look at the voice processing capabilities in `api/voice/`
5. Examine the React components in `web/components/`

Happy coding! 🚀