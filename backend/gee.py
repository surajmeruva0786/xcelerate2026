import requests
from datetime import datetime, timedelta
import os
import json

# Try to import Earth Engine (optional - for historical satellite)
try:
    import ee
    EE_AVAILABLE = True
except ImportError:
    EE_AVAILABLE = False
    print("⚠️  Earth Engine not available. Historical satellite fetch will be skipped.")

DOWNLOAD_DIR = "downloads"

# Initialize Earth Engine (requires authentication)
def initialize_earth_engine():
    """Initialize Google Earth Engine"""
    try:
        ee.Initialize()
        return True
    except:
        try:
            ee.Authenticate()
            ee.Initialize()
            return True
        except Exception as e:
            print(f"Failed to initialize Earth Engine: {e}")
            return False

def fetch_historical_satellite_gee(latitude, longitude, area_name, years_ago=2):
    """
    Fetch historical satellite image from Google Earth Engine
    """
    if not EE_AVAILABLE:
        print("⚠️  Earth Engine API not installed. Skipping historical satellite fetch.")
        return None
    
    if not initialize_earth_engine():
        return None
    
    try:
        # Calculate date range (2 years ago)
        end_date = datetime.now() - timedelta(days=365 * years_ago)
        start_date = end_date - timedelta(days=30)  # Get 30-day window
        
        # Define point and region
        point = ee.Geometry.Point([longitude, latitude])
        region = point.buffer(2000).bounds()
        
        # Get Sentinel-2 imagery (available from 2015 onwards)
        collection = ee.ImageCollection('COPERNICUS/S2_SR') \
            .filterBounds(point) \
            .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
            .sort('system:time_start', False)
        
        # Get the most recent image in that time period
        image = collection.first()
        
        if image is None:
            print(f"No historical imagery found for {years_ago} years ago")
            return None
        
        # Get image URL
        url = image.select(['B4', 'B3', 'B2']).getThumbURL({
            'region': region.getInfo(),
            'dimensions': 1024,
            'format': 'png',
            'min': 0,
            'max': 3000
        })
        
        # Download the image
        response = requests.get(url)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_{years_ago}years_ago_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Historical satellite image ({years_ago} years ago) saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download historical image")
            return None
            
    except Exception as e:
        print(f"Error fetching historical satellite: {e}")
        return None

def fetch_satellite_image_mapbox(latitude, longitude, area_name, label="current"):
    """
    Fetch current satellite image using Mapbox Static API
    """
    try:
        access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
        
        base_url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static"
        
        zoom = 15
        width = 1280
        height = 1280
        
        url = f"{base_url}/{longitude},{latitude},{zoom}/{width}x{height}"
        
        params = {
            'access_token': access_token
        }
        
        print(f"Fetching Mapbox satellite image ({label}) for coordinates: {latitude}, {longitude}")
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_{label}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Satellite image ({label}) saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download satellite image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_osm_image_mapbox(latitude, longitude, area_name, label="current"):
    """
    Fetch OSM (OpenStreetMap) layer image using Mapbox
    """
    try:
        access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
        
        base_url = f"https://api.mapbox.com/styles/v1/mapbox/streets-v11/static"
        
        zoom = 15
        width = 1280
        height = 1280
        
        url = f"{base_url}/{longitude},{latitude},{zoom}/{width}x{height}"
        
        params = {
            'access_token': access_token
        }
        
        print(f"Fetching OSM layer image ({label}) for coordinates: {latitude}, {longitude}")
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"osm_{area_name}_{label}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ OSM image ({label}) saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download OSM image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_satellite_image_esri(latitude, longitude, area_name, label="current"):
    """
    Fetch current satellite image using ESRI ArcGIS
    """
    try:
        base_url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export"
        
        offset = 0.01
        bbox = f"{longitude-offset},{latitude-offset},{longitude+offset},{latitude+offset}"
        
        params = {
            'bbox': bbox,
            'bboxSR': 4326,
            'size': '1024,1024',
            'imageSR': 4326,
            'format': 'png',
            'f': 'image'
        }
        
        print(f"Fetching ESRI satellite image ({label}) for coordinates: {latitude}, {longitude}")
        
        response = requests.get(base_url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_{label}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Satellite image ({label}) saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download satellite image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_osm_image_esri(latitude, longitude, area_name, label="current"):
    """
    Fetch OSM layer image using ESRI ArcGIS OpenStreetMap
    Note: OSM doesn't have historical data in these free APIs
    """
    try:
        base_url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/export"
        
        offset = 0.01
        bbox = f"{longitude-offset},{latitude-offset},{longitude+offset},{latitude+offset}"
        
        params = {
            'bbox': bbox,
            'bboxSR': 4326,
            'size': '1024,1024',
            'imageSR': 4326,
            'format': 'png',
            'f': 'image'
        }
        
        print(f"Fetching ESRI OSM layer image ({label}) for coordinates: {latitude}, {longitude}")
        
        response = requests.get(base_url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"osm_{area_name}_{label}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ OSM image ({label}) saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download OSM image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def parse_coordinates(location_string):
    """
    Parse coordinates from location string like '22.017307°N, 82.479004°E'
    Returns (latitude, longitude) as floats
    """
    import re
    
    if not location_string or location_string == "Not found":
        return None, None
    
    pattern = r'(\d+\.?\d*)°?([NS]),?\s*(\d+\.?\d*)°?([EW])'
    match = re.search(pattern, location_string, re.IGNORECASE)
    
    if match:
        lat = float(match.group(1))
        lat_dir = match.group(2).upper()
        lon = float(match.group(3))
        lon_dir = match.group(4).upper()
        
        if lat_dir == 'S':
            lat = -lat
        if lon_dir == 'W':
            lon = -lon
            
        return lat, lon
    
    return None, None

def main(json_path=None):
    """
    Main function to fetch current and historical satellite/OSM images.
    
    Args:
        json_path (str): Path to JSON file containing area name and coordinates
    
    Returns:
        dict: Result containing status and paths to generated images
    """
    result = {
        "status": "error",
        "current_satellite": None,
        "current_osm": None,
        "historical_satellite_2years": None,
        "error": None
    }
    
    # Read from JSON if provided
    if json_path:
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            area_name = data.get("area_name", "Unknown")
            location = data.get("location", "")
            
            latitude, longitude = parse_coordinates(location)
            
            if latitude is None or longitude is None:
                result["error"] = "Could not parse coordinates from JSON"
                print(f"✗ Error: {result['error']}")
                return result
                
        except Exception as e:
            result["error"] = f"Failed to read JSON: {str(e)}"
            print(f"✗ Error: {result['error']}")
            return result
    else:
        # Default coordinates for testing
        latitude = 22.017307
        longitude = 82.479004
        area_name = "Kapan"
    
    print("="*70)
    print("Fetching Current and Historical Satellite and OSM Layer Images")
    print("="*70 + "\n")
    
    # 1. Fetch CURRENT Satellite Image
    print("1. Fetching CURRENT Satellite Image...")
    print("-"*70)
    current_satellite = fetch_satellite_image_esri(latitude, longitude, area_name, "current")
    
    if not current_satellite:
        print("   ESRI failed, trying Mapbox...")
        current_satellite = fetch_satellite_image_mapbox(latitude, longitude, area_name, "current")
    
    result["current_satellite"] = current_satellite
    print()
    
    # 2. Fetch CURRENT OSM Layer Image
    print("2. Fetching CURRENT OSM Layer Image...")
    print("-"*70)
    current_osm = fetch_osm_image_esri(latitude, longitude, area_name, "current")
    
    if not current_osm:
        print("   ESRI failed, trying Mapbox...")
        current_osm = fetch_osm_image_mapbox(latitude, longitude, area_name, "current")
    
    result["current_osm"] = current_osm
    print()
    
    # 3. Fetch HISTORICAL Satellite Image (2 years ago) - Google Earth Engine
    print("3. Fetching HISTORICAL Satellite Image (2 years ago)...")
    print("-"*70)
    print("Note: This requires Google Earth Engine (free but needs authentication)")
    
    historical_satellite = fetch_historical_satellite_gee(latitude, longitude, area_name, years_ago=2)
    result["historical_satellite_2years"] = historical_satellite
    
    if not historical_satellite:
        print("⚠ Historical satellite imagery not available via Google Earth Engine")
        print("  To enable: pip install earthengine-api && earthengine authenticate")
    
    print()
    
    # 4. Note about historical OSM
    print("4. Historical OSM Layer...")
    print("-"*70)
    print("⚠ Historical OSM data is NOT available through free APIs")
    print("  OSM only provides current street map data")
    print()
    
    # Summary
    print("="*70)
    print("Summary:")
    print("="*70)
    print(f"Current Satellite:     {'✓ Success' if current_satellite else '✗ Failed'}")
    print(f"Current OSM:           {'✓ Success' if current_osm else '✗ Failed'}")
    print(f"Historical Satellite:  {'✓ Success' if historical_satellite else '✗ Not Available'}")
    print(f"Historical OSM:        ✗ Not Available (no free API)")
    print("="*70)
    
    if current_satellite and current_osm:
        result["status"] = "partial_success" if not historical_satellite else "success"
    
    return result

if __name__ == "__main__":
    import sys
    
    print("\n⚠️  IMPORTANT NOTES:")
    print("="*70)
    print("1. Historical satellite requires Google Earth Engine")
    print("   Install: pip install earthengine-api")
    print("   Authenticate: earthengine authenticate")
    print("2. Historical OSM is NOT available through free APIs")
    print("3. Only current OSM data will be downloaded")
    print("="*70 + "\n")
    
    json_file = sys.argv[1] if len(sys.argv) > 1 else None
    result = main(json_file)
    print("\n" + json.dumps(result, indent=2))