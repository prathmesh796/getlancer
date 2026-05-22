import { test, expect } from '@playwright/test';
import {
  fillLoginForm,
  getCredentials,
  logoutFromNavbar,
  submitLogin,
  waitForDashboard,
} from '../helpers/auth';

test.describe('Session flows', () => {
  test('client can log in and log out from the navbar', async ({ page }) => {
    const { email, password, dashboard, heading } = getCredentials('client');

    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await fillLoginForm(page, { email, password });
    await submitLogin(page);
    await waitForDashboard(page, dashboard);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();

    await logoutFromNavbar(page);
    const navbar = page.getByRole('navigation');
    await expect(navbar.getByRole('link', { name: 'Signin', exact: true })).toBeVisible();
  });

  test('freelancer can log in and log out from the navbar', async ({ page }) => {
    const { email, password, dashboard, heading } = getCredentials('freelancer');

    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await fillLoginForm(page, { email, password });
    await submitLogin(page);
    await waitForDashboard(page, dashboard);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();

    await logoutFromNavbar(page);
    const navbar = page.getByRole('navigation');
    await expect(navbar.getByRole('link', { name: 'Signin', exact: true })).toBeVisible();
  });
});
