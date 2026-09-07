import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://playground.calidadsinhumo.com/login';

test('comprueba locators semánticos del login', async ({ page }) => {
  await page.goto(LOGIN_URL);

  const email = page.getByLabel('Email');
  const password = page.getByLabel('Contraseña');
  const submit = page.getByRole('button', { name: 'Iniciar sesión' });

  await expect(email).toHaveCount(1);
  await expect(password).toHaveCount(1);
  await expect(submit).toHaveCount(1);

  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(submit).toBeVisible();
});
