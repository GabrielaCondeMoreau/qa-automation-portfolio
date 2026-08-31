import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 15_000,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
