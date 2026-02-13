import asyncio
import os
import re
import json
from datetime import datetime
from playwright.async_api import async_playwright

DOWNLOAD_DIR = "downloads"

async def run():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    area_name = input("Enter Industrial Area name (e.g., Gondwara): ").strip()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(accept_downloads=True)
        page = await context.new_page()

        try:
            await page.goto("https://cggis.cgstate.gov.in/csidc/", timeout=60000)
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(5000)

            frame = None
            if len(page.frames) > 1:
                frame = page.frames[1]
            else:
                frame = page

            await frame.locator(".nav-icon-label").filter(has_text="Old Industrial Area").click(timeout=15000)
            await page.wait_for_timeout(3000)

            dropdown = frame.locator("#oldIndustrialPlotDropdown")
            await dropdown.wait_for(state="visible", timeout=15000)
            await page.wait_for_timeout(2000)
            
            options = await dropdown.locator("option").all_text_contents()
            
            matching_option = None
            for option in options:
                if area_name.lower() in option.lower():
                    matching_option = option
                    break
            
            if matching_option:
                await dropdown.select_option(label=matching_option, timeout=15000)
            else:
                await dropdown.locator(f"option:has-text('{area_name}')").click(timeout=15000)
            
            await page.wait_for_timeout(5000)

            # Export with default basemap
            await frame.locator(".tool-icon").filter(has_text="Export").click(timeout=15000)
            await page.wait_for_timeout(2000)

            export_map_button = frame.locator("text=Export Map").first
            await export_map_button.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)

            try:
                async with page.expect_download(timeout=60000) as download_info:
                    await export_map_button.click(timeout=15000)

                download = await download_info.value
                
                current_date = datetime.now().strftime("%Y-%m-%d")
                
                original_filename = download.suggested_filename
                file_extension = os.path.splitext(original_filename)[1]
                
                new_filename = f"{area_name}_{current_date}{file_extension}"
                file_path = os.path.join(DOWNLOAD_DIR, new_filename)
                
                await download.save_as(file_path)
                
            except Exception as e:
                print(f"Download error: {e}")
                # Continue even if download fails

            # Wait for export dialog to close
            await page.wait_for_timeout(3000)

            # Find map element
            map_selectors = ["canvas", ".mapboxgl-canvas", ".esri-view-surface", "#mapDiv", ".map-container"]
            
            map_element = None
            for selector in map_selectors:
                try:
                    element = frame.locator(selector).first
                    if await element.count() > 0:
                        map_element = element
                        break
                except:
                    continue
            
            if not map_element:
                print("Warning: Could not find map element")
            
            # Click somewhere on the map (outside boundary region)
            if map_element:
                try:
                    box = await map_element.bounding_box()
                    
                    if box:
                        # Click in the top-left corner (outside boundary)
                        click_x = box['x'] + box['width'] * 0.15
                        click_y = box['y'] + box['height'] * 0.15
                        await frame.mouse.click(click_x, click_y)
                        await page.wait_for_timeout(1500)
                except Exception as e:
                    print(f"Error clicking outside boundary: {e}")

            # Click inside the boundary region (center)
            if map_element:
                try:
                    box = await map_element.bounding_box()
                    
                    if box:
                        # Click in the center of the map (inside boundary)
                        click_x = box['x'] + box['width'] / 2
                        click_y = box['y'] + box['height'] / 2
                        await frame.mouse.click(click_x, click_y)
                        await page.wait_for_timeout(2000)
                except Exception as e:
                    print(f"Error clicking inside boundary: {e}")
            
            # Extract coordinates with error handling
            extracted_coordinates = None
            
            try:
                coordinate_selectors = [
                    "text=Location",
                    ".coordinates",
                    ".location-info",
                    "[class*='coord']",
                    "[class*='location']",
                    "label:has-text('Location')",
                    "div:has-text('Location')",
                ]
                
                coordinates_found = False
                
                for selector in coordinate_selectors:
                    try:
                        location_element = frame.locator(selector).first
                        element_count = await location_element.count()
                        
                        if element_count > 0:
                            location_text = await location_element.text_content()
                            
                            try:
                                parent = location_element.locator('..')
                                parent_text = await parent.text_content()
                            except:
                                parent_text = ""
                            
                            try:
                                next_sibling = location_element.locator('xpath=following-sibling::*[1]')
                                sibling_text = await next_sibling.text_content()
                            except:
                                sibling_text = ""
                            
                            combined_text = f"{location_text} {parent_text} {sibling_text}"
                            
                            coord_pattern = r'(\d+\.?\d*)\s*[°]?\s*([NS])\s*,?\s*(\d+\.?\d*)\s*[°]?\s*([EW])'
                            matches = re.findall(coord_pattern, combined_text, re.IGNORECASE)
                            
                            if matches:
                                match = matches[0]
                                extracted_coordinates = f"{match[0]}°{match[1]}, {match[2]}°{match[3]}"
                                coordinates_found = True
                                break
                                
                    except Exception as e:
                        continue
                
                if not coordinates_found:
                    try:
                        body_text = await frame.locator('body').text_content()
                        
                        coord_pattern = r'(\d+\.?\d*)\s*[°]?\s*([NS])\s*,?\s*(\d+\.?\d*)\s*[°]?\s*([EW])'
                        matches = re.findall(coord_pattern, body_text, re.IGNORECASE)
                        
                        if matches:
                            match = matches[0]
                            extracted_coordinates = f"{match[0]}°{match[1]}, {match[2]}°{match[3]}"
                    except Exception as e:
                        print(f"Error searching body for coordinates: {e}")
                        
            except Exception as e:
                print(f"Error extracting coordinates: {e}")

            # Save to JSON with error handling
            try:
                json_filename = f"{area_name}_{current_date}.json"
                json_path = os.path.join(DOWNLOAD_DIR, json_filename)
                
                json_data = {
                    "area_name": area_name,
                    "date": current_date,
                    "location": extracted_coordinates if extracted_coordinates else "Not found",
                    "status": "success" if extracted_coordinates else "coordinates_not_found"
                }
                
                with open(json_path, 'w', encoding='utf-8') as json_file:
                    json.dump(json_data, json_file, indent=2, ensure_ascii=False)
                
                print(f"JSON saved: {json_path}")
                
            except Exception as e:
                print(f"Error saving JSON: {e}")

            # Keep browser open for a moment to see results
            await page.wait_for_timeout(2000)

        except Exception as e:
            print(f"Fatal error: {e}")
        
        finally:
            await browser.close()

# Run script
if __name__ == "__main__":
    asyncio.run(run())