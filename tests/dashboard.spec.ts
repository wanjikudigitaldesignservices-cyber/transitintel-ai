import { test, expect } from '@playwright/test';

// Function to intercept NextAuth session
async function mockSession(page) {
  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          name: 'Test User',
          email: 'test@example.com',
          image: null,
          role: 'ADMIN',
          organizationId: 'org-123',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
  });
}

test.describe('Dashboard Client Components', () => {
  test.beforeEach(async ({ page }) => {
    await mockSession(page);
  });

  test('Notifications page', async ({ page }) => {
    // Intercept the cron API call
    await page.route('**/api/cron/whatsapp-dispatch', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/dashboard/notifications');

    // Verify the page loads successfully by checking for headings
    await expect(page.locator('h1')).toContainText('Notifications & Alert Hub');

    // Test "Mark All Read" button
    const markAllReadBtn = page.getByRole('button', { name: /Mark All Read/i });
    if (await markAllReadBtn.isVisible()) {
      await markAllReadBtn.click();
    }

    // Test "Run 4-Hour Auto-Cycle Now" button
    const autoCycleBtn = page.getByRole('button', { name: /Run 4-Hour Auto-Cycle Now/i });
    await expect(autoCycleBtn).toBeVisible();
    await autoCycleBtn.click();

    // Wait for the resulting message
    const dispatchStatus = page.getByText(/Hands-Free 4-Hour Cycle Complete!/i);
    await expect(dispatchStatus).toBeVisible();

    // Test "Test WhatsApp Connection" button
    // It opens a new tab, so we need to handle the new page event if needed. We'll just click it here and make sure no errors occur.
    // Intercept window.open to prevent it from actually opening a new tab and blocking or failing
    await page.evaluate(() => {
      window.open = function() { return null; };
    });
    const testConnectionBtn = page.getByRole('button', { name: /Test WhatsApp Connection/i });
    await expect(testConnectionBtn).toBeVisible();
    await testConnectionBtn.click();
  });

  test('Settings page', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Verify page loads by checking the header
    await expect(page.locator('h1')).toContainText('Settings');

    // Test "Save WhatsApp Preferences" button on the active tab (notifications)
    const saveWhatsAppBtn = page.getByRole('button', { name: /Save WhatsApp Preferences/i });
    await expect(saveWhatsAppBtn).toBeVisible();
    await saveWhatsAppBtn.click();

    // Test "General" tab and "Save Changes" button
    const generalTab = page.getByRole('button', { name: /^General$/i });
    await expect(generalTab).toBeVisible();
    await generalTab.click();

    // Verify the general settings section header is visible
    await expect(page.getByRole('heading', { name: 'General Settings' })).toBeVisible();

    const saveChangesBtn = page.getByRole('button', { name: /^Save Changes$/i }).first();
    await expect(saveChangesBtn).toBeVisible();
    await saveChangesBtn.click();
  });
});
