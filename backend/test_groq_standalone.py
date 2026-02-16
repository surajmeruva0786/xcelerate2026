"""
Standalone test for Groq Vision service
Tests the groq_service.py module independently before full integration
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the groq service
import groq_service

def test_groq_service():
    """Test Groq service with existing images from downloads"""
    
    print("="*70)
    print("Testing Groq Vision Service Standalone")
    print("="*70)
    
    # Check if API key is loaded
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("\n❌ ERROR: GROQ_API_KEY not found in environment!")
        print("Make sure .env file contains GROQ_API_KEY")
        return
    
    print(f"\n✓ GROQ_API_KEY found (length: {len(api_key)})")
    
    # Look for test images in downloads directory
    downloads_dir = "downloads"
    
    if not os.path.exists(downloads_dir):
        print(f"\n❌ ERROR: {downloads_dir} directory not found!")
        print("Run the pipeline first to generate test images.")
        return
    
    # Find sample images
    files = os.listdir(downloads_dir)
    
    # Look for specific patterns
    past_images = [f for f in files if 'historical' in f.lower() or 'past' in f.lower() or '2years' in f]
    present_images = [f for f in files if 'current' in f.lower() or 'present' in f.lower() or 'satellite' in f.lower()]
    analysis_images = [f for f in files if 'encroachment_analysis' in f or 'analysis' in f]
    
    print(f"\nFound in {downloads_dir}:")
    print(f"  - Past images: {len(past_images)}")
    print(f"  - Present images: {len(present_images)}")
    print(f"  - Analysis images: {len(analysis_images)}")
    
    if not past_images or not present_images:
        print("\n⚠ WARNING: Not enough test images found!")
        print("Files in downloads directory:")
        for f in files[:10]:  # Show first 10
            print(f"  - {f}")
        print("\nRun the full pipeline first to generate test images.")
        return
    
    # Use the first available images
    past_path = os.path.join(downloads_dir, past_images[0])
    present_path = os.path.join(downloads_dir, present_images[0])
    analysis_path = os.path.join(downloads_dir, analysis_images[0]) if analysis_images else None
    
    print(f"\nUsing test images:")
    print(f"  - Past: {past_images[0]}")
    print(f"  - Present: {present_images[0]}")
    print(f"  - Analysis: {analysis_images[0] if analysis_images else 'None'}")
    
    # Call Groq service
    print("\n" + "="*70)
    print("Calling Groq Vision Analysis...")
    print("="*70 + "\n")
    
    try:
        result = groq_service.analyze_encroachment(
            past_path,
            present_path,
            analysis_path,
            area_name="Test Area"
        )
        
        print("\n" + "="*70)
        print("Groq Analysis Result:")
        print("="*70)
        
        import json
        print(json.dumps(result, indent=2))
        
        # Validate response structure
        if result.get('error'):
            print(f"\n❌ Analysis failed: {result['error']}")
        else:
            print("\n✅ Analysis successful!")
            print(f"\nKey Findings:")
            print(f"  - Encroachment Status: {result.get('encroachment_status', 'N/A')}")
            print(f"  - Construction: {result.get('construction_percentage', 'N/A')}%")
            print(f"  - Vegetation: {result.get('vegetation_percentage', 'N/A')}%")
            print(f"  - Idle Status: {result.get('idle_status', 'N/A')}")
            print(f"\nExplanation:")
            print(f"  {result.get('explanation', 'N/A')}")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_groq_service()
