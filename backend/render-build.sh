#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers without system dependencies
# Render's environment should have the necessary system libs
echo "Installing Playwright browsers..."
playwright install chromium --with-deps || playwright install chromium

echo "Build completed successfully!"
