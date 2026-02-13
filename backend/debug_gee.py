import ee
import os
import sys

# Force project ID for debugging
PROJECT_ID = "my-satellite-app-487321"
os.environ["GEE_PROJECT"] = PROJECT_ID

print(f"DEBUG: Starting Earth Engine debug script...")
print(f"DEBUG: Using project ID: {PROJECT_ID}")

try:
    print("DEBUG: Attempting ee.Initialize()...")
    try:
        ee.Initialize(project=PROJECT_ID)
        print("DEBUG: ee.Initialize(project=...) SUCCESS")
    except Exception as e:
        print(f"DEBUG: ee.Initialize(project=...) FAILED: {e}")
        print("DEBUG: Attempting generic ee.Initialize()...")
        ee.Initialize()
        print("DEBUG: Generic ee.Initialize() SUCCESS")

    # Now try to fetch an image
    print("DEBUG: Defining point and region...")
    latitude = 22.017307
    longitude = 82.479004
    point = ee.Geometry.Point([longitude, latitude])
    region = point.buffer(2000).bounds()
    
    print("DEBUG: query Sentinel-2 collection...")
    # Date range: 2024-01-01 to 2024-12-31 to ensure we find something
    start_date = '2024-01-01'
    end_date = '2024-12-31'
    
    collection = ee.ImageCollection('COPERNICUS/S2_SR') \
        .filterBounds(point) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
        .sort('system:time_start', False)
        
    print(f"DEBUG: Collection size: {collection.size().getInfo()}")
    
    image = collection.first()
    if image:
        print("DEBUG: Found image!")
        info = image.getInfo()
        print(f"DEBUG: Image ID: {info['id']}")
    else:
        print("DEBUG: No image found in collection.")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
