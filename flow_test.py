import os
from playwright.sync_api import sync_playwright

def run_test():
    artifacts_dir = r"C:\Users\Preetham.j\.gemini\antigravity\brain\c95f737b-481b-4921-aabf-dc774f62b939"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("Navigating to local dev server...")
        page.goto("http://127.0.0.1:8081")
        page.wait_for_load_state("networkidle")
        
        page.screenshot(path=os.path.join(artifacts_dir, "phoenix_home_verified.png"))
        print("Home verified.")
        
        print("Clicking AI Singularity Nexus...")
        
        # Click the button that opens the alert
        page.once("dialog", lambda dialog: dialog.accept())
        page.click("text=Engage ➔", delay=500)
        
        page.screenshot(path=os.path.join(artifacts_dir, "phoenix_singularity_verified.png"))
        print("Singularity verified.")
        
        browser.close()

if __name__ == "__main__":
    run_test()
