# Makefile for Sustineo Development Environment

.PHONY: setup start stop clean help

# Default target
help:
	@echo "Sustineo Development Commands:"
	@echo "  setup  - Initialize the project (create venv, install dependencies)"
	@echo "  start  - Start both API and web development servers"
	@echo "  stop   - Stop all running services and clean up processes"
	@echo "  clean  - Clean up build artifacts and dependencies"
	@echo "  help   - Show this help message"

# Initialize the project
setup:
	@echo "Setting up Sustineo development environment..."
	@echo "Creating Python virtual environment..."
	cd api && python3 -m venv .venv
	@echo "Installing Python dependencies..."
	cd api && .venv/bin/pip install -r requirements.txt debugpy
	@echo "Installing Node.js dependencies..."
	cd web && npm install
	@echo "Setup complete! Use 'make start' to run the application."

# Start development servers
start:
	@echo "Starting Sustineo development servers..."
	@./scripts/start.sh

# Stop all services
stop:
	@echo "Stopping Sustineo services..."
	@./scripts/stop.sh

# Clean up build artifacts and dependencies
clean:
	@echo "Cleaning up Sustineo project..."
	@echo "Removing Python virtual environment..."
	@rm -rf api/.venv
	@echo "Removing Node.js dependencies..."
	@rm -rf web/node_modules
	@rm -f web/package-lock.json
	@echo "Removing build artifacts..."
	@rm -f .python.pid .node.pid
	@echo "Clean complete!"

# Development helpers
api-only:
	@echo "Starting API server only..."
	cd api && .venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

web-only:
	@echo "Starting web server only..."
	cd web && npm run dev

# Install additional development tools
dev-tools:
	@echo "Installing additional development tools..."
	cd api && .venv/bin/pip install pytest pytest-asyncio pytest-mock mypy black isort
	cd web && npm install --save-dev @types/node typescript

# Run tests
test:
	@echo "Running API tests..."
	cd api && .venv/bin/python -m pytest
	@echo "API tests complete!"

# Check code quality
lint:
	@echo "Checking API code quality..."
	cd api && .venv/bin/python -m mypy . || true
	cd api && .venv/bin/python -m black --check . || true
	@echo "Checking web code quality..."
	cd web && npm run typecheck || true
	@echo "Lint check complete!"

# Format code
format:
	@echo "Formatting API code..."
	cd api && .venv/bin/python -m black .
	cd api && .venv/bin/python -m isort .
	@echo "Code formatting complete!"