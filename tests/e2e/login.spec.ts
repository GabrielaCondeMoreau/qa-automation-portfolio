import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test('L1 · login con credenciales válidas muestra el saludo', async ({ page }) => {
  // Fuente: REQ-L04

  // PREPARAR
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ACTUAR
  await loginPage.login('ana.garcia@ejemplo.com', 'Segura2026!');

  // VERIFICAR
  const saludo = loginPage.saludo;
  await expect(saludo).toHaveText('¡Hola, Ana!');
});

test('C02 · login con email no registrado muestra error', async ({ page }) => {
  // Fuente: REQ-L02

  // PREPARAR
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ACTUAR
  await loginPage.login('noexiste@ejemplo.com', 'Segura2026!');

  // VERIFICAR
  await expect(loginPage.mensajeError).toHaveText(
    'Email o contraseña incorrectos',
  );
  await expect(loginPage.saludo).not.toBeVisible();
  await expect(
    loginPage.botonIniciarSesion,
  ).toBeVisible();
});

test('C03 · login con contraseña incorrecta muestra error y no entra', async ({ page }) => {
  // Fuente: REQ-L02

  // PREPARAR
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ACTUAR
  await loginPage.login('ana.garcia@ejemplo.com', 'Incorrecta1!');

  // VERIFICAR
  await expect(loginPage.mensajeError).toHaveText(
    'Email o contraseña incorrectos',
  );
  await expect(loginPage.saludo).not.toBeVisible();
  await expect(
    loginPage.botonIniciarSesion,
  ).toBeVisible();
});

test('C04 · login con email vacío muestra error de campo obligatorio', async ({ page }) => {
  // Fuente: REQ-L01

  // PREPARAR
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ACTUAR
  await loginPage.contrasena.fill('Segura2026!');
  await loginPage.botonIniciarSesion.click();

  // VERIFICAR
  await expect(loginPage.mensajeError).toHaveText(
    'El email es obligatorio',
  );
  await expect(loginPage.saludo).not.toBeVisible();
  await expect(
    loginPage.botonIniciarSesion,
  ).toBeVisible();
});

// Caso C05 · REQ-L01 · CA1
// Login con contraseña vacía muestra mensaje de error de campo obligatorio.
// Fuente: docs/casos-login-v2.md §5, fila C05.

test('C05 · login con contraseña vacía muestra error de campo obligatorio y no entra', async ({ page }) => {
  // PREPARAR
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // ACTUAR
  await loginPage.login('ana.garcia@ejemplo.com', '');

  // VERIFICAR · lo que SÍ pasa, lo que NO pasa, y dónde sigo
  await expect(loginPage.mensajeError).toHaveText(
    'La contraseña es obligatoria',
  );
  await expect(loginPage.saludo).not.toBeVisible();
  await expect(loginPage.botonIniciarSesion).toBeVisible();
});
