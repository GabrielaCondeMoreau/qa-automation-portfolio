import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly contrasena: Locator;
  readonly botonIniciarSesion: Locator;
  readonly mensajeError: Locator;
  readonly saludo: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByLabel('Email');
    this.contrasena = page.getByLabel('Contraseña');
    this.botonIniciarSesion = page.getByRole('button', { name: 'Iniciar sesión' });
    this.mensajeError = page.getByTestId('login-error');
    this.saludo = page.getByTestId('login-welcome');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, contrasena: string) {
    await this.email.fill(email);
    await this.contrasena.fill(contrasena);
    await this.botonIniciarSesion.click();
  }
}