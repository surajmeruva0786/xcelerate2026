"""
Simple Image Superimposition using OpenCV
No API required - just blends two images together
"""
import os
from datetime import datetime
import cv2
import numpy as np

DOWNLOAD_DIR = "downloads"

def superimpose_with_opencv(csidc_image_path, osm_image_path, area_name):
    """
    Superimpose CSIDC layout on OSM image using OpenCV blending
    
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
    print("OpenCV Image Superimposition")
    print("="*70)
    
    # Check if images exist
    if not os.path.exists(csidc_image_path):
        result["error"] = f"CSIDC image not found: {csidc_image_path}"
        return result
    
    if not os.path.exists(osm_image_path):
        result["error"] = f"OSM image not found: {osm_image_path}"
        return result
    
    try:
        print("[STEP 1] Loading images...")
        # Load images
        csidc_img = cv2.imread(csidc_image_path)
        osm_img = cv2.imread(osm_image_path)
        
        if csidc_img is None:
            raise Exception(f"Failed to load CSIDC image: {csidc_image_path}")
        if osm_img is None:
            raise Exception(f"Failed to load OSM image: {osm_image_path}")
        
        print(f"  ✓ CSIDC loaded: {csidc_img.shape[1]}x{csidc_img.shape[0]}")
        print(f"  ✓ OSM loaded: {osm_img.shape[1]}x{osm_img.shape[0]}")
        
        print("[STEP 2] Resizing images to match...")
        # Resize CSIDC to match OSM dimensions
        csidc_resized = cv2.resize(csidc_img, (osm_img.shape[1], osm_img.shape[0]))
        print(f"  ✓ Resized CSIDC to: {osm_img.shape[1]}x{osm_img.shape[0]}")
        
        print("[STEP 3] Blending images...")
        # Blend with 50% opacity (alpha blending)
        alpha = 0.5  # 50% transparency
        superimposed = cv2.addWeighted(osm_img, 1-alpha, csidc_resized, alpha, 0)
        print(f"  ✓ Images blended with {alpha*100}% CSIDC opacity")
        
        print("[STEP 4] Saving result...")
        # Save result
        current_date = datetime.now().strftime("%Y-%m-%d")
        filename = f"superimposed_{area_name}_{current_date}.png"
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        cv2.imwrite(filepath, superimposed)
        
        result["superimposed_image"] = filepath
        result["status"] = "success"
        print(f"  ✓ Saved: {filepath}")
        
        print("\n" + "="*70)
        print("✅ SUCCESS!")
        print("="*70)
        print(f"Superimposed image: {filepath}")
        print("="*70)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        result["error"] = str(e)
        import traceback
        traceback.print_exc()
    
    return result

def main():
    """Test superimposition"""
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
            print(f"Using: {os.path.basename(csidc_image)}")
    
    if not os.path.exists(osm_image):
        # Try to find any OSM image
        import glob
        osm_images = glob.glob(os.path.join(DOWNLOAD_DIR, "osm_*.png"))
        if osm_images:
            osm_image = osm_images[0]
            print(f"Using: {os.path.basename(osm_image)}\n")
    
    result = superimpose_with_opencv(csidc_image, osm_image, area_name)
    
    return result

if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3:
        # Command line: python opencv_superimpose.py csidc.png osm.png [area_name]
        area = sys.argv[3] if len(sys.argv) > 3 else "Area"
        result = superimpose_with_opencv(sys.argv[1], sys.argv[2], area)
        import json
        print(json.dumps(result, indent=2))
    else:
        main()
