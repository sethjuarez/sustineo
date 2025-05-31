# Sustineo Development Setup Guide

A comprehensive guide for setting up the Sustineo development environment from scratch.

## Project Overview

**Sustineo** is an AI-powered personal assistant application that provides voice processing, agent management, and real-time communication capabilities. The project demonstrates how to build modern agentic applications using Azure AI services and GitHub Copilot features.

For general project information, see the [README.md](./README.md).

### Architecture

The application consists of two main components:
- **API Backend**: FastAPI-based Python service providing voice processing, AI agent management, and Azure integrations
- **Web Frontend**: React TypeScript application with real-time voice interaction capabilities

## Prerequisites

Before you begin, ensure you have the following installed on your development machine:

### Required Software
- **Python 3.12+** with pip
- **Node.js 20+** with npm
- **Git** for version control
- **VS Code** (recommended) with the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack

### Azure Services (for full functionality)
- Azure OpenAI service with voice capabilities
- Azure Cosmos DB
- Azure Storage Account
- Azure AI Foundry/Projects
- Azure Container Registry (for deployment)

### Development Approaches

You can set up the development environment in two ways:

1. **VS Code Dev Containers** (Recommended) - Automated setup with consistent environment
2. **Manual Local Setup** - Traditional local development setup

---

## Option 1: VS Code Dev Containers Setup (Recommended)

The easiest way to get started is using the pre-configured dev container.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/sethjuarez/sustineo.git
   cd sustineo
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Reopen in Container**
   - When prompted, click "Reopen in Container"
   - Or use the command palette: `Remote-Containers: Reopen in Container`

4. **Wait for automatic setup**
   - The container will build and configure everything automatically
   - Dependencies will be installed via `./scripts/postCreate.sh`
   - Development servers will start automatically via `./scripts/start.sh`

5. **Access the application**
   - Frontend: http://localhost:5173
   - API Documentation: http://localhost:8000/docs
   - API Debugger: Available on port 5678

### Dev Container Features

The dev container provides:
- Pre-installed Python 3.12 and Node.js 22
- All required VS Code extensions
- Automatic dependency installation
- Pre-configured development servers
- Docker support for containerized development

---

## Option 2: Manual Local Setup

For developers who prefer traditional local setup or cannot use dev containers.

### Step 1: Clone the Repository

```bash
git clone https://github.com/sethjuarez/sustineo.git
cd sustineo
```

### Step 2: Set Up the API Backend

1. **Navigate to the API directory**
   ```bash
   cd api
   ```

2. **Create a Python virtual environment**
   ```bash
   python3 -m venv .venv
   ```

3. **Activate the virtual environment**
   ```bash
   # On Linux/macOS
   source .venv/bin/activate
   
   # On Windows
   .venv\Scripts\activate
   ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt debugpy
   ```

5. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

### Step 3: Set Up the Web Frontend

1. **Navigate to the web directory**
   ```bash
   cd ../web
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

### Step 4: Running the Application

#### Start the API Backend

1. **From the project root directory:**
   ```bash
   python ./scripts/start_api.py
   ```
   
   This starts:
   - FastAPI server on http://localhost:8000
   - Debug server on port 5678 (for VS Code debugging)

   **Alternative manual start:**
   ```bash
   cd api
   source .venv/bin/activate
   uvicorn main:app --reload
   ```

#### Start the Web Frontend

1. **In a new terminal, from the project root:**
   ```bash
   cd web
   npm run dev
   ```
   
   This starts the React development server on http://localhost:5173

### Step 5: Verify Setup

1. **Check API Health**
   - Visit http://localhost:8000/docs
   - You should see the FastAPI documentation interface

2. **Check Frontend**
   - Visit http://localhost:5173
   - You should see the Sustineo web application

3. **Test Integration**
   - The frontend should be able to communicate with the API backend
   - Voice features may require Azure service configuration

---

## Environment Variables

The application requires several environment variables for full functionality:

### Required for Local Development

Create a `.env` file in the `api` directory with the following variables:

```bash
# Azure OpenAI Voice Services
AZURE_VOICE_ENDPOINT=your_azure_openai_voice_endpoint
AZURE_VOICE_KEY=your_azure_openai_api_key

# Azure Cosmos DB
COSMOSDB_CONNECTION=your_cosmos_db_connection_string

# Azure Storage
SUSTINEO_STORAGE=your_azure_storage_account_url

# Azure AI Foundry
FOUNDRY_CONNECTION=your_azure_ai_foundry_connection

# Image Generation (Optional)
AZURE_IMAGE_ENDPOINT=your_azure_openai_endpoint_for_images
AZURE_IMAGE_API_KEY=your_azure_openai_api_key_for_images

# Development Settings
LOCAL_TRACING_ENABLED=true
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_VOICE_ENDPOINT` | Azure OpenAI voice service endpoint | Yes |
| `AZURE_VOICE_KEY` | Azure OpenAI API key for voice | Yes |
| `COSMOSDB_CONNECTION` | Cosmos DB connection string | Yes |
| `SUSTINEO_STORAGE` | Azure Storage account URL | Yes |
| `FOUNDRY_CONNECTION` | Azure AI Foundry connection string | Yes |
| `AZURE_IMAGE_ENDPOINT` | Azure OpenAI endpoint for image generation | Optional |
| `AZURE_IMAGE_API_KEY` | Azure OpenAI API key for images | Optional |
| `LOCAL_TRACING_ENABLED` | Enable local telemetry tracing | No |

---

## Development Commands

### Manual Development Commands

Since the project doesn't use a Makefile, use these direct commands:

#### API Backend Commands
```bash
# From project root
cd api

# Activate virtual environment
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows

# Start development server
uvicorn main:app --reload

# Start with debugger
python ../scripts/start_api.py

# Run tests
pytest

# Type checking
mypy .
```

#### Web Frontend Commands
```bash
# From project root
cd web

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run typecheck
```

#### Utility Scripts

The project includes helper scripts in the `scripts/` directory:

- `./scripts/postCreate.sh` - Initialize development environment
- `./scripts/start.sh` - Start both API and web services
- `./scripts/stop.sh` - Stop all running services

---

## Testing Your Setup

### Basic Functionality Test

1. **API Health Check**
   ```bash
   curl http://localhost:8000/docs
   ```

2. **Frontend Load Test**
   - Open http://localhost:5173 in your browser
   - Check browser console for any errors

3. **Integration Test**
   - Try interacting with the voice features (requires Azure configuration)
   - Check that API calls from frontend are working

### Troubleshooting Common Issues

1. **Port Conflicts**
   - API runs on port 8000, debugger on 5678
   - Frontend runs on port 5173
   - Use `lsof -i :PORT_NUMBER` to check for conflicts

2. **Python Virtual Environment Issues**
   ```bash
   # Remove and recreate if needed
   rm -rf api/.venv
   cd api && python3 -m venv .venv
   ```

3. **Node Dependencies Issues**
   ```bash
   # Clear and reinstall
   cd web
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## GitHub Actions Deployment

The project uses GitHub Actions for automated deployment to Azure Container Apps.

### Deployment Workflows

1. **API Deployment** (`.github/workflows/azure-container-api.yml`)
   - Triggers on pushes to `release` branch with `api/**` changes
   - Builds Docker container for the API
   - Deploys to Azure Container Apps

2. **Web Deployment** (`.github/workflows/azure-container-web.yml`)
   - Triggers on pushes to `release` branch with `web/**` changes
   - Builds Docker container for the frontend
   - Deploys to Azure Container Apps

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Azure service principal client ID |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `REGISTRY_ENDPOINT` | Azure Container Registry endpoint |
| `REGISTRY_USERNAME` | Container registry username |
| `REGISTRY_PASSWORD` | Container registry password |

### Azure Resources for Deployment

The deployment expects these Azure resources:
- **Resource Group**: `contoso-concierge`
- **Container Apps Environment**: `contoso-concierge-env`
- **Workload Profile**: `heavy-workload` (for API)
- **Container Registry**: For storing application images

### Deployment Process

1. **Prepare for Deployment**
   ```bash
   # Ensure all changes are committed
   git add .
   git commit -m "Prepare for deployment"
   ```

2. **Deploy to Production**
   ```bash
   # Push to release branch to trigger deployment
   git checkout release
   git merge main
   git push origin release
   ```

3. **Monitor Deployment**
   - Check GitHub Actions tab for workflow status
   - Monitor Azure Container Apps for successful deployment

---

## Next Steps

After completing the setup:

1. **Explore the API**: Visit http://localhost:8000/docs to see available endpoints
2. **Review the Code**: Check the `api/` and `web/` directories for implementation details
3. **Configure Azure Services**: Set up the required Azure services for full functionality
4. **Customize**: Modify the application to suit your specific needs

For more detailed information about the codebase:
- [API Documentation](./api/README.md)
- [Web Frontend Documentation](./web/README.md)
- [Project README](./README.md)

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the existing documentation in component README files
3. Check GitHub Issues for known problems
4. Create a new issue with detailed error information

---

**Happy coding with Sustineo! 🚀**