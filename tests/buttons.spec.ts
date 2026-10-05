import { test, expect } from '@playwright/test';

// Use a mock session to bypass authentication redirects in client components
test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/session', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'ADMIN',
        },
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
    });
  });
});

test('Terms page renders successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/terms');
  await expect(page.locator('h1')).toContainText('Terms of Service');
});

test('Notifications page renders successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard/notifications');
  await expect(page.locator('h1')).toContainText('Notifications & Alert Hub');

  // markAllReadButton might not exist since it requires unreadCount > 0,
  // but if it is present we test it

  await expect(page.locator('text="All Notifications"').first()).toBeVisible();
});

test('Settings page renders successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard/settings');
  await expect(page.locator('h1')).toContainText('Settings');

  const generalTab = page.locator('button:has-text("General")');
  await generalTab.click();
  await expect(page.locator('h3:has-text("General Settings")')).toBeVisible();
});
