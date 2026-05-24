import { test, expect } from '@playwright/test';

test.describe('Public pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage renders hero content and title', async ({ page }) => {
    await expect(page).toHaveTitle(/getLancer - A freelancing website/);

    await expect(page.locator('h1', { hasText: 'Have Skills...' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Lets get you paid...' })).toBeVisible();

    await expect(page.locator('h1', { hasText: 'Have Company...' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Lets get you right talent...' })).toBeVisible();
  });

  test('navbar links navigate to About and Contact', async ({ page }) => {
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);

    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test('theme switch toggles light or dark class on html', async ({ page }) => {
    const htmlElement = page.locator('html');
    const themeBtn = page.locator('nav button').first();

    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    const isDark = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    const isLight = await htmlElement.evaluate((el) => el.classList.contains('light'));
    expect(isDark || isLight).toBe(true);
  });

  test('logged-out navbar shows Login and Signin', async ({ page }) => {
    const navbar = page.getByRole('navigation');
    await expect(navbar.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Signin', exact: true })).toBeVisible();
  });
});
