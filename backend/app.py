from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import asyncio
import os
import json
from datetime import datetime
import sys

# Load environment variables
load_dotenv()

# Import our scripts
import script
import gee
import gee
import opencv_superimpose
import groq_service
import dashboard_insights_service
import report_service




app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Define absolute path for downloads directory (pointing to project_root/downloads)
# app.py is in backend/, so we go up one level
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOWNLOAD_DIR = os.path.join(BASE_DIR, "downloads")

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
        
        # Step 4: Run Groq Vision Analysis (if encroachment detection succeeded)
        groq_analysis = None
        if encroachment_result.get('status') == 'success':
            print("Step 4: Running Groq Vision Analysis...")
            try:
                groq_analysis = groq_service.analyze_encroachment(
                    past_sat_path,
                    current_sat_path,
                    encroachment_result.get('analysis_image'),
                    area_name=zone
                )
                
                if groq_analysis.get('error'):
                    print(f"⚠ Groq Analysis failed: {groq_analysis['error']}")
                    print("  Continuing without AI analysis...")
                else:
                    print(f"✓ Groq Analysis completed")
                    print(f"  - Status: {groq_analysis.get('encroachment_status')}")
                    print(f"  - Construction: {groq_analysis.get('construction_percentage')}%")
                    print(f"  - Vegetation: {groq_analysis.get('vegetation_percentage')}%")
                    print(f"  - Idle Status: {groq_analysis.get('idle_status')}\n")
            except Exception as e:
                print(f"⚠ Groq Analysis exception: {e}")
                print("  Continuing without AI analysis...")
                groq_analysis = {"error": str(e)}
        else:
            print("⚠ Skipping Groq Analysis (encroachment detection failed)\n")

        
        # Step 5: Generate Comprehensive Dashboard Insights
        dashboard_insights = None
        if groq_analysis and not groq_analysis.get('error'):
            print("Step 5: Generating Comprehensive Report with LLM...")
            try:
                dashboard_insights = dashboard_insights_service.generate_comprehensive_report(
                    zone,
                    encroachment_result.get('metrics') if encroachment_result.get('status') == 'success' else None,
                    groq_analysis
                )
                
                if dashboard_insights.get('error'):
                    print(f"⚠ Insights generation failed: {dashboard_insights['error']}")
                    print("  Continuing without LLM insights...")
                else:
                    print(f"✓ Comprehensive Report Generated")
                    print(f"  - Sections: {list(dashboard_insights.keys())}\n")
            except Exception as e:
                print(f"⚠ Report generation exception: {e}")
                print("  Continuing without LLM insights...")
                dashboard_insights = {"error": str(e)}
        else:
            print("⚠ Skipping Dashboard Insights (Groq analysis unavailable)\n")

        # Step 6: Detailed Plot Status Detection (New Step)
        plot_status = None
        if encroachment_result.get('status') == 'success' and image_path:
             print("Step 6: Detecting specific plot status (Encroachment/Idle/Veg)...")
             try:
                 plot_status = groq_service.detect_plot_status(
                     image_path, # Original CSIDC map with plot numbers
                     encroachment_result.get('analysis_image'), # Analysis result
                     zone
                 )
                 
                 if plot_status.get('error'):
                     print(f"⚠ Plot status detection failed: {plot_status['error']}")
                 else:
                     print(f"✓ Plot Status Detected")
                     print(f"  - Encroachment Risk: {plot_status.get('encroachment_plots')}")
                     print(f"  - Idle: {plot_status.get('idle_plots')}")
                     
                     # Merge into dashboard_insights if it exists, or create a partial one
                     if dashboard_insights:
                         dashboard_insights['plot_status'] = plot_status
                     else:
                         dashboard_insights = {'plot_status': plot_status}
                         
             except Exception as e:
                 print(f"⚠ Plot detection exception: {e}")


        
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
            "metrics": encroachment_result.get('metrics') if encroachment_result.get('status') == 'success' else None,
            "groq_analysis": groq_analysis if groq_analysis and not groq_analysis.get('error') else None,
            "dashboard_insights": dashboard_insights if dashboard_insights and not dashboard_insights.get('error') else None
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


@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    """
    Generate a PDF report based on current analysis data.
    Expected JSON: Full analysis object (metrics, insights, images)
    """
    try:
        data = request.get_json()
        zone = data.get('zone', 'Unknown-Zone')
        
        # Call report service
        result = report_service.generate_pdf_report(zone, data)
        
        if result['status'] == 'success':
            filename = result['filename']
            return send_from_directory(DOWNLOAD_DIR, filename, as_attachment=True)
        else:
            return jsonify(result), 500
            
    except Exception as e:
         print(f"Report generation error: {e}")
         return jsonify({"status": "error", "error": str(e)}), 500

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
