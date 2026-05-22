import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { AUTH_DIR, CLIENT_AUTH_FILE, loginAs } from './helpers/auth';

setup('authenticate as client', async ({ page }) => {
  fs.mkdirSync(path.join(process.cwd(), AUTH_DIR), { recursive: true });
  await loginAs(page, 'client');
  await page.context().storageState({ path: CLIENT_AUTH_FILE });
});
