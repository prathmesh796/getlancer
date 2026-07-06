import { test, expect } from '@playwright/test';
import { getCredentials, loginAs, waitForDashboard } from './helpers/auth';

test.describe('Applications Flow', () => {
  test('Freelancer can access dashboard and my applications', async ({ page }) => {
    await loginAs(page, 'freelancer');
    
    // Freelancer dashboard
    await expect(page.getByRole('heading', { name: "Let's find some work..." })).toBeVisible();
    await expect(page.getByText('Recommended for You')).toBeVisible();

    // Navigate to My Applications using the sidebar or direct URL
    await page.goto('/MyApplications');
    await expect(page.getByRole('heading', { name: 'Applications Submitted' })).toBeVisible();
    
    // Check if the filter button exists
    const filterBtn = page.getByRole('button', { name: /Filter/i });
    await expect(filterBtn).toBeVisible();
  });

  test('Client can access dashboard and jobs list', async ({ page }) => {
    await loginAs(page, 'client');
    
    // Client dashboard
    await expect(page.getByRole('heading', { name: "Let's get some work done..." })).toBeVisible();
    await expect(page.getByText('Your Posted Jobs')).toBeVisible();

    // Check if the filter button exists
    const filterBtn = page.getByRole('button', { name: /Filter/i });
    await expect(filterBtn).toBeVisible();
  });
});
