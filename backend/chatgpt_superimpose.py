import asyncio
import os
from datetime import datetime
from playwright.async_api import async_playwright

# ChatGPT Login Credentials
CHATGPT_EMAIL = "meruva24102@iiitnr.edu.in"
CHATGPT_PASSWORD = "$Kodandam9"

DOWNLOAD_DIR = "downloads"

async def superimpose_with_chatgpt(csidc_image_path, osm_image_path, area_name, email=None, password=None):
    """
    Use ChatGPT to superimpose CSIDC layout on OSM image.
    Follows exact step-by-step flow as specified by user.
    """
    result = {
        "status": "error",
        "superimposed_image": None,
        "error": None
    }
    
    # Use provided credentials or fall back to constants
    if not email:
        email = CHATGPT_EMAIL
    if not password:
        password = CHATGPT_PASSWORD
    
    # Check if input images exist
    if not os.path.exists(csidc_image_path):
        result["error"] = f"CSIDC image not found: {csidc_image_path}"
        return result
    
    if not os.path.exists(osm_image_path):
        result["error"] = f"OSM image not found: {osm_image_path}"
        return result
    
    async with async_playwright() as p:
        # Detect if running in production
        is_production = os.environ.get('RENDER') or os.environ.get('FLASK_ENV') == 'production'
        
        print(f"🌐 Browser mode: {'Headless' if is_production else 'Visible'}")
        
        browser = await p.chromium.launch(headless=bool(is_production), slow_mo=500)
        context = await browser.new_context(accept_downloads=True)
        page = await context.new_page()
        
        try:
            # STEP 1: Open ChatGPT
            print("\n[STEP 1] Opening ChatGPT...")
            await page.goto("https://chat.openai.com/", timeout=60000)
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(3000)
            
            # STEP 2: Accept cookies
            print("[STEP 2] Looking for cookies consent...")
            try:
                accept_cookies = page.locator("button:has-text('Accept all'), button:has-text('Accept'), button:has-text('Allow all')").first
                if await accept_cookies.is_visible(timeout=5000):
                    print("  → Clicking 'Accept all cookies'")
                    await accept_cookies.click()
                    await page.wait_for_timeout(1000)
                else:
                    print("  → No cookie banner found")
            except:
                print("  → No cookie banner found (or already accepted)")
            
            # STEP 3: Click login button at top right
            print("[STEP 3] Clicking login button at top right...")
            login_button = page.locator("button:has-text('Log in'), a:has-text('Log in')").first
            await login_button.wait_for(state="visible", timeout=10000)
            await login_button.click()
            print("  → Login button clicked")
            await page.wait_for_timeout(2000)
            
            # STEP 4: Click "Continue with Google"
            print("[STEP 4] Clicking 'Continue with Google' button...")
            google_button = page.locator("button:has-text('Continue with Google'), button:has-text('Google')").first
            await google_button.wait_for(state="visible", timeout=10000)
            await google_button.click()
            print("  → 'Continue with Google' clicked")
            await page.wait_for_timeout(5000)  # Increased wait time
            
            # Check for CAPTCHA / "Verify you're human"
            print("  → Checking for CAPTCHA...")
            try:
                # Look for reCAPTCHA iframe
                recaptcha_frame = page.frame_locator("iframe[src*='recaptcha'], iframe[title*='reCAPTCHA']").first
                
                # Try to find the checkbox inside the iframe
                try:
                    captcha_checkbox = recaptcha_frame.locator("div.recaptcha-checkbox-border, #recaptcha-anchor").first
                    
                    if await captcha_checkbox.is_visible(timeout=3000):
                        print("\n⚠️  CAPTCHA DETECTED!")
                        print("━" * 60)
                        print("  Attempting to tick the 'I'm not a robot' checkbox...")
                        print("━" * 60)
                        
                        # Click the checkbox
                        await captcha_checkbox.click()
                        print("  ✓ Checkbox clicked!")
                        
                        # Wait for potential image challenge
                        await page.wait_for_timeout(3000)
                        
                        # Check if image challenge appeared
                        image_challenge = page.locator("iframe[title*='challenge'], iframe[src*='bframe']").first
                        if await image_challenge.is_visible(timeout=2000):
                            print("\n⚠️  IMAGE CHALLENGE DETECTED!")
                            print("━" * 60)
                            print("  Please complete the image challenge:")
                            print("  ✓ Select the correct images")
                            print("  ✓ Click 'Verify'")
                            print("  ✓ Waiting 45 seconds for completion...")
                            print("━" * 60)
                            await page.wait_for_timeout(45000)
                        else:
                            print("  → No image challenge, continuing...")
                            await page.wait_for_timeout(3000)
                except:
                    # Maybe it's not in an iframe, try direct checkbox
                    direct_checkbox = page.locator("input[type='checkbox'], div.recaptcha-checkbox").first
                    if await direct_checkbox.is_visible(timeout=2000):
                        print("\n⚠️  CAPTCHA DETECTED (direct)!")
                        print("  → Clicking checkbox...")
                        await direct_checkbox.click()
                        print("  ✓ Checkbox clicked!")
                        await page.wait_for_timeout(5000)
                    else:
                        print("  → No CAPTCHA checkbox found")
                        
            except Exception as e:
                print(f"  → No CAPTCHA detected (or error: {str(e)[:50]}...)")

            
            # STEP 5: Enter Gmail
            print(f"[STEP 5] Entering Gmail: {email}")
            
            # Wait for page to be ready
            await page.wait_for_load_state("domcontentloaded")
            await page.wait_for_timeout(2000)
            
            email_input = page.locator("input[type='email']").first
            
            try:
                await email_input.wait_for(state="visible", timeout=15000)
            except:
                print("\n⚠️  Could not find email input automatically")
                print("━" * 60)
                print("  The Google login page may need manual intervention.")
                print("  Please enter your email manually if needed.")
                print("  Waiting 20 seconds...")
                print("━" * 60)
                await page.wait_for_timeout(20000)
                
                # Try again
                try:
                    await email_input.wait_for(state="visible", timeout=5000)
                except:
                    raise Exception("Email input field not found after waiting")
            
            await email_input.fill(email)
            print("  → Email entered")
            await page.wait_for_timeout(1000)
            
            # Click Next
            next_button = page.locator("button:has-text('Next'), #identifierNext").first
            await next_button.click()
            print("  → Clicked 'Next'")
            await page.wait_for_timeout(3000)
            
            # STEP 6: Enter Password
            print(f"[STEP 6] Entering password...")
            await page.wait_for_timeout(2000)
            
            password_input = page.locator("input[type='password']").first
            
            try:
                await password_input.wait_for(state="visible", timeout=15000)
            except:
                print("\n⚠️  Password input not found - may need manual intervention")
                print("━" * 60)
                print("  Please enter your password manually if prompted")
                print("  Waiting 20 seconds...")
                print("━" * 60)
                await page.wait_for_timeout(20000)
                
                # Try again
                try:
                    await password_input.wait_for(state="visible", timeout=5000)
                except:
                    raise Exception("Password input field not found after waiting")
            
            await password_input.fill(password)
            print("  → Password entered")
            await page.wait_for_timeout(1000)
            
            # Click Next
            next_button = page.locator("button:has-text('Next'), #passwordNext").first
            await next_button.click()
            print("  → Clicked 'Next'")
            await page.wait_for_timeout(5000)
            
            # Check for 2FA or security verification
            print("  → Checking for 2FA/security verification...")
            try:
                # Look for 2FA input or verification prompts
                two_fa_input = page.locator("input[type='tel'], input[aria-label*='code'], input[placeholder*='code']").first
                if await two_fa_input.is_visible(timeout=5000):
                    print("\n⚠️  2FA VERIFICATION REQUIRED!")
                    print("━" * 60)
                    print("  Please complete the 2-factor authentication:")
                    print("  ✓ Enter the verification code from your device")
                    print("  ✓ The script will wait for 45 seconds")
                    print("━" * 60)
                    await page.wait_for_timeout(45000)  # Wait 45 seconds for 2FA
                    print("  → Continuing after 2FA wait...")
            except:
                print("  → No 2FA detected")
            
            # STEP 7: Wait for new chat page to load
            print("[STEP 7] Waiting for new chat page to load...")
            # Wait for redirect to ChatGPT
            try:
                await page.wait_for_url("**/chat.openai.com/**", timeout=30000)
                print("  → Redirected to ChatGPT")
            except:
                print("  ⚠ URL didn't change, but continuing...")
            
            await page.wait_for_timeout(5000)
            print("  → Chat page loaded")
            
            # STEP 8: Click on + button
            print("[STEP 8] Clicking + button...")
            plus_button = page.locator("button:has-text('+'), button[aria-label*='ttach'], button[aria-label*='upload']").first
            await plus_button.wait_for(state="visible", timeout=15000)
            await plus_button.click()
            print("  → + button clicked")
            await page.wait_for_timeout(2000)
            
            # STEP 9: Click "Create image" option
            print("[STEP 9] Clicking 'Create image' option...")
            create_image = page.locator("text=/Create.*image/i, button:has-text('Create image')").first
            await create_image.wait_for(state="visible", timeout=10000)
            await create_image.click()
            print("  → 'Create image' clicked")
            await page.wait_for_timeout(3000)
            
            # STEP 10: Click + again to upload images
            print("[STEP 10] Clicking + again to upload images...")
            upload_button = page.locator("button:has-text('+'), button[aria-label*='ttach'], button[aria-label*='upload']").first
            await upload_button.wait_for(state="visible", timeout=10000)
            await upload_button.click()
            print("  → + button clicked for upload")
            await page.wait_for_timeout(1000)
            
            # STEP 11: Upload both images
            print("[STEP 11] Uploading images...")
            file_input = page.locator("input[type='file']").first
            await file_input.wait_for(state="attached", timeout=5000)
            
            # Upload both at once
            await file_input.set_input_files([
                os.path.abspath(csidc_image_path),
                os.path.abspath(osm_image_path)
            ])
            print(f"  → Uploaded CSIDC: {os.path.basename(csidc_image_path)}")
            print(f"  → Uploaded OSM: {os.path.basename(osm_image_path)}")
            await page.wait_for_timeout(3000)
            
            # STEP 12: Type the prompt
            print("[STEP 12] Typing prompt in chat...")
            prompt = "Match the layouts of both the maps and then superimpose the layout of the first image on the 2nd image"
            
            text_input = page.locator("textarea, input[type='text']").first
            await text_input.wait_for(state="visible", timeout=10000)
            await text_input.fill(prompt)
            print(f"  → Prompt entered: {prompt}")
            await page.wait_for_timeout(1000)
            
            # STEP 13: Click send button
            print("[STEP 13] Clicking send button...")
            send_button = page.locator("button[aria-label*='Send'], button:has-text('Send'), button[type='submit']").first
            
            # Alternative: just press Enter
            await text_input.press("Enter")
            print("  → Message sent (pressed Enter)")
            await page.wait_for_timeout(2000)
            
            # STEP 14: Wait for image generation
            print("[STEP 14] Waiting for image to generate (this may take 60-90 seconds)...")
            
            # Wait for generated image to appear
            max_wait = 120  # 2 minutes max
            waited = 0
            image_found = False
            
            while waited < max_wait and not image_found:
                # Look for generated images
                generated_images = page.locator("img[alt*='generated'], img[src*='blob:'], img[src*='files.oaiusercontent.com']")
                count = await generated_images.count()
                
                if count > 0:
                    print(f"  → Image generated! Found {count} image(s)")
                    image_found = True
                    break
                
                await page.wait_for_timeout(3000)
                waited += 3
                
                if waited % 15 == 0:
                    print(f"  ⏳ Still waiting... ({waited}s elapsed)")
            
            if not image_found:
                result["error"] = "Timeout: Image generation took too long"
                return result
            
            # STEP 15: Click on the generated image
            print("[STEP 15] Clicking on generated image...")
            generated_image = generated_images.last
            await generated_image.click()
            print("  → Image clicked")
            await page.wait_for_timeout(2000)
            
            # STEP 16: Click save/download button at top right
            print("[STEP 16] Looking for save/download button...")
            
            # Try multiple selectors for download button
            download_selectors = [
                "button:has-text('Download')",
                "button:has-text('Save')",
                "button[aria-label*='Download']",
                "button[aria-label*='Save']",
                "a[download]"
            ]
            
            download_clicked = False
            for selector in download_selectors:
                try:
                    download_btn = page.locator(selector).first
                    if await download_btn.is_visible(timeout=3000):
                        print(f"  → Found download button: {selector}")
                        
                        async with page.expect_download(timeout=30000) as download_info:
                            await download_btn.click()
                        
                        download = await download_info.value
                        
                        # Save with custom filename
                        current_date = datetime.now().strftime("%Y-%m-%d")
                        filename = f"superimposed_{area_name}_{current_date}.png"
                        filepath = os.path.join(DOWNLOAD_DIR, filename)
                        
                        await download.save_as(filepath)
                        result["superimposed_image"] = filepath
                        result["status"] = "success"
                        print(f"  ✅ Image downloaded: {filepath}")
                        download_clicked = True
                        break
                except Exception as e:
                    continue
            
            if not download_clicked:
                # Try alternative: right-click and save
                print("  → Trying right-click method...")
                try:
                    await generated_image.click(button="right")
                    await page.wait_for_timeout(500)
                    
                    save_option = page.locator("text=/Save.*image|Download/i").first
                    if await save_option.is_visible(timeout=3000):
                        async with page.expect_download(timeout=30000) as download_info:
                            await save_option.click()
                        
                        download = await download_info.value
                        current_date = datetime.now().strftime("%Y-%m-%d")
                        filename = f"superimposed_{area_name}_{current_date}.png"
                        filepath = os.path.join(DOWNLOAD_DIR, filename)
                        
                        await download.save_as(filepath)
                        result["superimposed_image"] = filepath
                        result["status"] = "success"
                        print(f"  ✅ Image downloaded via right-click: {filepath}")
                except Exception as e:
                    result["error"] = f"Could not download image: {str(e)}"
                    print(f"  ❌ Download failed: {str(e)}")
            
            await page.wait_for_timeout(2000)
            
        except Exception as e:
            print(f"\n❌ Error in ChatGPT automation: {e}")
            result["error"] = str(e)
            import traceback
            traceback.print_exc()
        
        finally:
            print("\n[CLEANUP] Closing browser...")
            await browser.close()
    
    return result

async def main():
    """Test the ChatGPT superimposition with automated login"""
    area_name = "Kapan"
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    csidc_image = os.path.join(DOWNLOAD_DIR, f"{area_name}_{current_date}.png")
    osm_image = os.path.join(DOWNLOAD_DIR, f"osm_{area_name}_{current_date}.png")
    
    print("="*70)
    print("ChatGPT Image Superimposition - Step-by-Step Automation")
    print("="*70)
    print(f"📁 CSIDC Image: {csidc_image}")
    print(f"📁 OSM Image: {osm_image}")
    print(f"🔐 Login Email: {CHATGPT_EMAIL}")
    print("="*70)
    
    result = await superimpose_with_chatgpt(csidc_image, osm_image, area_name)
    
    print("\n" + "="*70)
    print("FINAL RESULT")
    print("="*70)
    print(f"Status: {result['status']}")
    if result['status'] == 'success':
        print(f"✅ Superimposed Image: {result['superimposed_image']}")
    else:
        print(f"❌ Error: {result['error']}")
    print("="*70)

if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3:
        # Command line usage: python chatgpt_superimpose.py csidc_image.png osm_image.png [area_name]
        area = sys.argv[3] if len(sys.argv) > 3 else "Area"
        result = asyncio.run(superimpose_with_chatgpt(sys.argv[1], sys.argv[2], area))
        import json
        print(json.dumps(result, indent=2))
    else:
        asyncio.run(main())
