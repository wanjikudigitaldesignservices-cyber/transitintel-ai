import { test, expect } from '@playwright/test';

test('login page has expected form elements', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Welcome back');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
});

test('register page has expected form elements', async ({ page }) => {
  await page.goto('/register');
  await expect(page.locator('h1')).toContainText('Create Account');
  await expect(page.locator('input[id="name"]')).toBeVisible();
  await expect(page.locator('input[id="email"]')).toBeVisible();
  await expect(page.locator('input[id="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toContainText('Create Account');
});
