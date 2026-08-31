import { test, expect } from '@playwright/test';

test('muestra el panel QA', async ({ page }) => {
  await page.setContent(`
    <main>
      <h1>Panel QA</h1>
      <p>Tu proyecto ya puede ejecutar una verificación reproducible.</p>
    </main>
  `);

  await expect(page.getByRole('heading', { name: 'Panel QA' })).toBeVisible();
});
