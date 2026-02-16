# Helper script to add Step 5 to app.py
# This adds dashboard insights generation to the pipeline

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the insertion point
target = '        else:\r\n            print("⚠ Skipping Groq Analysis (encroachment detection failed)\\n")\r\n\r\n        \r\n        # Prepare response with image filenames'

replacement = '''        else:
            print("⚠ Skipping Groq Analysis (encroachment detection failed)\\n")
        
        # Step 5: Generate Dashboard Insights using LLM
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

        
        # Prepare response with image filenames'''

if target in content:
    content = content.replace(target, replacement)
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✓ Successfully added Step 5 to app.py")
else:
    print("❌ Target string not found. Manual edit may be needed.")
    print("Searching for alternative patterns...")
