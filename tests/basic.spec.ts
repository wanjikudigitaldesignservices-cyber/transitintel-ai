import { test, expect } from '@playwright/test';

test('login page has terms link', async ({ page }) => {
  await page.goto('/login');
  const termsLink = page.getByRole('link', { name: /terms/i });
  await expect(termsLink).toBeVisible();
});

test('terms page loads successfully', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /terms of service/i, level: 1 })).toBeVisible();
});
