import requests
import math
from PIL import Image
from io import BytesIO
from datetime import datetime

def deg2num(lat_deg, lon_deg, zoom):
    lat_rad = math.radians(lat_deg)
    n = 2.0 ** zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return (xtile, ytile)

def fetch_wayback_config():
    # Helper to try URL and return json or None
    def try_url(url):
        print(f"Trying URL: {url}")
        try:
            response = requests.get(url)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                try:
                    return response.json()
                except:
                    print("Failed to decode JSON. Content preview:")
                    print(response.text[:500])
                    return None
            else:
                print(f"Error response: {response.text[:200]}")
                return None
        except Exception as e:
            print(f"Request failed: {e}")
            return None

    # Try standard MapService JSON
    url1 = "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?f=json"
    res1 = try_url(url1)
    if res1:
        return res1
        
    # Try the config URL (maybe my previous one was wrong)
    url2 = "https://s3-us-west-2.amazonaws.com/wayback-config/wayback-config.json"
    res2 = try_url(url2)
    return res2

def get_closest_release(config, target_date):
    # releases is a dict where key is release ID/name
    # But usually config is a standard structure. Let's inspect it or assume list.
    # Actually checking standard wayback config structure: it's usually just the JSON.
    # We will print keys to debug if needed, but let's assume it has a list of releases.
    # Actually, often the config IS the list or has a 'release' key.
    # Let's try to assume it's a list sorted by date.
    
    # Simple logic: find release with 'releaseDate' closest to target.
    pass 

def main():
    print("Fetching Wayback config...")
    config = fetch_wayback_config()
    
    # Debug: print structure
    # user_config usually has keys like modified, custom, etc. 
    # But actually, finding the right URL for tiles is key.
    # A standard wayback tile URL is:
    # https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{release_id}/{z}/{y}/{x}
    
    # Let's just pick a known pattern or specific release for testing.
    # Or parsing the config to find "2024" or "2014".
    
    # For now, let's just try to download ONE tile from a known working template to verify access.
    # Release 26120 (approx 2021/2022?) - let's find a valid one dynamically if possible, or just try current.
    # Current "World_Imagery" is usually just the base map.
    # Wayback releases look like "2014-02-20" in the metadata.
    
    print("Configfetched (type):", type(config))
    if isinstance(config, dict):
        print("Keys:", list(config.keys()))
    if isinstance(config, dict) and 'Selection' in config:
        print("Selection found.")
        releases = config['Selection'] # This seems to be the dict
        # It seems 'Selection' is a property of the config root? No.
        # From earlier log: 'Keys: ['Service', 'Selection']'
        # 'Service' was the sample item? No.
        
        # Let's verify 'Selection' type again and print first item fully
        import json
        
        # If Selection is a list (unlikely based on my memory of Wayback config, it's usually not)
        # Actually it's usually just a wrapper.
        pass

    # Let's just iterate and find the first value
    first_val = None
    if isinstance(config, dict):
        for k, v in config.items():
            if k == "Service": continue # Skip
            if isinstance(v, list) and len(v) > 0:
                print(f"Found list in key '{k}'")
                print(json.dumps(v[0], indent=2))
                break
            if isinstance(v, dict):
                 # Maybe it's a dict of releases?
                 first_k = list(v.keys())[0]
                 print(f"Found dict in key '{k}', first key '{first_k}'")
                 print(json.dumps(v[first_k], indent=2))
                 break
    elif isinstance(config, list):
        print(f"List length: {len(config)}")
        print("First item:", config[0])

if __name__ == "__main__":
    main()
