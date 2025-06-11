# Sustineo Setup Guide

This guide provides comprehensive setup instructions for first-time users to get the Sustineo project running on their development machine.

## About Sustineo

Sustineo is an AI-powered personal assistant application that provides voice interaction capabilities and agent-based functionality. The project combines a FastAPI backend with a React TypeScript frontend to deliver real-time voice processing and intelligent AI agent interactions.

For additional project information, see the [README.md](README.md).

## Project Architecture

- **Backend API** (`/api`): Python FastAPI application with Azure service integrations
- **Frontend Web App** (`/web`): React TypeScript application with real-time communication
- **Azure Services**: OpenAI, Cosmos DB, Storage, and AI Foundry integrations
- **Deployment**: Azure Container Apps with automated CI/CD

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.12+** (for the API backend)
- **Node.js 20+** (for the web frontend)
- **npm** (comes with Node.js)
- **Git** (for version control)

Optional but recommended:
- **Visual Studio Code** with the Remote Development extension pack
- **Docker** (if using dev containers)
- **Azure CLI** (for deployment)

## Quick Start with Dev Containers (Recommended)

The easiest way to get started is using Visual Studio Code Dev Containers:

1. **Install Prerequisites**:
   - Install [Visual Studio Code](https://code.visualstudio.com/)
   - Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack

2. **Clone and Open**:
   ```bash
   git clone https://github.com/sethjuarez/sustineo.git
   cd sustineo
   code .
   ```

3. **Start Dev Container**:
   - When prompted, click "Reopen in Container"
   - Or run command: "Remote-Containers: Reopen in Container"
   - The container will automatically build and set up your environment

4. **Automatic Setup**:
   - The dev container runs `./scripts/postCreate.sh` to initialize dependencies
   - Services start automatically via `./scripts/start.sh`
   - Access the app at `http://localhost:5173` (web) and `http://localhost:8000` (API)

**Note**: This project also works in [GitHub Codespaces](https://github.com/features/codespaces).

## Manual Setup (Alternative)

If you prefer not to use dev containers, follow these manual setup steps:

### 1. Clone the Repository

```bash
git clone https://github.com/sethjuarez/sustineo.git
cd sustineo
```

### 2. Set Up the API Backend

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
   pip install -r requirements.txt debugpy
   ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables) section):
   ```bash
   cp .env.example .env  # If available, or create .env manually
   # Edit .env with your Azure service credentials
   ```

### 3. Set Up the Web Frontend

1. **Navigate to the web directory**:
   ```bash
   cd ../web  # From root: cd web
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

### 4. Running the Application

You have several options for running the application:

#### Option A: Using Scripts (Recommended)

From the project root:

```bash
# Start both API and web servers
./scripts/start.sh

# Stop all services
./scripts/stop.sh
```

#### Option B: Manual Startup

**Terminal 1 - API Backend**:
```bash
cd api
source .venv/bin/activate
python ../scripts/start_api.py
```
The API will be available at `http://localhost:8000` with debugging on port `5678`.

**Terminal 2 - Web Frontend**:
```bash
cd web
npm run dev
```
The web app will be available at `http://localhost:5173`.

## Environment Variables

The API backend requires several Azure service credentials. Create a `.env` file in the `api` directory with the following variables:

### Required Variables

```bash
# Azure OpenAI Voice Services
AZURE_VOICE_ENDPOINT=your_azure_openai_endpoint
AZURE_VOICE_KEY=your_azure_openai_key

# Azure Cosmos DB
COSMOSDB_CONNECTION=your_cosmosdb_connection_string

# Azure Storage
SUSTINEO_STORAGE=your_azure_storage_account_url

# Azure AI Foundry
FOUNDRY_CONNECTION=your_foundry_connection_string

# Azure OpenAI for Image Generation
AZURE_IMAGE_ENDPOINT=your_azure_openai_image_endpoint
AZURE_IMAGE_API_KEY=your_azure_openai_image_key

# Optional: Local Development
LOCAL_TRACING_ENABLED=true
```

### Getting Azure Credentials

1. **Azure OpenAI**: Create an Azure OpenAI resource in the Azure portal
2. **Cosmos DB**: Create a Cosmos DB account with SQL API
3. **Azure Storage**: Create a storage account for blob storage
4. **Azure AI Foundry**: Set up an AI Foundry project for agent management

For detailed Azure setup instructions, refer to the [Azure documentation](https://docs.microsoft.com/azure/).

## Development Workflow

### Testing the Setup

1. **Verify API is running**:
   - Open `http://localhost:8000/docs` to see the FastAPI documentation
   - Check health endpoint: `http://localhost:8000/health` (if available)

2. **Verify Web App is running**:
   - Open `http://localhost:5173` to see the web interface
   - Check browser console for any connection errors

3. **Test voice functionality**:
   - Ensure microphone permissions are granted
   - Test voice input/output features in the web interface

### Running Tests

**API Tests**:
```bash
cd api
source .venv/bin/activate
pytest
```

**Web Tests** (if available):
```bash
cd web
npm test
```

### Development Commands

The project includes several helpful development commands:

- **Start services**: `./scripts/start.sh`
- **Stop services**: `./scripts/stop.sh`
- **API with debugger**: `python ./scripts/start_api.py`

**Note**: The `postCreate.sh` script is designed for dev containers and may need path adjustments for local development.

### Code Formatting and Linting

**Python (API)**:
```bash
cd api
mypy .  # Type checking
```

**TypeScript (Web)**:
```bash
cd web
npm run typecheck  # Type checking
```

## Production Deployment

The project uses Azure Container Apps for production deployment with automated CI/CD through GitHub Actions.

### Deployment Architecture

- **API Backend**: Deployed as a container app (`sustineo-api`)
- **Web Frontend**: Deployed as a container app (`sustineo-web`)
- **Resource Group**: `contoso-concierge`
- **Environment**: `contoso-concierge-env`

### GitHub Actions Workflows

The project includes two main deployment workflows:

#### 1. API Deployment (`.github/workflows/azure-container-api.yml`)

**Triggers**:
- Push to `release` branch with changes in `api/**`
- Manual workflow dispatch

**Process**:
1. Creates timestamped version tag
2. Authenticates with Azure using OIDC
3. Builds and pushes Docker image to Azure Container Registry
4. Deploys to Azure Container Apps with environment variables from secrets
5. Configures ingress on port 8000 with external access

**Required Secrets**:
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
- `REGISTRY_ENDPOINT`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`
- Azure service secrets (see environment variables section)

#### 2. Web Deployment (`.github/workflows/azure-container-web.yml`)

**Triggers**:
- Push to `release` branch with changes in `web/**`
- Manual workflow dispatch

**Process**:
1. Creates timestamped version tag
2. Authenticates with Azure using OIDC
3. Retrieves API and web endpoints from existing container apps
4. Updates endpoint configuration files
5. Builds and pushes Docker image to Azure Container Registry
6. Deploys to Azure Container Apps with auto-scaling configuration

**Features**:
- Automatic endpoint discovery and configuration
- Auto-scaling: 1-5 replicas based on HTTP concurrency (100 requests/replica)
- Ingress on port 3000 with external access

### Deployment Setup

To set up automated deployment:

1. **Configure Azure Resources**:
   - Create Azure Container Registry
   - Set up Azure Container Apps environment
   - Configure managed identity for GitHub Actions

2. **Set GitHub Secrets**:
   ```
   AZURE_CLIENT_ID=your_client_id
   AZURE_TENANT_ID=your_tenant_id  
   AZURE_SUBSCRIPTION_ID=your_subscription_id
   REGISTRY_ENDPOINT=your_registry.azurecr.io
   REGISTRY_USERNAME=your_registry_username
   REGISTRY_PASSWORD=your_registry_password
   
   # Azure service secrets
   azure-openai-endpoint=your_endpoint
   azure-openai-api-key=your_key
   azure-voice-endpoint=your_voice_endpoint
   azure-voice-key=your_voice_key
   appinsights-connectionstring=your_connection_string
   cosmosdb-connection=your_cosmosdb_connection
   foundry-connection=your_foundry_connection
   azure-image-endpoint=your_image_endpoint
   azure-image-api-key=your_image_key
   sustineo-storage=your_storage_url
   ```

3. **Deploy**:
   - Push changes to the `release` branch
   - Or manually trigger workflows in GitHub Actions

### Manual Deployment

For manual deployment using Azure CLI:

```bash
# Login to Azure
az login

# Build and push API
cd api
az acr build --registry your_registry --image sustineo-api:latest .

# Build and push Web
cd ../web
az acr build --registry your_registry --image sustineo-web:latest .

# Deploy container apps (configure as needed)
az containerapp up --name sustineo-api --image your_registry.azurecr.io/sustineo-api:latest
az containerapp up --name sustineo-web --image your_registry.azurecr.io/sustineo-web:latest
```

## Troubleshooting

### Common Issues

**Python virtual environment issues**:
```bash
# Recreate virtual environment
cd api
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt debugpy
```

**Node.js dependency issues**:
```bash
# Clear npm cache and reinstall
cd web
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Port conflicts**:
- API runs on port 8000 (debugger on 5678)
- Web runs on port 5173
- Ensure these ports are available

**Azure connection issues**:
- Verify all environment variables are set correctly
- Check Azure service status and quotas
- Ensure proper authentication and permissions

### Getting Help

- Check the [Issues](https://github.com/sethjuarez/sustineo/issues) page for known problems
- Review Azure service documentation for credential setup
- Check application logs for detailed error messages

## Next Steps

Once you have the application running:

1. **Explore the API**: Visit `http://localhost:8000/docs` for API documentation
2. **Test voice features**: Try the voice interaction capabilities
3. **Review agent functionality**: Explore the AI agent management features
4. **Customize configurations**: Modify prompts and agent behaviors as needed
5. **Deploy to Azure**: Set up production deployment when ready

For more detailed information about specific components, see the README files in the `api/` and `web/` directories.