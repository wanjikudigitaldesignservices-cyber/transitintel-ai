import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(record_video_dir="/home/jules/verification/videos")
        page = await context.new_page()

        # Mock auth to bypass login
        await page.route('**/api/auth/session', lambda route: route.fulfill(
            status=200,
            content_type='application/json',
            body='{\"user\":{\"name\":\"Test User\",\"email\":\"test@test.com\",\"role\":\"SUPER_ADMIN\",\"organizationName\":\"Test Org\"},\"expires\":\"2030-01-01T00:00:00.000Z\"}'
        ))

        # Navigate to notifications
        print("Navigating to /dashboard/notifications")
        await page.goto("http://localhost:3000/dashboard/notifications", wait_until='networkidle')
        await page.wait_for_timeout(3000)

        # Click Mark All Read
        print("Clicking Mark All Read")
        await page.locator("text=Mark All Read").click()
        await page.wait_for_timeout(1000)

        # Click on the UNREAD tab
        print("Clicking UNREAD tab")
        await page.locator("text=Unread").click()
        await page.wait_for_timeout(1000)

        # Navigate to settings
        print("Navigating to /dashboard/settings")
        await page.goto("http://localhost:3000/dashboard/settings", wait_until='networkidle')
        await page.wait_for_timeout(3000)

        # Click General Tab
        print("Clicking General Tab")
        await page.locator("text=General").nth(0).click()
        await page.wait_for_timeout(1000)

        # Click Organization Tab
        print("Clicking Organization Tab")
        await page.locator("text=Organization").nth(0).click()
        await page.wait_for_timeout(1000)

        # Navigate to terms page to test double quote fix
        print("Navigating to /terms")
        await page.goto("http://localhost:3000/terms", wait_until='networkidle')
        await page.wait_for_timeout(2000)

        # Take screenshot at the final state
        await page.screenshot(path="/home/jules/verification/screenshots/verification.png")
        await page.wait_for_timeout(1500)  # Hold final state for the video

        await context.close()  # MUST close context to save the video
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
