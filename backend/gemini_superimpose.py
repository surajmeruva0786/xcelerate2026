"""
Gemini API Image Superimposition
Uses Google Gemini API to analyze and help superimpose two map images
"""
import os
import base64
from datetime import datetime
import google.generativeai as genai
from PIL import Image
import cv2
import numpy as np

# Gemini API Configuration
GEMINI_API_KEY = "AIzaSyDtP5DHGldrj5dVuHuwvg3FTXhgUeHwx0o"
DOWNLOAD_DIR = "downloads"

def superimpose_with_gemini(csidc_image_path, osm_image_path, area_name):
    """
    Use Gemini API to analyze images and create superimposed result
    
    Args:
        csidc_image_path: Path to CSIDC industrial area image
        osm_image_path: Path to OSM layer image
        area_name: Name of the area for output filename
    
    Returns:
        dict: Result with status and superimposed image path
    """
    result = {
        "status": "error",
        "superimposed_image": None,
        "error": None
    }
    
    print("="*70)
    print("Gemini API Image Superimposition")
    print("="*70)
    
    # Check if images exist
    if not os.path.exists(csidc_image_path):
        result["error"] = f"CSIDC image not found: {csidc_image_path}"
        return result
    
    if not os.path.exists(osm_image_path):
        result["error"] = f"OSM image not found: {osm_image_path}"
        return result
    
    try:
        # Configure Gemini
        print("[STEP 1] Configuring Gemini API...")
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("  âœ“ Gemini API configured")
        
        # Load images
        print("[STEP 2] Loading images...")
        csidc_img = Image.open(csidc_image_path)
        osm_img = Image.open(osm_image_path)
        print(f"  âœ“ CSIDC image loaded: {csidc_img.size}")
        print(f"  âœ“ OSM image loaded: {osm_img.size}")
        
        # Since Gemini doesn't generate images, we'll use OpenCV to do the actual overlay
        # But first, let's use Gemini to analyze the images
        print("[STEP 3] Analyzing images with Gemini...")
        
        prompt = """
        I have two map images that need to be superimposed:
        1. First image: Industrial area map from CSIDC
        2. Second image: OpenStreetMap layer
        
        I need to overlay the layout from the first image onto the second image.
        The maps show the same geographical area but may have different scales or orientations.
        
        Please provide guidance on:
        1. Should I resize either image to match scales?
        2. What blend mode or transparency would work best?
        3. Any alignment suggestions based on what you can see in these images?
        """
        
        response = model.generate_content([prompt, csidc_img, osm_img])
        print("  âœ“ Gemini analysis complete")
        print(f"\n{'â”€'*70}")
        print("Gemini Analysis:")
        print(f"{'â”€'*70}")
        print(response.text)
        print(f"{'â”€'*70}\n")
        
        # Now create the superimposed image using OpenCV
        print("[STEP 4] Creating superimposed image with OpenCV...")
        
        # Convert PIL to OpenCV format
        csidc_cv = cv2.cvtColor(np.array(csidc_img), cv2.COLOR_RGB2BGR)
        osm_cv = cv2.cvtColor(np.array(osm_img), cv2.COLOR_RGB2BGR)
        
        # Resize CSIDC to match OSM dimensions
        csidc_resized = cv2.resize(csidc_cv, (osm_cv.shape[1], osm_cv.shape[0]))
        print(f"  â†’ Resized CSIDC to match OSM: {osm_cv.shape[1]}x{osm_cv.shape[0]}")
        
        # Create overlay with transparency
        # Method: Blend with 50% opacity
        alpha = 0.5  # Transparency factor
        superimposed = cv2.addWeighted(osm_cv, 1-alpha, csidc_resized, alpha, 0)
        
        print("  âœ“ Images blended successfully")
        
        # Save result
        current_date = datetime.now().strftime("%Y-%m-%d")
        filename = f"gemini_superimposed_{area_name}_{current_date}.png"
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        cv2.imwrite(filepath, superimposed)
        
        result["superimposed_image"] = filepath
        result["status"] = "success"
        print(f"  âœ“ Saved: {filepath}")
        
        print("\n" + "="*70)
        print("âœ… SUCCESS!")
        print("="*70)
        print(f"Superimposed image created: {filepath}")
        print("="*70)
        
    except Exception as e:
        print(f"\nâŒ Error: {e}")
        result["error"] = str(e)
        import traceback
        traceback.print_exc()
    
    return result

def main():
    """Test Gemini superimposition"""
    area_name = "Kapan"
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    csidc_image = os.path.join(DOWNLOAD_DIR, f"{area_name}_{current_date}.png")
    osm_image = os.path.join(DOWNLOAD_DIR, f"osm_{area_name}_{current_date}.png")
    
    # Alternative: use existing images
    if not os.path.exists(csidc_image):
        # Try to find any CSIDC image
        import glob
        csidc_images = glob.glob(os.path.join(DOWNLOAD_DIR, "*Amaseoni*.png"))
        if csidc_images:
            csidc_image = csidc_images[0]
            print(f"Using existing CSIDC image: {csidc_image}")
    
    if not os.path.exists(osm_image):
        # Try to find any OSM image
        import glob
        osm_images = glob.glob(os.path.join(DOWNLOAD_DIR, "osm_*.png"))
        if osm_images:
            osm_image = osm_images[0]
            print(f"Using existing OSM image: {osm_image}")
    
    result = superimpose_with_gemini(csidc_image, osm_image, area_name)
    
    if result['status'] == 'success':
        print(f"\nâœ… Result: {result['superimposed_image']}")
    else:
        print(f"\nâŒ Error: {result['error']}")
    
    return result

if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3:
        # Command line: python gemini_superimpose.py csidc.png osm.png [area_name]
        area = sys.argv[3] if len(sys.argv) > 3 else "Area"
        result = superimpose_with_gemini(sys.argv[1], sys.argv[2], area)
        import json
        print(json.dumps(result, indent=2))
    else:
        main()
