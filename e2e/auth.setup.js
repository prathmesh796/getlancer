import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  AUTH_DIR,
  CLIENT_AUTH_FILE,
  getCredentials,
  loginAs,
} from './helpers/auth';

setup('authenticate as client', async ({ page }) => {
  fs.mkdirSync(path.join(process.cwd(), AUTH_DIR), { recursive: true });

  const { dashboard, heading } = getCredentials('client');
  await loginAs(page, 'client');

  await expect(page).toHaveURL(dashboard);
  await expect(page.getByRole('heading', { name: heading })).toBeVisible();

  await page.context().storageState({ path: CLIENT_AUTH_FILE });
});
