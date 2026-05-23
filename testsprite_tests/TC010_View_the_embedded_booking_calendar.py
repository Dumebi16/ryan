import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open a new browser tab to http://localhost:3001/contact to force a fresh load, wait for the page to render, and then check for an embedded booking/calendar widget (iframe or visible widget).
        # Open URL in new tab
        page = await context.new_page()
        await page.goto("http://localhost:3001/contact")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Wait 3 seconds to allow any pending rendering, then switch to the other open contact tab (tab_id E848) and inspect the page for an embedded booking/calendar widget (iframe or visible widget).
        # Switch to tab E848
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Click the 'SCHEDULE A CALL' element (index 52) to open or reveal the booking/calendar widget and then check for an embedded calendar or booking UI.
        # link "SCHEDULE A CALL"
        elem = page.locator("xpath=/html/body/div/div/div/nav/div[2]/a[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the Reload button (index 3) on the cal.com error page (tab DC33) to retry loading the booking page, then wait 3 seconds to allow the page to render.
        # button "Reload"
        elem = page.locator("xpath=/html/body/div/div/div[2]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Switch to the contact page tab (E848) and check the page for an embedded calendar by searching for iframe elements (and capture any iframe src if present).
        # Switch to tab E848
        page = context.pages[-1]  # switch to most recently active tab
        
        # --> Assertions to verify final state
        assert await page.locator("xpath=//*[contains(., 'Choose a time')]").nth(0).is_visible(), "The embedded booking calendar should be visible after opening the scheduling widget on the contact page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    