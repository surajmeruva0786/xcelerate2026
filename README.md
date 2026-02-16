# Xcelerate 2026: AI-Powered Industrial Encroachment Detection System

## Overview
Xcelerate 2026 is a sophisticated dashboard designed to monitor industrial zones for encroachment, unauthorized construction, and vegetation changes using satellite imagery and AI.

The system integrates:
- **Playwright**: For scraping official CSIDC industrial maps.
- **Google Earth Engine (GEE)**: For fetching historical and current satellite imagery (Sentinel-2).
- **OpenCV**: For computer vision-based boundary detection and overlay.
- **Groq (Llama-3.2 Vision)**: For advanced visual analysis of plots.
- **Groq (Llama Text)**: For generating comprehensive compliance reports.

## Project Structure

```
xcelerate2026/
â”œâ”€â”€ backend/                 # Flask Backend & Analysis Scripts
â”‚   â”œâ”€â”€ app.py               # Main Flask Server & Orchestrator
â”‚   â”œâ”€â”€ script.py            # Playwright Scraper for CSIDC Maps
â”‚   â”œâ”€â”€ gee.py               # Google Earth Engine Image Fetcher
â”‚   â”œâ”€â”€ opencv_superimpose.py # CV Logic for Encroachment Detection
â”‚   â”œâ”€â”€ groq_service.py      # Llama-3.2 Vision Analysis Service
â”‚   â”œâ”€â”€ dashboard_insights_service.py # LLM Report Generator
â”‚   â””â”€â”€ ...
â”œâ”€â”€ src/                     # React Frontend
â”‚   â”œâ”€â”€ pages/               # Dashboard Pages (Reports, Analytics, etc.)
â”‚   â”œâ”€â”€ components/          # Reusable UI Components
â”‚   â””â”€â”€ ...
â”œâ”€â”€ downloads/               # Shared artifacts (Images/JSON) generated during analysis
â””â”€â”€ ...
```

## Setup & Installation

### Prerequisites
- Node.js & npm
- Python 3.8+
- Google Earth Engine Account & Project
- Groq API Key

### Backend Setup
1. Navigate to the root directory.
2. Create and activate a virtual environment (optional but recommended).
3. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Configure Environment Variables in `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key
   # Google Earth Engine credentials usually handled via 'earthengine authenticate'
   ```
5. Run the server:
   ```bash
   python backend/app.py
   ```
   Server runs on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## Analysis Workflow

The `POST /api/run-analysis` endpoint triggers a sequential pipeline:

1.  **Map Retrieval (`script.py`)**:
    -   Headless browser navigates to the CSIDC portal.
    -   Selects the requested Industrial Zone.
    -   Downloads the official layout map and extracts geolocation coordinates.

2.  **Satellite Data Acquisition (`gee.py`)**:
    -   Uses coordinates to fetch:
        -   Current Sentinel-2 Satellite Image.
        -   Historical Satellite Image (2 years ago).
        -   OpenStreetMap (OSM) reference.

3.  **Computer Vision Analysis (`opencv_superimpose.py`)**:
    -   Extracts plot boundaries from the CSIDC map.
    -   Overlays boundaries on Past (Yellow) and Present (Blue) satellite images.
    -   Calculates "Boundary Match Percentage" to detect deviations.

4.  **AI Vision Assessment (`groq_service.py`)**:
    -   Sends satellite images and overlays to **Llama-3.2-90b-vision**.
    -   Analyzes:
        -   **Encroachment Risk**: visual confirmation of violations.
        -   **Construction Status**: % built-up area.
        -   **Plot-level Status**: Identifies specific plot numbers (e.g., "102", "15A") that are encroached, idle, or have low vegetation.

5.  **Report Generation (`dashboard_insights_service.py`)**:
    -   Synthesizes all metrics and vision findings.
    -   Generates a structured JSON report including Executive Summary, Risk Levels, and specific Recommendations.

## Dashboard Features

-   **Interactive Map**: View Satellite vs. Official Map overlays.
-   **Verification Hierarchy**: 3-step approval workflow (Drone -> Field Officer -> Official).
-   **Automated Reports**: Detailed breakdown of compliant vs. non-compliant plots.
-   **AI Chat (Plan)**: Future integration for querying report data.

## Troubleshooting

-   **Images not showing**: Ensure `backend/app.py` is running and `downloads/` directory exists in the project root.
-   **GEE Error**: Re-authenticate using `earthengine authenticate` command.
-   **Groq Error**: Check API Key quota and validity in `.env`.