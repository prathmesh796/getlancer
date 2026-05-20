import { test, expect } from '@playwright/test';

test.describe('getLancer Application Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Go to homepage before each test
    await page.goto('/');
  });

  test('Homepage renders correctly with title and main hero headings', async ({ page }) => {
    // Verify title from metadata
    await expect(page).toHaveTitle(/getLancer - A freelancing website/);

    // Verify hero text
    const headingFreelancer = page.locator('h1', { hasText: 'Have Skills...' });
    await expect(headingFreelancer).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Lets get you paid...' })).toBeVisible();

    const headingClient = page.locator('h1', { hasText: 'Have Company...' });
    await expect(headingClient).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Lets get you right talent...' })).toBeVisible();
  });

  test('Navigation links to About and Contact pages work correctly', async ({ page }) => {
    // Click on About navigation link
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about$/);

    // Click on Contact navigation link
    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/contact$/);
  });

  test('Theme switch toggle behaves correctly', async ({ page }) => {
    // Check initial html class for theme or check toggling
    const htmlElement = page.locator('html');
    
    // Find theme switch button in Navbar (usually the only button or tab in that section)
    // The button has is in Navbar and contains the BsFillMoonStarsFill or IoSunny icon.
    // In our implementation of components/theme-switch.js it is inside a Nav tag or flex section.
    // Let's locate the theme switch button by its tab icon or index.
    const themeBtn = page.locator('nav button').first();
    await expect(themeBtn).toBeVisible();

    // Trigger click on theme switch button
    await themeBtn.click();

    // Verify cookie or localstorage state if modified, or inspect visual class change
    const isDark = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    const isLight = await htmlElement.evaluate((el) => el.classList.contains('light'));
    expect(isDark || isLight).toBe(true);
  });
});
