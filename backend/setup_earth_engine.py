"""
Manual Earth Engine Setup Script
Since the venv has path issues, this script helps authenticate Earth Engine manually
"""
import subprocess
import sys
import os

print("="*70)
print("Earth Engine Manual Setup")
print("="*70)

# Step 1: Check if earthengine-api is installed
print("\n[STEP 1] Checking if earthengine-api is installed...")
try:
    import ee
    print(f"  âœ“ earthengine-api version {ee.__version__} found")
    ee_installed = True
except ImportError:
    print("  âœ— earthengine-api not found in current environment")
    ee_installed = False
    
# Step 2: Install if needed
if not ee_installed:
    print("\n[STEP 2] Installing earthengine-api...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "earthengine-api"])
        print("  âœ“ Installation complete")
        import ee
    except Exception as e:
        print(f"  âœ— Installation failed: {e}")
        print("\nPlease run manually:")
        print("  pip install earthengine-api")
        sys.exit(1)

# Step 3: Authenticate
print("\n[STEP 3] Authenticating with Google Earth Engine...")
print("\nThis will open a browser window. Please:")
print("  1. Sign in with your Google account")
print("  2. Allow Earth Engine access")
print("  3. Follow the authentication flow")
print("\nPress Enter to continue...")
input()

try:
    ee.Authenticate()
    print("  âœ“ Authentication successful!")
except Exception as e:
    print(f"  âœ— Authentication failed: {e}")
    print("\nIf you see errors, make sure you've signed up at:")
    print("  https://signup.earthengine.google.com/")
    sys.exit(1)

# Step 4: Test initialization
print("\n[STEP 4] Testing Earth Engine initialization...")
try:
    ee.Initialize()
    print("  âœ“ Earth Engine initialized successfully!")
except Exception as e:
    print(f"  âœ— Initialization failed: {e}")
    sys.exit(1)

# Step 5: Test historical satellite fetch
print("\n[STEP 5] Testing historical satellite fetch...")
try:
    from datetime import datetime, timedelta
    
    # Test coordinates (Kapan)
    lat, lon = 22.017307, 82.479004
    
    end_date = datetime.now() - timedelta(days=365 * 2)
    start_date = end_date - timedelta(days=30)
    
    point = ee.Geometry.Point([lon, lat])
    region = point.buffer(2000).bounds()
    
    collection = ee.ImageCollection('COPERNICUS/S2_SR') \
        .filterBounds(point) \
        .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    
    count = collection.size().getInfo()
    print(f"  âœ“ Found {count} historical images in the time range")
    
    if count > 0:
        print("  âœ“ Historical satellite fetch is working!")
    else:
        print("  âš  No images found for this location/time")
        
except Exception as e:
    print(f"  âœ— Test failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "="*70)
print("âœ… EARTH ENGINE SETUP COMPLETE!")
print("="*70)
print("\nYou can now run gee.py to fetch historical satellite images!")
print("="*70)
