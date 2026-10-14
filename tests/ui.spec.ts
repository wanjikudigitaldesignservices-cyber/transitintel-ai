import { test, expect } from '@playwright/test';

test('homepage has expected elements', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/TransitIntel AI/);
});

test('terms page is accessible', async ({ page }) => {
  await page.goto('http://localhost:3000/terms');
  await expect(page.locator('h1')).toContainText('Terms of Service');
});
