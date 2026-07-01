import { test, expect } from '@playwright/test';

test.describe('Registration flow (UI only)', () => {
  test('join page lets users select an account type', async ({ page }) => {
    await page.goto('/join');
    await expect(page.getByRole('heading', { name: 'Join our website' })).toBeVisible();

    await page.getByText('Sign in as a client').click();
    await expect(page.locator('input[type="radio"]').first()).toBeChecked();

    await page.getByText('Sign in as a freelancer').click();
    await expect(page.locator('input[type="radio"]').nth(1)).toBeChecked();
  });

  test('client sign-in form renders from join flow URL', async ({ page }) => {
    await page.goto('/signin?role=client');
    await expect(page.locator('[data-slot="card-title"]')).toHaveText('Sign in as a client');
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('freelancer sign-in form renders from join flow URL', async ({ page }) => {
    await page.goto('/signin?role=freelancer');
    await expect(page.locator('[data-slot="card-title"]')).toHaveText('Sign in as a freelancer');
  });
});
