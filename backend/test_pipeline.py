"""
Quick test of the full analysis pipeline
"""
import requests
import json

print("="*70)
print("Testing Full Analysis Pipeline")
print("="*70)

# Test the analysis endpoint
url = "http://localhost:5000/api/run-analysis"
data = {"zone": "Kapan"}

print(f"\nSending request to: {url}")
print(f"Data: {data}\n")

try:
    response = requests.post(url, json=data, timeout=120)
    
    print(f"Status Code: {response.status_code}")
    print("\nResponse:")
    print("="*70)
    print(json.dumps(response.json(), indent=2))
    print("="*70)
    
    if response.status_code == 200:
        result = response.json()
        if result.get('status') == 'success':
            print("\nâœ… PIPELINE TEST SUCCESSFUL!")
            print("\nGenerated Images:")
            for key, value in result.get('images', {}).items():
                print(f"  - {key}: {value}")
        else:
            print(f"\nâŒ PIPELINE FAILED: {result.get('error')}")
    else:
        print(f"\nâŒ REQUEST FAILED")
        
except requests.exceptions.ConnectionError:
    print("\nâŒ ERROR: Could not connect to backend server")
    print("Make sure the Flask server is running on port 5000")
except Exception as e:
    print(f"\nâŒ ERROR: {e}")
