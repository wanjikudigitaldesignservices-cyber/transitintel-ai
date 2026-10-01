import { test, expect } from '@playwright/test';

test('homepage has expected elements', async ({ page }) => {
  await page.goto('/');

  // Check for navigation links
  await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();

  // Check for hero CTA buttons
  await expect(page.getByRole('link', { name: 'Start Free Trial' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Demo' })).toBeVisible();

  // Check for some text on the page
  await expect(page.getByText('AI-Powered Transit Intelligence')).toBeVisible();
  await expect(page.getByText('The Operating System')).toBeVisible();
});
