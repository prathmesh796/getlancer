import { test, expect } from '@playwright/test';
import {
  fillLoginForm,
  getCredentials,
  goToLoginFromNavbar,
  logoutFromNavbar,
  submitLogin,
  waitForDashboard,
} from '../helpers/auth';

test.describe('Session flows', () => {
  test('client can log in and log out from the navbar', async ({ page }) => {
    const { email, password, dashboard, heading } = getCredentials('client');

    await goToLoginFromNavbar(page);
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

    await goToLoginFromNavbar(page);
    await fillLoginForm(page, { email, password });
    await submitLogin(page);
    await waitForDashboard(page, dashboard);
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();

    await logoutFromNavbar(page);
    const navbar = page.getByRole('navigation');
    await expect(navbar.getByRole('link', { name: 'Signin', exact: true })).toBeVisible();
  });
});
