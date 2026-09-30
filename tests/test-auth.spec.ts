import { test, expect } from '@playwright/test';

test('login page has expected elements', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByText('Email Address')).toBeVisible();
  await expect(page.getByText('Password', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});

test('register page has expected elements', async ({ page }) => {
  await page.goto('/register');

  await expect(page.getByText('Create Account', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Full Name')).toBeVisible();
  await expect(page.getByText('Email Address')).toBeVisible();
  await expect(page.getByText('Organization Name')).toBeVisible();
  await expect(page.getByText('Password', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
});
