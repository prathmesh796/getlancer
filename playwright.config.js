const path = require('path');
const dotenv = require('dotenv');
const { defineConfig, devices } = require('@playwright/test');

dotenv.config({ path: path.join(__dirname, '.env.local'), quiet: true });
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const AUTH_DIR = path.join(__dirname, 'e2e', '.auth');
const CLIENT_AUTH_FILE = path.join(AUTH_DIR, 'client.json');
const E2E_TURNSTILE_BYPASS_TOKEN =
  process.env.E2E_TURNSTILE_BYPASS_TOKEN || 'e2e-turnstile-token';

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Auth tests share real DB users; parallel logins cause flaky session/redirect races.
  workers: 1,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      timeout: 90 * 1000,
      retries: process.env.CI ? 2 : 1,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/.*\.setup\.js/, /authenticated\.spec\.js/],
    },
    {
      name: 'chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: CLIENT_AUTH_FILE,
      },
      dependencies: ['setup'],
      testMatch: /authenticated\.spec\.js/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      E2E_TEST: '1',
      PLAYWRIGHT: '1',
      E2E_TURNSTILE_BYPASS_TOKEN,
    },
  },
});
