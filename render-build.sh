#!/usr/bin/env bash
# Exit on error
set -o errexit

# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Install system dependencies for Playwright
playwright install-deps chromium

# Install Playwright browsers
playwright install chromium

echo "Build completed successfully!"
