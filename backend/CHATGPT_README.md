# ChatGPT Image Superimposition

## Overview

This script automates the process of using ChatGPT to superimpose the CSIDC industrial area layout onto OSM (OpenStreetMap) imagery.

## How It Works

1. **Opens ChatGPT** in a browser using Playwright
2. **Uploads two images:**
   - CSIDC industrial area map (from script.py)
   - OSM layer image (from gee.py)
3. **Sends prompt:** "Match the layouts of both the maps and then superimpose the layout of the first image on the 2nd image"
4. **Waits for generation** (~30-60 seconds)
5. **Downloads result** to `downloads/superimposed_{area}_{date}.png`

## Requirements

### ChatGPT Account
- You must be logged into ChatGPT in your browser
- You need access to GPT-4 or DALL-E for image generation

### Session Persistence
The script uses Chromium with a persistent context, so you may need to:
1. Log into ChatGPT manually the first time
2. Keep the browser session active

## Usage

### Standalone
```bash
python chatgpt_superimpose.py <csidc_image> <osm_image> <area_name>
```

Example:
```bash
python chatgpt_superimpose.py downloads/Kapan_2026-02-13.png downloads/osm_Kapan_2026-02-13.png Kapan
```

### Via API
The ChatGPT superimposition is automatically triggered when you call `/api/run-analysis`:

```bash
curl -X POST http://localhost:5000/api/run-analysis \
  -H "Content-Type: application/json" \
  -d '{"zone": "Kapan"}'
```

The response will include:
```json
{
  "status": "success",
  "zone": "Kapan",
  "images": {
    "industrial_area": "Kapan_2026-02-13.png",
    "satellite": "satellite_Kapan_2026-02-13.png",
    "osm": "osm_Kapan_2026-02-13.png",
    "superimposed": "superimposed_Kapan_2026-02-13.png"
  }
}
```

## Important Notes

### ⚠️ Browser Automation
- The script automates a web browser to interact with ChatGPT
- ChatGPT's UI can change, which may break the automation
- You may need to update selectors if ChatGPT's interface changes

### ⚠️ Authentication
- You must be logged into ChatGPT
- The script does NOT handle login automatically
- Consider using browser context persistence for production

### ⚠️ Rate Limits
- ChatGPT has usage limits
- Free tier may have daily limits on image generation
- Plus users have higher limits

### ⚠️ Headless Mode
- In production (Render), runs headless
- Locally, runs with browser visible for debugging
- Manual login required the first time

## Troubleshooting

### "Could not find file upload button"
- ChatGPT updated their UI
- Update the `upload_selectors` list in the code
- Check browser console for element selectors

### "Timeout waiting for image generation"
- ChatGPT is slow or rate-limited
- Increase `max_wait` timeout
- Check if you're logged in properly

### "Download failed"
- Try the alternative download methods
- Check if image was generated but not downloaded
- Manual download may be needed

## Future Improvements

1. **Session Management:** Save browser session to avoid re-login
2. **Error Recovery:** Better handling of UI changes
3. **Alternative APIs:** Use OpenAI API instead of web automation
4. **Fallback:** Skip if ChatGPT fails, return other images
