# Script to manually add Step 5 to app.py at the correct location

import re

with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with "Prepare response with image filenames"
insertion_point = None
for i, line in enumerate(lines):
    if 'Prepare response with image filenames' in line:
        insertion_point = i
        break

if insertion_point is None:
    print("ERROR: Could not find insertion point!")
    exit(1)

# Code to insert
step5_code = '''        # Step 5: Generate Dashboard Insights using LLM
        dashboard_insights = None
        if groq_analysis and not groq_analysis.get('error'):
            print("Step 5: Generating Dashboard Insights with LLM...")
            try:
                dashboard_insights = dashboard_insights_service.generate_dashboard_insights(
                    zone,
                    encroachment_result.get('metrics') if encroachment_result.get('status') == 'success' else None,
                    groq_analysis
                )
                
                if dashboard_insights.get('error'):
                    print(f"⚠ Dashboard insights generation failed: {dashboard_insights['error']}")
                    print("  Continuing without LLM insights...")
                else:
                    print(f"✓ Dashboard Insights Generated")
                    print(f"  - Compliance: {dashboard_insights.get('compliance_status')}")
                    print(f"  - Risk Level: {dashboard_insights.get('risk_level')}")
                    print(f"  - Findings: {len(dashboard_insights.get('key_findings', []))} items\\n")
            except Exception as e:
                print(f"⚠ Dashboard insights exception: {e}")
                print("  Continuing without LLM insights...")
                dashboard_insights = {"error": str(e)}
        else:
            print("⚠ Skipping Dashboard Insights (Groq analysis unavailable)\\n")

        
'''

# Insert the code before the "Prepare response" comment
lines.insert(insertion_point, step5_code)

# Write back
with open('app.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"✓ Successfully inserted Step 5 at line {insertion_point}")
print("Step 5 (Dashboard Insights Generation) has been added to the pipeline!")
