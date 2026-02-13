import ee
import requests
from datetime import datetime, timedelta
import os
import json
from PIL import Image, ImageDraw, ImageFont

# ==========================================================
# INITIALIZE EARTH ENGINE (Lazy Init)
# ==========================================================
EE_INITIALIZED = False

def initialize_ee():
    global EE_INITIALIZED
    if not EE_INITIALIZED:
        try:
            ee.Initialize(project="csidc-hackathon-487309")
            print("âœ“ Earth Engine initialized with project csidc-hackathon-487309")
            EE_INITIALIZED = True
        except Exception as e:
            print(f"âš  Earth Engine initialization failed: {e}")

# Call init immediately but don't crash if fails (or maybe call it inside fetch functions)
# initialize_ee()

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# ==========================================================
# ADD LABEL TO IMAGE
# ==========================================================
def add_label_to_image(image_path, label_text):
    """Add a text label to the image for verification"""
    try:
        img = Image.open(image_path)
        draw = ImageDraw.Draw(img)
        
        # Try to use a font, fallback to default
        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()
        
        # Add white background rectangle for text
        bbox = draw.textbbox((10, 10), label_text, font=font)
        draw.rectangle(bbox, fill='white')
        
        # Add black text
        draw.text((10, 10), label_text, fill='black', font=font)
        
        img.save(image_path)
        print(f"  Added label: {label_text}")
    except Exception as e:
        print(f"  Could not add label: {e}")

# ==========================================================
# FETCH HISTORICAL SATELLITE (GEE)
# ==========================================================
def fetch_historical_satellite(latitude, longitude, area_name, years_ago=2):
    try:
        end_date = datetime.now() - timedelta(days=365 * years_ago)
        start_date = end_date - timedelta(days=30)

        point = ee.Geometry.Point([longitude, latitude])
        region = point.buffer(2000).bounds()

        print(f"  Searching imagery from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}...")
        print(f"  Point: Lat={latitude}, Lon={longitude}")

        collection = (
            ee.ImageCollection('COPERNICUS/S2_SR')
            .filterBounds(point)
            .filterDate(start_date.strftime('%Y-%m-%d'),
                        end_date.strftime('%Y-%m-%d'))
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
            .sort('system:time_start', False)
        )

        image = collection.first()

        if image is None:
            print(f"  No historical imagery found for {area_name}.")
            return None

        url = image.select(['B4', 'B3', 'B2']).getThumbURL({
            'region': region.getInfo(),
            'dimensions': 1024,
            'format': 'png',
            'min': 0,
            'max': 3000,
            'gamma': 1.4
        })

        response = requests.get(url, timeout=60)

        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_{years_ago}years_ago_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(response.content)

            # Add label with coordinates
            label = f"{area_name} ({latitude:.4f}, {longitude:.4f}) - {years_ago}yr ago"
            add_label_to_image(filepath, label)

            print(f"  âœ“ Historical satellite saved: {filepath}")
            return filepath
        else:
            print(f"  âœ— Failed to download historical image for {area_name}")
            return None

    except Exception as e:
        print(f"  [ERROR] Fetch Historical Satellite Failed for {area_name}: {e}")
        import traceback
        traceback.print_exc()
        return None


# ==========================================================
# FETCH CURRENT SATELLITE (ESRI)
# ==========================================================
def fetch_current_satellite(latitude, longitude, area_name):
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

        print(f"  Fetching current satellite...")
        print(f"  BBox: {bbox}")
        response = requests.get(base_url, params=params, timeout=30)

        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_current_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(response.content)

            # Add label with coordinates
            label = f"{area_name} ({latitude:.4f}, {longitude:.4f}) - Current"
            add_label_to_image(filepath, label)

            print(f"  âœ“ Current satellite saved: {filepath}")
            return filepath
        else:
            print(f"  âœ— Failed to download satellite image for {area_name}")
            return None

    except Exception as e:
        print(f"  [ERROR] Fetch Current Satellite Failed for {area_name}: {e}")
        import traceback
        traceback.print_exc()
        return None


# ==========================================================
# FETCH CURRENT OSM (ESRI)
# ==========================================================
def fetch_current_osm(latitude, longitude, area_name):
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

        print(f"  Fetching current OSM...")
        response = requests.get(base_url, params=params, timeout=30)

        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"osm_{area_name}_current_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)

            with open(filepath, 'wb') as f:
                f.write(response.content)

            # Add label with coordinates
            label = f"{area_name} ({latitude:.4f}, {longitude:.4f}) - OSM"
            add_label_to_image(filepath, label)

            print(f"  âœ“ Current OSM saved: {filepath}")
            return filepath
        else:
            print(f"  âœ— Failed to download OSM image for {area_name}")
            return None

    except Exception as e:
        print(f"  [ERROR] Fetch Current OSM Failed for {area_name}: {e}")
        import traceback
        traceback.print_exc()
        return None


# ==========================================================
# VERIFY COORDINATES
# ==========================================================
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """Calculate distance in km"""
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return km



# ==========================================================
# MAIN EXECUTION API
# ==========================================================
def main(json_path):
    """
    Main entry point called by app.py.
    """
    print(f"GEE: Starting processing for {json_path}")
    
    # Ensure initialized
    initialize_ee()
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        area_name = data.get('area_name', 'Unknown')
        location_str = data.get('location', '')
        
        # Parse location "22.0173Â°N, 82.4790Â°E" or similar
        # script.py output: "22.0173Â°N, 82.4790Â°E"
        # We need to parse this.
        import re
        # Pattern: digits optionally decimal, optional degree, optional space, N/S, etc.
        # But script.py might output clean string or raw?
        # script.py: f"{match[0]}Â°{match[1]}, {match[2]}Â°{match[3]}" -> "22.0173Â°N, 82.4790Â°E"
        
        # Simple parser
        lat = 0.0
        lon = 0.0
        
        # Remove deg symbol and whitespace
        clean_loc = location_str.replace('Â°', '').replace(',', ' ').strip()
        parts = clean_loc.split() 
        # e.g. ["22.0173N", "82.4790E"] or ["22.0173", "N", "82.4790", "E"]
        
        # Extract numbers using regex
        nums = re.findall(r"[-+]?\d*\.\d+|\d+", location_str)
        if len(nums) >= 2:
            lat = float(nums[0])
            lon = float(nums[1])
        else:
            # Fallback for known areas if parsing fails
            if "Kapan" in area_name:
                lat, lon = 22.017307, 82.479004
            elif "Gondwara" in area_name:
                lat, lon = 21.290583, 81.614885
            else:
                 return {"status": "error", "error": "Could not parse coordinates"}

        print(f"  Parsed Coordinates: {lat}, {lon}")
        
        # Fetch images
        current_sat = fetch_current_satellite(lat, lon, area_name)
        current_osm = fetch_current_osm(lat, lon, area_name)
        historical_sat = fetch_historical_satellite(lat, lon, area_name, 2)
        
        result = {
            "status": "success",
            "current_satellite": current_sat,
            "current_osm": current_osm,
            "historical_satellite": historical_sat,
            
            # Legacy/Fallback keys for app.py just in case
            "satellite_image": current_sat,
            "osm_image": current_osm,
            "historical_satellite_2years": historical_sat
        }
        return result
        
    except Exception as e:
        print(f"GEE Main Error: {e}")
        import traceback
        traceback.print_exc()
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    # Test run
    # Mock data or run for Kapan
    print("Running in standalone mode...")
    initialize_ee()
    # fetch_current_satellite(22.017307, 82.479004, "Kapan_Test")
