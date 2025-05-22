# Sustineo

Sustineo is an application that combines AI capabilities with real-time interactions for voice and image generation.

- Magic function calling mapping for generic local function calls (A)
- Backchannel with utility function calls (A+S)*

## Prerequisites

- [Python 3.11](https://www.python.org/downloads/) or later for the API
- [Node.js 20](https://nodejs.org/) or later for the web component
- Azure subscription with the following services:
  - Azure OpenAI service (for voice capabilities)
  - Azure OpenAI service (for image generation)
  - Azure Cosmos DB account
  - Azure Blob Storage account

## Environment Setup

### API Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```
# Azure OpenAI for Voice
AZURE_VOICE_ENDPOINT=https://your-voice-openai-resource.openai.azure.com
AZURE_VOICE_KEY=your-voice-openai-key

# Azure OpenAI for Image Generation
AZURE_IMAGE_ENDPOINT=https://your-image-openai-resource.openai.azure.com
AZURE_IMAGE_API_KEY=your-image-openai-key

# Azure Storage
SUSTINEO_STORAGE=https://yourstorageaccount.blob.core.windows.net

# Azure Cosmos DB
COSMOSDB_CONNECTION=your-cosmosdb-connection-string

# Optional: Azure Foundry (if using)
FOUNDRY_CONNECTION=your-foundry-connection-string

# Optional: Local tracing
LOCAL_TRACING_ENABLED=false
```

### Web Environment Setup

The web component uses the API endpoints defined in `web/store/endpoint.ts`. By default, these are set to:
- WebSocket Endpoint: `ws://localhost:8000`
- API Endpoint: `http://localhost:8000`
- Web Endpoint: `http://localhost:5173`

Modify these values if you're deploying to a different environment.

## Installation

### API Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### Web Setup

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install the required Node.js packages:
   ```bash
   npm ci
   ```

## Running the Application

### Running the API (Backend)

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Start the FastAPI application:
   ```bash
   fastapi run main.py
   ```

   The API will be available at http://localhost:8000.

### Running the Web Application (Frontend)

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The web application will be available at http://localhost:5173.

3. For production builds:
   ```bash
   npm run build
   npm run start
   ```

## Docker Deployment

Both components include Dockerfiles for containerized deployment.

### Building and Running the API Container

```bash
cd api
docker build -t sustineo-api .
docker run -p 8000:8000 --env-file .env sustineo-api
```

### Building and Running the Web Container

```bash
cd web
docker build -t sustineo-web .
docker run -p 5173:5173 sustineo-web
```

## Azure Deployment

The application requires several Azure services. You can manually create these resources through the Azure Portal or use infrastructure as code (IaC) for automated deployment.

### Required Azure Resources

1. **Azure OpenAI Service** (for voice capabilities)
   - Deployment: gpt-4o-realtime-preview

2. **Azure OpenAI Service** (for image generation)
   - Deployment: gpt-image-1

3. **Azure Cosmos DB**
   - Database name: sustineo
   - Container name: VoiceConfigurations
   - Partition key: /id

4. **Azure Blob Storage**
   - Container: sustineo

Note: Make sure to update the environment variables with the appropriate connection details after creating these resources.