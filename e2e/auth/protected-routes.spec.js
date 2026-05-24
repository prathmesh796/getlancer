import { test, expect } from '@playwright/test';

test.describe('Protected routes (unauthenticated)', () => {
  test('redirects from client dashboard to login', async ({ page }) => {
    await page.goto('/Cdash');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects from freelancer dashboard to login', async ({ page }) => {
    await page.goto('/Fdash');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('redirects from client profile to login', async ({ page }) => {
    await page.goto('/Cprofile');
    await expect(page).toHaveURL(/\/login$/);
  });
});
