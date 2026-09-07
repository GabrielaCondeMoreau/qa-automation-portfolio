import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://playground.calidadsinhumo.com/login';

test('el locator propuesto encuentra un unico elemento visible', async ({ page }) => {
  await page.goto(LOGIN_URL);

  // ── ÚNICA LÍNEA QUE CAMBIAS ────────────────────────────────────────────────
  // Pega aquí el locator que propuso la IA, tal como te lo entregó.
  const propuesta = page.getByRole('heading', { name: 'Iniciar sesión' });
  // ───────────────────────────────────────────────────────────────────────────

  await expect(propuesta).toHaveCount(1);
  await expect(propuesta).toBeVisible();
});
