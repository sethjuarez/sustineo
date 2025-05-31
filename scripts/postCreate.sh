#!/bin/bash

# set working directory to the root of the repository
cd "/workspaces/sustineo"

# Create and activate virtual environment for the API
cd api
echo "Creating virtual environment..."
python3 -m venv .venv
source .venv/bin/activate

# Install Python dependencies into the virtual environment
echo "Installing Python dependencies..."        
pip install -r requirements.txt debugpy

# Install Node.js dependencies
cd ../web
echo "Installing Node.js dependencies..."
npm install