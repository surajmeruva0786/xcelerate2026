"""
Dashboard Insights Generation Service using Groq LLM

This service uses Groq's text models to generate comprehensive dashboard
insights from the encroachment analysis results.
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = None

def get_client():
    global client
    if not client:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            print("[ERROR] GROQ_API_KEY not found in environment!")
            return None
        client = Groq(api_key=api_key)
    return client


def generate_comprehensive_report(zone, metrics, groq_vision_analysis):
    """
    Generates a comprehensive report for all dashboard pages using Groq LLM.
    """
    print(f"Generating comprehensive report for {zone}...")
    
    client = get_client()
    if not client:
        return {"error": "Groq client not initialized"}

    # Prepare context from vision analysis
    vision_context = "No specific vision analysis available."
    if groq_vision_analysis:
        vision_context = f"""
        - Construction Progress: {groq_vision_analysis.get('construction_percentage', 'N/A')}%
        - Vegetation Coverage: {groq_vision_analysis.get('vegetation_percentage', 'N/A')}%
        - Encroachment Status: {groq_vision_analysis.get('encroachment_status', 'N/A')}
        - Activity Status: {groq_vision_analysis.get('idle_status', 'N/A')}
        - Detailed Observation: {groq_vision_analysis.get('explanation', 'N/A')}
        """

    prompt = f"""You are an expert industrial compliance analyst AI. 
    Your task is to generate a comprehensive JSON report that populates ALL pages of the industrial monitoring dashboard.
    
    You must generate realistic, consistent data based on the provided analysis metrics and zone name.

    **CRITICAL STANCE - STRICT COMPLIANCE MODE:**
    - You are a STRICT auditor. You have a confirmation bias towards finding issues.
    - **Encroachment:** If there is ANY ambiguity, lean towards "YES" (Encroachment Detected).
    - **Construction:** Bias towards reporting "Active" or "Mid-High" construction levels unless clearly barren.
    - **Vegetation:** Bias towards reporting "High" vegetation if there is green, as it often hides illegal activity.
    - **Risk:** If encroachment or high construction is found, Risk Level MUST be "Medium" or "High".
    
    **Zone:** {zone}
    **Vision Analysis:**
    {vision_context}
    **Metrics:** 
    {json.dumps(metrics, indent=2) if metrics else "N/A"}

    **INSTRUCTIONS:**
    Generate a JSON object with the following EXACT structure. Do not include markdown formatting like ```json.
    
    {{
        "executive_summary": "Strict executive summary highlighting potential violations and required actions (2-3 sentences).",
        "risk_level": "Low" | "Medium" | "High",
        "compliance_status": "Compliant" | "Non-Compliant" | "Under Review",
        
        "page_recommendations": {{
            "industrial_areas": ["Inspect Zone A for unmapped structures", "Verify buffer zone compliance"],
            "plot_compliance": ["Audit high-risk plots immediately", "Check for unauthorized expansions"],
            "encroachments": ["Deploy field team to North Sector", "Issue notice for illegal fencing"],
            "change_detection": ["Investigate rapid construction on Plot 45", "Monitor green belt vegetation loss"]
        }},
        
        "industrial_areas": [
            {{
                "id": 1,
                "name": "{zone}",
                "totalPlots": 150,
                "lastAnalysis": "2026-02-14",
                "highRisk": 12, 
                "mediumRisk": 25,
                "lowRisk": 113
            }},
            {{
                "id": 2,
                "name": "Nearby Zone B",
                "totalPlots": 120,
                "lastAnalysis": "2026-02-12",
                "highRisk": 8,
                "mediumRisk": 18,
                "lowRisk": 94
            }}
        ],
        
        "plot_compliance": [
            {{
                "plotId": "IND-1001",
                "industryName": "Alpha Steel Corp",
                "approvedArea": 5000,
                "builtUpArea": 4800,
                "vacantPercent": 5,
                "encroachmentArea": 150,
                "riskScore": 65,
                "riskLevel": "High",
                "verificationStatus": "Pending Review"
            }},
            {{
                "plotId": "IND-1002",
                "industryName": "Beta Logistics",
                "approvedArea": 3000,
                "builtUpArea": 2800,
                "vacantPercent": 10,
                "encroachmentArea": 0,
                "riskScore": 20,
                "riskLevel": "Low",
                "verificationStatus": "Verified"
            }},
            {{
                "plotId": "IND-1005",
                "industryName": "Gamma Tech",
                "approvedArea": 4000,
                "builtUpArea": 3900,
                "vacantPercent": 2,
                "encroachmentArea": 50,
                "riskScore": 45,
                "riskLevel": "Medium",
                "verificationStatus": "Under Review"
            }}
        ],
        
        "encroachments": [
            {{
                "id": 1,
                "location": "{zone} North Sector",
                "type": "Illegal Construction",
                "severity": "Critical",
                "status": "New",
                "area": "450 sq ft",
                "coordinates": "22.34, 82.12"
            }},
            {{
                "id": 2,
                "location": "{zone} East Boundary",
                "type": "Vegetation Overgrowth",
                "severity": "Medium",
                "status": "Investigating",
                "area": "200 sq ft",
                "coordinates": "22.35, 82.14"
            }},
             {{
                "id": 3,
                "location": "{zone} South Gate",
                "type": "Temporary Structure",
                "severity": "High",
                "status": "Confirmed",
                "area": "300 sq ft",
                "coordinates": "22.33, 82.11"
            }}
        ],
        
        "change_detection": [
            {{
                "id": 1,
                "location": "Plot 45-A",
                "changeType": "New Construction",
                "confidence": 92,
                "area": "1200 sq ft",
                "date": "2026-02-10"
            }},
             {{
                "id": 2,
                "location": "Green Belt Z",
                "changeType": "Vegetation Loss",
                "confidence": 85,
                "area": "500 sq ft",
                "date": "2026-02-11"
            }}
        ],

        
        "verification_workflow": [
            {{
                "title": "Pending Review",
                "items": [
                     {{ "plotId": "IND-1002", "issueType": "Encroachment", "riskScore": 85, "officer": "Unassigned" }}
                ]
            }},
            {{
                "title": "Field Verification Required",
                "items": [
                    {{ "plotId": "IND-1003", "issueType": "Potential Encroachment", "riskScore": 45, "officer": "R. Sharma" }}
                ]
            }},
            {{
                "title": "Action Taken",
                "items": []
            }},
            {{
                "title": "Closed",
                "items": [
                     {{ "plotId": "IND-0999", "issueType": "False Positive", "riskScore": 0, "officer": "A. Patel" }}
                ]
            }}
        ],
        
        "monitoring_schedule": {{
            "frequency": "Monthly",
            "satellite_source": "Sentinel-2",
            "cloud_threshold": 20,
            "next_run": "2026-03-01"
        }},
        
        "comparative_findings": [
            {{
                "category": "Road Curvature",
                "manual_plan": "Not done/Incorrect",
                "satellite_analysis": "Identified as non-overlapping",
                "ground_reality": "Confirmed incorrect curvature",
                "discrepancy": "Major Discrepancy",
                "action": "Update base maps with accurate road networks."
            }},
            {{
                "category": "Area Overlap",
                "manual_plan": "Right side did not overlap",
                "satellite_analysis": "Showed accurate layout",
                "ground_reality": "Verified non-overlap",
                "discrepancy": "Major Discrepancy",
                "action": "Update plot boundaries and overall layout."
            }},
            {{
                "category": "Encroachment",
                "manual_plan": "Not reflected/Unknown",
                "satellite_analysis": "Clear mapping of illegal uses",
                "ground_reality": "Verified on ground",
                "discrepancy": "New Findings",
                "action": "Issue notice for immediate ground-truthing and rectification."
            }},
             {{
                "category": "Industry Status",
                "manual_plan": "Not systematically recorded",
                "satellite_analysis": "Identified specific units as Running(22) or Closed(8)",
                "ground_reality": "Verified operational status",
                "discrepancy": "New Insight",
                "action": "Analyze reasons for closures/non-operation."
            }}
        ],

        "reports_summary": [
            {{
                "reportId": "RPT-2026-015",
                "type": "Monthly Compliance",
                "area": "{zone}",
                "date": "2026-02-14",
                "status": "Completed"
            }}
        ],

        "key_findings": [
            "Finding 1...",
            "Finding 2...",
            "Finding 3..."
        ],
        
        "recommendations": [
            "Rec 1...",
            "Rec 2..."
        ]
    }}
    """

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant that outputs only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=4000,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"}
        )

        response_text = completion.choices[0].message.content.strip()
        
        # Parse JSON
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Fallback extraction
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
                return json.loads(json_str)
            elif "{" in response_text:
                start_idx = response_text.find("{")
                end_idx = response_text.rfind("}") + 1
                return json.loads(response_text[start_idx:end_idx])
            else:
                raise Exception("Could not parse JSON")

    except Exception as e:
        print(f"[ERROR] Groq insights generation failed: {e}")
        return {{
            "error": str(e),
            "executive_summary": "Insights generation failed.",
            "compliance_status": "Unknown",
            "risk_level": "Unknown"
        }}


if __name__ == "__main__":
    # Test stub
    test_metrics = {"match_percentage": 96.5, "status": "No Encroachment"}
    test_vision = {
        "encroachment_status": "None",
        "construction_percentage": 45,
        "vegetation_percentage": 30,
        "idle_status": "Active",
        "explanation": "Industrial structures visible with active operations. No boundary violations detected."
    }
    
    # Mocking the LLM response structure for local testing if needed without API
    # In real run, this calls the API. 
    # To test the structure, we can just run the file.
    
    if os.environ.get("GROQ_API_KEY"):
        result = generate_comprehensive_report("Kapan", test_metrics, test_vision)
        print("\n" + "="*70)
        print("Dashboard Insights:")
        print("="*70)
        print(json.dumps(result, indent=2))
    else:
        print("Skipping test run (No GROQ_API_KEY)")
