import { test, expect } from '@playwright/test';

test('L1 · login con credenciales válidas muestra el saludo', async ({ page }) => {
  // Fuente: REQ-L04

  // PREPARAR
  await page.goto('/login');

  // ACTUAR
  await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
  await page.getByLabel('Contraseña').fill('Segura2026!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // VERIFICAR
  const saludo = page.getByTestId('login-welcome');
  await expect(saludo).toHaveText('¡Hola, Ana!');
});

test('L2 · Login con contraseña incorrecta no entra y muestra el error', async ({ page }) => {
  // Fuente: REQ-L02

  // PREPARAR
  await page.goto('/login');
  await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
  await page.getByLabel('Contraseña').fill('malamala');

  // ACTUAR
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // VERIFICAR
  const error = page.getByTestId('login-error');

  await expect(error).toBeVisible();
  await expect(error).toHaveText('Email o contraseña incorrectos');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(
    page.getByText('Has iniciado sesión correctamente.'),
  ).toHaveCount(0);
});