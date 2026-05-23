import { expect } from '@playwright/test';

export const AUTH_DIR = 'e2e/.auth';
export const CLIENT_AUTH_FILE = `${AUTH_DIR}/client.json`;

const LOGIN_TIMEOUT = 45_000;
const E2E_TURNSTILE_BYPASS_TOKEN =
  process.env.E2E_TURNSTILE_BYPASS_TOKEN || 'e2e-turnstile-token';

export function getCredentials(role = 'client') {
  if (role === 'freelancer') {
    return {
      email: process.env.E2E_FREELANCER_EMAIL || 'freelancer@example.com',
      password: process.env.E2E_FREELANCER_PASSWORD || 'freelancerpassword',
      dashboard: /\/Fdash$/,
      heading: /Let's find some work/i,
    };
  }

  return {
    email: process.env.E2E_CLIENT_EMAIL || 'client@example.com',
    password: process.env.E2E_CLIENT_PASSWORD || 'clientpassword',
    dashboard: /\/Cdash$/,
    heading: /Let's get some work done/i,
  };
}

async function stubTurnstile(page) {
  await page.addInitScript((token) => {
    window.turnstile = {
      render(_selector, { callback }) {
        callback(token);
        return 'e2e-widget';
      },
      remove() {},
    };
  }, E2E_TURNSTILE_BYPASS_TOKEN);
}

export async function fillLoginForm(page, { email, password }) {
  await stubTurnstile(page);
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
}

export async function submitLogin(page, { waitForSession = true } = {}) {
  const signInResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/auth/callback/credentials') &&
      response.request().method() === 'POST',
    { timeout: LOGIN_TIMEOUT }
  );

  await page.getByRole('button', { name: 'Log In' }).click();
  await signInResponse;

  if (waitForSession) {
    await page
      .waitForResponse(
        (response) =>
          response.url().includes('/api/auth/session') && response.status() === 200,
        { timeout: 10_000 }
      )
      .catch(() => {});
  }
}

export async function waitForDashboard(page, dashboard) {
  const deadline = Date.now() + LOGIN_TIMEOUT;

  while (Date.now() < deadline) {
    if (dashboard.test(page.url())) {
      return;
    }

    // Login may briefly land on home before the app redirects by role.
    if (page.url().endsWith('/') || page.url().endsWith('/login')) {
      await page.waitForTimeout(500);
      continue;
    }

    await page.waitForTimeout(250);
  }

  await expect(page).toHaveURL(dashboard, { timeout: 10_000 });
}

export async function logoutFromNavbar(page) {
  const navbar = page.getByRole('navigation');
  const signOutResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/auth/signout') &&
      response.request().method() === 'POST',
    { timeout: LOGIN_TIMEOUT }
  );

  await navbar.getByRole('button', { name: 'Logout' }).click();
  await signOutResponse;

  await expect(navbar.getByRole('link', { name: 'Login' })).toBeVisible({
    timeout: LOGIN_TIMEOUT,
  });
}

export async function loginAs(page, role = 'client') {
  const { email, password, dashboard } = getCredentials(role);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await fillLoginForm(page, { email, password });
    await submitLogin(page);

    try {
      await waitForDashboard(page, dashboard);
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
    }
  }
}

export async function goToLoginFromNavbar(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const navbar = page.getByRole('navigation');
  await expect(navbar.getByRole('link', { name: 'Login' })).toBeVisible();
  await navbar.getByRole('link', { name: 'Login' }).click();
  await page.waitForURL(/\/login$/, { timeout: LOGIN_TIMEOUT });
}
