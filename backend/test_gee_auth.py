import ee
import sys
import os

print("Testing Earth Engine Authentication...")
try:
    # Try default initialization first
    ee.Initialize()
    print("SUCCESS: Earth Engine initialized successfully with default project.")
except Exception as e:
    print(f"Standard initialization failed: {e}")
    
    # Check for GEE_PROJECT environment variable
    project_id = os.getenv("GEE_PROJECT")
    if project_id:
        try:
            ee.Initialize(project=project_id)
            print(f"SUCCESS: Earth Engine initialized successfully with project '{project_id}'.")
        except Exception as e2:
            print(f"FAILURE: Could not initialize with project '{project_id}'. Error: {e2}")
    else:
        print("FAILURE: No default project found and GEE_PROJECT environment variable not set.")
        print("To fix this:")
        print("1. Find your Google Cloud Project ID (enabled for Earth Engine)")
        print("2. Run: earthengine set_project <your-project-id>")
        print("   OR set GEE_PROJECT environment variable")
