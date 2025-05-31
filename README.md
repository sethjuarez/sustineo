This is the website for Evently.

## About BuildEvents by Contoso
BuildEvents by Contoso is a website that allows people to capture ideas about events they go to and things that they enjoy, then add some agentic features to that website, support voice input and support them as they build their own event.

## Roles and Responsibilities
These are the experts on the evently team where issues should be assigned to for triaging
 - Showing how GitHub Copilot’s agentic feature can help speed up development: @jldeen
 - Migrating legacy Java code @jldeen
 - Show how to take advantage of the latest models @sethjuarez
 - Build with LLMs locally to add my own Agentic Features to my BuildEvents app @martinwoodward

## Setting up your Dev Environment

For comprehensive setup instructions including prerequisites, environment variables, deployment information, and troubleshooting, please see the **[SETUP.md](./SETUP.md)** guide.

### Quick Start
This project uses Visual Studio Code Dev Containers for the easiest setup experience:

1. Install the [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) extension pack in VS Code
2. Clone this repository and open in VS Code  
3. Click "Reopen in Container" when prompted
4. The dev container will automatically set up everything and start the services
5. Access the app at http://localhost:5173

### Manual Commands
If you need to control the services manually:

- `./scripts/start.sh` - Start both development servers
- `./scripts/stop.sh` - Stop all running services  
- `python scripts/start_api.py` - Start only the API server (with debugger)
- `cd web && npm run dev` - Start only the web server

The API runs on port 8000 (debugger on 5678) and the web app on port 5173.
