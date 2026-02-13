import requests
from datetime import datetime
import os

DOWNLOAD_DIR = "downloads"

def fetch_satellite_image_mapbox(latitude, longitude, area_name):
    """
    Fetch satellite image using Mapbox Static API (free tier available)
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
        
        print(f"Fetching Mapbox satellite image for coordinates: {latitude}, {longitude}")
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Satellite image saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download satellite image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_osm_image_mapbox(latitude, longitude, area_name):
    """
    Fetch OSM (OpenStreetMap) layer image using Mapbox
    """
    try:
        access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
        
        # Using streets-v11 style which is OSM-based
        base_url = f"https://api.mapbox.com/styles/v1/mapbox/streets-v11/static"
        
        zoom = 15
        width = 1280
        height = 1280
        
        url = f"{base_url}/{longitude},{latitude},{zoom}/{width}x{height}"
        
        params = {
            'access_token': access_token
        }
        
        print(f"Fetching OSM layer image for coordinates: {latitude}, {longitude}")
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"osm_{area_name}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ OSM image saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download OSM image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_satellite_image_esri(latitude, longitude, area_name):
    """
    Fetch satellite image using ESRI ArcGIS (free, no API key needed)
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
        
        print(f"Fetching ESRI satellite image for coordinates: {latitude}, {longitude}")
        
        response = requests.get(base_url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"satellite_{area_name}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Satellite image saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download satellite image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_osm_image_esri(latitude, longitude, area_name):
    """
    Fetch OSM layer image using ESRI ArcGIS OpenStreetMap
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
        
        print(f"Fetching ESRI OSM layer image for coordinates: {latitude}, {longitude}")
        
        response = requests.get(base_url, params=params)
        
        if response.status_code == 200:
            current_date = datetime.now().strftime("%Y-%m-%d")
            filename = f"osm_{area_name}_{current_date}.png"
            filepath = os.path.join(DOWNLOAD_DIR, filename)
            
            os.makedirs(DOWNLOAD_DIR, exist_ok=True)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ OSM image saved: {filepath}")
            return filepath
        else:
            print(f"✗ Failed to download OSM image. Status code: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    # Coordinates
    latitude = 22.017307
    longitude = 82.479004
    area_name = "Kapan"
    
    print("="*60)
    print("Fetching Satellite and OSM Layer Images")
    print("="*60 + "\n")
    
    # Fetch Satellite Image
    print("1. Fetching Satellite Image...")
    print("-"*60)
    satellite_result = fetch_satellite_image_esri(latitude, longitude, area_name)
    
    if not satellite_result:
        print("   ESRI failed, trying Mapbox...")
        satellite_result = fetch_satellite_image_mapbox(latitude, longitude, area_name)
    
    print()
    
    # Fetch OSM Layer Image
    print("2. Fetching OSM Layer Image...")
    print("-"*60)
    osm_result = fetch_osm_image_esri(latitude, longitude, area_name)
    
    if not osm_result:
        print("   ESRI failed, trying Mapbox...")
        osm_result = fetch_osm_image_mapbox(latitude, longitude, area_name)
    
    print()
    print("="*60)
    print("Summary:")
    print("="*60)
    print(f"Satellite Image: {'✓ Success' if satellite_result else '✗ Failed'}")
    print(f"OSM Layer Image: {'✓ Success' if osm_result else '✗ Failed'}")
    print("="*60)

if __name__ == "__main__":
    main()