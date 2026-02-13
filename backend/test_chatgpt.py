"""
Test script for ChatGPT image superimposition with verbose output
"""
import asyncio
import sys
import os

# Import the chatgpt module and config
import chatgpt_superimpose
import chatgpt_config

async def test_chatgpt():
    print("="*70)
    print("ChatGPT Image Superimposition Test")
    print("="*70)
    print()
    
    # Use existing images
    csidc_image = "downloads/Amaseoni_2026-02-13.png"
    osm_image = "downloads/osm_Kapan_2026-02-13.png"
    area_name = "Kapan"
    
    print(f"ðŸ“ CSIDC Image: {csidc_image}")
    print(f"ðŸ“ OSM Image: {osm_image}")
    print(f"ðŸ“ Area Name: {area_name}")
    print()
    
    print(f"ðŸ” Using credentials:")
    print(f"   Email: {chatgpt_config.CHATGPT_EMAIL}")
    print(f"   Password: {'*' * len(chatgpt_config.CHATGPT_PASSWORD)}")
    print()
    
    print("="*70)
    print("Starting ChatGPT automation...")
    print("="*70)
    print()
    
    # Call the function with credentials
    result = await chatgpt_superimpose.superimpose_with_chatgpt(
        csidc_image,
        osm_image,
        area_name,
        email=chatgpt_config.CHATGPT_EMAIL,
        password=chatgpt_config.CHATGPT_PASSWORD
    )
    
    print()
    print("="*70)
    print("RESULT")
    print("="*70)
    print(f"Status: {result['status']}")
    if result['status'] == 'success':
        print(f"âœ… Superimposed Image: {result['superimposed_image']}")
    else:
        print(f"âŒ Error: {result['error']}")
    print("="*70)
    
    return result

if __name__ == "__main__":
    asyncio.run(test_chatgpt())
