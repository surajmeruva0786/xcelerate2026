from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import asyncio
import os
import json
from datetime import datetime
import sys

# Import our scripts
import script
import gee
import opencv_superimpose

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

DOWNLOAD_DIR = "downloads"

@app.route('/api/run-analysis', methods=['POST'])
def run_analysis():
    """
    Run analysis workflow for a given industrial zone.
    
    Expected JSON body: { "zone": "Kapan" }
    
    Returns: {
        "status": "success" | "error",
        "zone": "Kapan",
        "images": {
            "industrial_area": "path/to/image.png",
            "satellite": "path/to/satellite.png",
            "osm": "path/to/osm.png"
        },
        "error": "error message if any"
    }
    """
    try:
        data = request.get_json()
        zone = data.get('zone')
        
        if not zone:
            return jsonify({
                "status": "error",
                "error": "Zone parameter is required"
            }), 400
        
        print(f"\n{'='*60}")
        print(f"Starting analysis for zone: {zone}")
        print(f"{'='*60}\n")
        
        # Step 1: Run script.py to scrape industrial area data
        print("Step 1: Running script.py...")
        script_result = asyncio.run(script.run(zone))
        
        if script_result['status'] != 'success':
            return jsonify({
                "status": "error",
                "error": f"Script.py failed: {script_result.get('error', 'Unknown error')}"
            }), 500
        
        json_path = script_result.get('json_path')
        image_path = script_result.get('image_path')
        
        print(f"âœ“ Script.py completed")
        print(f"  - Image: {image_path}")
        print(f"  - JSON: {json_path}\n")
        
        # Step 2: Run gee.py to fetch satellite/OSM images
        print("Step 2: Running gee.py...")
        gee_result = gee.main(json_path)
        
        if gee_result['status'] != 'success':
            print(f"❌ GEE.py failed! Error: {gee_result.get('error')}")
            print(f"Detailed Result: {json.dumps(gee_result, indent=2, default=str)}")
            return jsonify({
                "status": "error",
                "error": f"GEE.py failed: {gee_result.get('error', 'Unknown error')}"
            }), 500
        
        satellite_path = gee_result.get('satellite_image')
        osm_path = gee_result.get('osm_image')
        
        print(f"âœ“ GEE.py completed")
        print(f"  - Satellite: {satellite_path}")
        print(f"  - OSM: {osm_path}\n")
        
        # Step 3: Run Encroachment Detection
        print("Step 3: Running Encroachment Detection...")
        
        # We need historical_satellite and current_satellite from gee_result
        # gee.py returns:
        # "current_satellite": path
        # "historical_satellite_2years" or "historical_satellite": path (depending on version)
        
        # Let's handle keys safely
        past_sat_path = gee_result.get('historical_satellite_2years') or gee_result.get('historical_satellite')
        current_sat_path = gee_result.get('current_satellite') or gee_result.get('satellite_image') # fallback
        
        if not past_sat_path or not current_sat_path:
             print(f"âš  Missing satellite images for detection. Past: {past_sat_path}, Present: {current_sat_path}")
             encroachment_result = {"status": "skipped", "error": "Missing satellite images"}
        else:
            try:
                detector = opencv_superimpose.EncroachmentDetector(zone)
                encroachment_result = detector.process(
                    image_path,      # CSIDC map (boundary source)
                    past_sat_path,   # Past Satellite (Yellow)
                    current_sat_path # Present Satellite (Blue)
                )
                print(f"âœ“ Encroachment Analysis completed")
                print(f"  - Analysis Image: {encroachment_result.get('analysis_image')}")
                print(f"  - Metrics: {encroachment_result.get('metrics')}\n")
            except Exception as e:
                print(f"âš  Encroachment Analysis failed: {e}")
                import traceback
                traceback.print_exc()
                encroachment_result = {"status": "error", "error": str(e)}

        
        # Prepare response with image filenames
        response = {
            "status": "success",
            "zone": zone,
            "images": {
                "industrial_area": os.path.basename(image_path) if image_path else None,
                "satellite_present": os.path.basename(current_sat_path) if current_sat_path else None,
                "satellite_past": os.path.basename(past_sat_path) if past_sat_path else None,
                "osm": os.path.basename(osm_path) if osm_path else None,
                "encroachment_analysis": os.path.basename(encroachment_result.get('analysis_image')) if encroachment_result.get('status') == 'success' else None,
                "past_overlay": os.path.basename(encroachment_result.get('past_overlay')) if encroachment_result.get('status') == 'success' else None,
                "present_overlay": os.path.basename(encroachment_result.get('present_overlay')) if encroachment_result.get('status') == 'success' else None
            },
            "metrics": encroachment_result.get('metrics') if encroachment_result.get('status') == 'success' else None
        }
        
        print(f"{'='*60}")
        print("Analysis completed successfully!")
        print(f"{'='*60}\n")
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"âœ— Error in run_analysis: {str(e)}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@app.route('/api/images/<filename>', methods=['GET'])
def get_image(filename):
    """
    Serve images from the downloads directory.
    """
    try:
        return send_from_directory(DOWNLOAD_DIR, filename)
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": f"Image not found: {str(e)}"
        }), 404

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    """
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    # Create downloads directory if it doesn't exist
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)
    
    print("\n" + "="*60)
    print("CSIDC Analysis Backend Server")
    print("="*60)
    print("Server starting on http://localhost:5000")
    print("Endpoints:")
    print("  - POST /api/run-analysis")
    print("  - GET  /api/images/<filename>")
    print("  - GET  /api/health")
    print("="*60 + "\n")
    
    # Use PORT environment variable for Render, fallback to 5000 for local
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
