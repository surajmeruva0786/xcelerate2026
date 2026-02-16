"""
Google Earth Engine Authentication Helper
Run this script to authenticate with Google Earth Engine
"""
import ee

print("="*70)
print("Google Earth Engine Authentication")
print("="*70)
print("\nThis will open a browser window for you to authenticate.")
print("Please follow these steps:")
print("1. Sign in with your Google account")
print("2. Allow Earth Engine access")
print("3. Copy the authorization code")
print("4. Paste it back here when prompted")
print("="*70 + "\n")

try:
    # Attempt to authenticate
    ee.Authenticate()
    print("\nâœ… Authentication successful!")
    print("Now testing Earth Engine initialization...")
    
    # Test initialization
    ee.Initialize()
    print("âœ… Earth Engine initialized successfully!")
    print("\nYou can now use historical satellite fetching in gee.py")
    
except Exception as e:
    print(f"\nâŒ Error: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure you have a Google account")
    print("2. Sign up for Earth Engine at: https://signup.earthengine.google.com/")
    print("3. Wait for approval (usually instant for non-commercial use)")
