import { test, expect } from '@playwright/test';

test('Terms page renders and navigation works', async ({ page }) => {
  await page.goto('/terms');

  // Check the title of the page
  await expect(page).toHaveTitle(/Terms of Service — TransitIntel AI/);

  // Check that the "Get Started" button exists and is clickable
  const getStartedButton = page.getByRole('link', { name: 'Get Started' });
  await expect(getStartedButton).toBeVisible();
  await getStartedButton.click();

  // It should redirect to register page
  await expect(page).toHaveURL(/\/register/);
});

test('Login page renders and buttons are functional', async ({ page }) => {
  await page.goto('/login');

  // Check if sign in button exists
  const signInButton = page.getByRole('button', { name: 'Sign In' });
  await expect(signInButton).toBeVisible();

  // Try clicking sign in without filling details (should show errors or not submit, testing button clickability)
  await signInButton.click();
});
