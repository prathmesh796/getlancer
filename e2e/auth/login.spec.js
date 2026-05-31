import { test, expect } from '@playwright/test';
import { fillLoginForm, getCredentials, loginAs, submitLogin } from '../helpers/auth';

test.describe('Login page', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-slot="card-title"]')).toHaveText('Log In');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    const { email } = getCredentials('client');
    await fillLoginForm(page, {
      email,
      password: 'wrong-password-for-e2e',
    });
    await submitLogin(page, { waitForSession: false });

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('client can log in and reach the client dashboard', async ({ page }) => {
    page.on('console', msg => console.log(`Browser: ${msg.text()}`));
    const { heading } = getCredentials('client');
    await loginAs(page, 'client');
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  });

  test('freelancer can log in and reach the freelancer dashboard', async ({ page }) => {
    const { heading } = getCredentials('freelancer');
    await loginAs(page, 'freelancer');
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  });
});
