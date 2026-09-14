import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://playground.calidadsinhumo.com/login';

async function registrarDespues(
  eventos: string[],
  mensaje: string,
  demoraMs: number,
): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, demoraMs));
  eventos.push(mensaje);
  console.log(mensaje);
}

test('confirma el orden de una operación asíncrona', async () => {
  const eventos: string[] = [];

  eventos.push('1. antes de esperar');
  console.log('1. antes de esperar');

  await registrarDespues(eventos, '2. operación terminada', 50);

  eventos.push('3. después de esperar');
  console.log('3. después de esperar');

  expect(eventos).toEqual([
    '1. antes de esperar',
    '2. operación terminada',
    '3. después de esperar',
  ]);
});

test('lee en orden el test de locators de S4', async ({ page }) => {
  console.log('1. abrir login');
  await page.goto(LOGIN_URL);

  console.log('2. describir locators');
  const email = page.getByLabel('Email');
  const password = page.getByLabel('Contraseña');
  const submit = page.getByRole('button', { name: 'Iniciar sesión' });

  console.log('3. comprobar cantidad');
  await expect(email).toHaveCount(1);
  await expect(password).toHaveCount(1);
  await expect(submit).toHaveCount(1);

  console.log('4. comprobar visibilidad');
  await expect(email).toBeVisible();
  await expect(password).toBeVisible();
  await expect(submit).toBeVisible();

  console.log('5. test terminado');
});
