
import os
import base64
import json
from groq import Groq

# Initialize Groq client
# Ensure GROQ_API_KEY is in environment variables (loaded by dotenv in app.py)
client = None

def get_client():
    global client
    if not client:
        # Check .env or os.environ
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            # Fallback to loading from .env manually if not running via app.py
            try:
                from dotenv import load_dotenv
                load_dotenv()
                api_key = os.environ.get("GROQ_API_KEY")
            except:
                pass
        
        if not api_key:
            print("[ERROR] GROQ_API_KEY not found in environment!")
            return None
            
        client = Groq(api_key=api_key)
    return client

def encode_image(image_path):
    """Encode image to base64 string"""
    if not os.path.exists(image_path):
        print(f"[WARN] Image not found for encoding: {image_path}")
        return None
        
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def analyze_encroachment(past_image_path, present_image_path, overlay_image_path, area_name="Unknown"):
    """
    Analyze satellite images using Llama-3.2-90b-vision-preview on Groq.
    
    Args:
        past_image_path: Path to historical satellite image (2 years ago)
        present_image_path: Path to current satellite image
        overlay_image_path: Path to the encroachment analysis overlay (Green/Yellow/Blue)
        area_name: Name of the zone
        
    Returns:
        dict: JSON analysis result
    """
    print(f"Groq: Starting analysis for {area_name}...")
    
    client = get_client()
    if not client:
        return {"error": "Groq client not initialized (missing API key)"}

    # Encode images
    past_b64 = encode_image(past_image_path)
    present_b64 = encode_image(present_image_path)
    overlay_b64 = encode_image(overlay_image_path)
    
    if not past_b64 or not present_b64:
        return {"error": "Missing source images for analysis"}

    # Prepare user prompt
    # We send the images and ask for JSON response
    
    prompt = f"""
    You are an expert satellite imagery analyst.
    I am providing three images of an industrial area called "{area_name}":
    1. Past Satellite Image (from ~2 years ago).
    2. Present Satellite Image (Current).
    3. Encroachment Analysis Overlay. In this overlay:
       - GREEN lines: Stable boundaries (perfect match between past/present plans).
       - YELLOW lines: Boundaries present in plan but missing matching features (or past features).
       - BLUE lines: Boundaries present in plan projected onto current map.
       - VISUAL CHECK: Look for new structures in the "Present" image that cross the boundary lines or are outside designated plots.
    
    Analyze these images and provide a detailed JSON report with the following fields:
    - "encroachment_status": "Detected" or "None" or "Suspected".
    - "construction_percentage": Estimated percentage of the plot area that is built-up (0-100).
    - "vegetation_percentage": Estimated percentage of the plot area covered by vegetation (0-100).
    - "idle_status": "Idle" (if mostly vacant/vegetation), "Active" (if construction present), or "Under Construction".
    - "explanation": A qualitative summary of what you see (e.g. "New warehouse structure visible in northern part compared to past image...").
    
    Return ONLY valid JSON. Do not write markdown blocks.
    """
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{past_b64}"
                    }
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{present_b64}"
                    }
                },
                # Note: Llama 3.2 Vision might handle limited images. 
                # If overlay is critical, prioritize it.
                # Let's send all 3 if supported. If errors, we might reduce to Present + Overlay.
            ]
        }
    ]
    
    # Add overlay if available
    if overlay_b64:
        messages[0]["content"].append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{overlay_b64}"
            }
        })

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-maverick-17b-128e-instruct",  # Multimodal model with vision support
            messages=messages,
            temperature=0.1,
            max_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
        
        response_text = completion.choices[0].message.content
        print("Groq Response received.")
        print(f"[DEBUG] Raw Groq response: {response_text[:200]}...")
        
        # Parse JSON
        try:
            # Cleanup markdown code blocks if present
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            return data
        except json.JSONDecodeError:
            print("[WARN] Failed to parse Groq JSON. Returning raw text.")
            return {
                "error": "JSON Parse Error", 
                "raw_text": response_text,
                # Fallback structure
                "encroachment_status": "Unknown",
                "construction_percentage": 0,
                "vegetation_percentage": 0,
                "idle_status": "Unknown"
            }
            
    except Exception as e:
        print(f"[ERROR] Groq API failed: {e}")
        return {"error": str(e)}

def detect_plot_status(original_map_path, analysis_image_path, zone):
    """
    Analyze the original map (with plot numbers) and the analysis image to identify specific plots.
    
    Args:
        original_map_path: Path to the original CSIDC map image (contains plot numbers)
        analysis_image_path: Path to the analysis result image (shows encroachment/status)
        zone: Zone name
        
    Returns:
        dict: Lists of plot numbers for different categories
    """
    print(f"Groq: Detecting plot status for {zone}...")
    
    client = get_client()
    if not client:
        return {"error": "Groq client not initialized"}

    # Encode images
    map_b64 = encode_image(original_map_path)
    analysis_b64 = encode_image(analysis_image_path)
    
    if not map_b64 or not analysis_b64:
        return {"error": "Missing source images for plot detection"}

    prompt = f"""
    You are an expert industrial surveyor.
    I am providing two images of the "{zone}" industrial area:
    1. **Original Map:** This image shows the plot boundaries and, crucially, the PLOT NUMBERS (e.g., 101, 102, 12A, etc.).
    2. **Analysis Result:** This image shows the current state, where:
         - Red/Yellow outlines indicate potential encroachement or boundary mismatch.
         - Green outlines indicate correct boundaries.
         - Visual texture indicates vegetation (green/bushy) vs construction (grey/white structures) vs idle land (brown/empty).

    **YOUR TASK:**
    Cross-reference the spatial location of plots between the two images. Read the plot numbers from the Original Map and correlate them with the visual status in the Analysis Result.
    
    Identify and list the **PLOT NUMBERS** for the following categories:
    1. **Encroachment Risk:** Plots where the Analysis Result shows Red/Yellow boundary mismatches or structures crossing lines.
    2. **Idle/Vacant:** Plots that appear empty, brown, or undeveloped in the Analysis Result.
    3. **Low Vegetation:** Plots that have very little green cover (mostly concrete or dirt).

    **OUTPUT FORMAT:**
    Return ONLY valid JSON with this exact structure. Do not use markdown.
    {{
        "encroachment_plots": ["101", "102A", ...],
        "idle_plots": ["105", ...],
        "low_vegetation_plots": ["101", "105", ...]
    }}
    If no plots match a category, return an empty list [].
    """
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{map_b64}"
                    }
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{analysis_b64}"
                    }
                }
            ]
        }
    ]

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-maverick-17b-128e-instruct", # Using vision model
            messages=messages,
            temperature=0.1,
            max_tokens=1024,
            top_p=1,
            stream=False
        )
        
        response_text = completion.choices[0].message.content
        print("Groq Plot Detection Response received.")
        
        # Parse JSON
        try:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            if "{" not in clean_text: 
                 # Fallback if model returns plain text list
                 print(f"[WARN] Groq returned non-JSON: {clean_text[:100]}")
                 return {"encroachment_plots": [], "idle_plots": [], "low_vegetation_plots": []}
                 
            return json.loads(clean_text)
        except json.JSONDecodeError:
            print("[WARN] Failed to parse Plot Detection JSON.")
            return {"encroachment_plots": [], "idle_plots": [], "low_vegetation_plots": []}
            
    except Exception as e:
        print(f"[ERROR] Groq Plot Detection failed: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Test stub
    pass
