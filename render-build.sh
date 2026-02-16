#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

# Install Python dependencies from backend directory
pip install -r backend/requirements.txt

# Install system dependencies for Playwright
playwright install-deps chromium

# Install Playwright browsers
playwright install chromium

echo "Build completed successfully!"
