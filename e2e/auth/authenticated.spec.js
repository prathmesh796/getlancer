import { test, expect } from '@playwright/test';
import { logoutFromNavbar } from '../helpers/auth';

test.describe('Protected routes (authenticated client)', () => {
  test('can access client dashboard', async ({ page }) => {
    await page.goto('/Cdash');
    await expect(page).toHaveURL(/\/Cdash$/);
    await expect(
      page.getByRole('heading', { name: /Let's get some work done/i })
    ).toBeVisible();
  });

  test('can access client profile', async ({ page }) => {
    await page.goto('/Cprofile');
    await expect(page).toHaveURL(/\/Cprofile$/);
  });

  test('loses access to protected routes after logout', async ({ page }) => {
    await page.goto('/Cdash');
    await expect(page).toHaveURL(/\/Cdash$/);

    await logoutFromNavbar(page);

    await page.goto('/Cdash');
    await expect(page).toHaveURL(/\/login$/);
  });
});
