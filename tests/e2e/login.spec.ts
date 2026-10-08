import { test, expect } from '@playwright/test';

test('L1 Â· login con credenciales vÃ¡lidas muestra el saludo', async ({ page }) => {
  // Fuente: REQ-L04

  // PREPARAR
  await page.goto('/login');

  // ACTUAR
  await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
  await page.getByLabel('ContraseÃ±a').fill('Segura2026!');
  await page.getByRole('button', { name: 'Iniciar sesiÃ³n' }).click();

  // VERIFICAR
  const saludo = page.getByTestId('login-welcome');
  await expect(saludo).toHaveText('Â¡Hola, Ana!');


});

test('L2 Â· Login con contraseÃ±a incorrecta no entra y muestra el error', async ({ page }) => {
  // Fuente: REQ-L02

  // PREPARAR
  await page.goto('/login');
  await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
  await page.getByLabel('ContraseÃ±a').fill('malamala');

  // ACTUAR
  await page.getByRole('button', { name: 'Iniciar sesiÃ³n' }).click();

  // VERIFICAR
  const error = page.getByTestId('login-error');

  await expect(error).toBeVisible();
  await expect(error).toHaveText('Email o contraseÃ±a incorrectos');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(
    page.getByText('Has iniciado sesiÃ³n correctamente.'),
  ).toHaveCount(0);
});
