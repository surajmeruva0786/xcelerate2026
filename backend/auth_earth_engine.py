"""
Simple Earth Engine Authentication Script
This script will register your Google Cloud project for Earth Engine
"""
import ee

print("="*70)
print("Earth Engine Authentication")
print("="*70)

print("\nStep 1: Creating credentials...")
print("This will open a browser window for authentication.")
print("\nPlease:")
print("  1. Sign in with: meruva24102@iiitnr.edu.in")
print("  2. Allow Earth Engine access")
print("  3. Select a Cloud Project (or create a new one)")
print("\n" + "="*70)

try:
    # Authenticate with command-line flow
    ee.Authenticate(auth_mode='notebook')
    print("\nâœ… Authentication successful!")
    
    # Test initialization
    print("\nStep 2: Testing Earth Engine initialization...")
    ee.Initialize()
    print("âœ… Earth Engine initialized!")
    
    print("\n" + "="*70)
    print("SUCCESS! Earth Engine is ready to use.")
    print("You can now fetch historical satellite images!")
    print("="*70)
    
except Exception as e:
    print(f"\nâŒ Error: {e}")
    print("\nPlease visit: https://code.earthengine.google.com/")
    print("And sign up for Earth Engine access if you haven't already.")
