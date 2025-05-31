# Sustineo

Your personal AI assistant with voice processing and agentic capabilities.

## About Sustineo
Sustineo is an AI-powered personal assistant application that demonstrates modern agentic features including voice processing, real-time communication, and AI agent management. Built with Azure AI services, it showcases how to create intelligent applications with GitHub Copilot assistance.

## Roles and Responsibilities
These are the experts on the Sustineo team where issues should be assigned for triaging:
 - Showing how GitHub Copilot’s agentic feature can help speed up development: @jldeen
 - Migrating legacy Java code: @jldeen
 - Show how to take advantage of the latest models @sethjuarez
 - Build with LLMs locally to add Agentic Features to the Sustineo app: @martinwoodward

## Quick Start

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## Setting up your Dev Environment
This project uses Visual Studio Code Dev Containers for a consistent development environment. The dev container comes pre-configured with:
- Python3 and pip
- Node.js and npm
- Required VS Code extensions
- All necessary development tools
- Add the configuration for the GitHub MCP server and the Figma MCP server
- You will need to create a GitHub token for the GitHub MCP as well as an API key for the Figma MCP Server *todo* - add instructions with links

### Getting Started
1. Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack in VS Code
2. Clone this repository
3. Open the project in VS Code
4. When prompted, click "Reopen in Container" or run the "Remote-Containers: Reopen in Container" command
5. The container will build and set up your development environment automatically, running the setup scripts and starting the services
6. **Note** This project can also be run in GitHub Codespaces

### Development Lifecycle
The dev container automatically handles the complete setup and startup process for you:
- When the container is built, it runs `./scripts/postCreate.sh` to initialize all dependencies
- When the container starts, it runs `./scripts/start.sh` to launch all services

### Manual Commands (if needed)
While the dev container handles these automatically, you can also run these commands manually if needed:

**Setup Commands:**
```bash
# Initialize API backend
cd api
python3 -m venv .venv
source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt debugpy

# Initialize Web frontend  
cd ../web
npm install
```

**Development Commands:**
```bash
# Start API server (from project root)
python ./scripts/start_api.py

# Start Web server (from project root)
cd web && npm run dev

# Stop all services (from project root)
./scripts/stop.sh
```

These commands are useful if you need to reset your environment or restart services manually.

### Additional Information
- Voice interaction capabilities with Azure OpenAI Realtime API
- AI agent management and function calling
- Real-time WebSocket communication
- Azure service integrations for storage and AI processing

For comprehensive setup instructions, environment variables, and deployment information, see [SETUP.md](./SETUP.md).
