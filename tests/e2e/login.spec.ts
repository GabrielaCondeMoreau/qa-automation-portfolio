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

test('C02 · login con email no registrado muestra error', async ({ page }) => {
  // Fuente: REQ-L02

  // PREPARAR
  await page.goto('/login');

  // ACTUAR
  await page.getByLabel('Email').fill('noexiste@ejemplo.com');
  await page.getByLabel('Contraseña').fill('Segura2026!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // VERIFICAR
  await expect(page.getByTestId('login-error')).toHaveText(
    'Email o contraseña incorrectos',
  );
  await expect(page.getByTestId('login-welcome')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Iniciar sesión' }),
  ).toBeVisible();
});

test('C03 · login con contraseña incorrecta muestra error y no entra', async ({ page }) => {
  // Fuente: REQ-L02

  // PREPARAR
  await page.goto('/login');

  // ACTUAR
  await page.getByLabel('Email').fill('ana.garcia@ejemplo.com');
  await page.getByLabel('Contraseña').fill('Incorrecta1!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // VERIFICAR
  await expect(page.getByTestId('login-error')).toHaveText(
    'Email o contraseña incorrectos',
  );
  await expect(page.getByTestId('login-welcome')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Iniciar sesión' }),
  ).toBeVisible();
});

test('C04 · login con email vacío muestra error de campo obligatorio', async ({ page }) => {
  // Fuente: REQ-L01

  // PREPARAR
  await page.goto('/login');

  // ACTUAR
  await page.getByLabel('Contraseña').fill('Segura2026!');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // VERIFICAR
  await expect(page.getByTestId('login-error')).toHaveText(
    'El email es obligatorio',
  );
  await expect(page.getByTestId('login-welcome')).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Iniciar sesión' }),
  ).toBeVisible();
});
