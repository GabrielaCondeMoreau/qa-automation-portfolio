# Fuente del primer test E2E: caso C01

Este archivo contiene la fuente del caso `C01` de `docs/casos-login-v2.md`, que se automatizó en la
demostración de la **Clase 10**. No depende de que una alumna haya entregado la tarea de C9.

> **No confundir:** `C10` es el número de la clase; `C01` es el número del caso. El caso `C10` de
> `docs/casos-login-v2.md` (timer de bloqueo) es otro caso y no se automatizó aquí.

> **Estado:** la clase ya se impartió. El test resultante vive en `tests/e2e/login.spec.ts`
> (`L1 · login con credenciales válidas muestra el saludo`). Si el producto cambia el saludo o las
> credenciales dejan de funcionar, registra la observación real antes de tocar el test.

## El caso C01

| Campo | Decisión |
|---|---|
| **Caso elegido** | `C01` · Login con credenciales válidas muestra el saludo con el nombre. Corresponde al ítem `L1` del backlog y a `REQ-L04`. |
| **Por qué va primero** | `L1` quedó priorizado con `3 · 3 · 3 · 3 = 12` y la decisión `AUTOMATIZAR YA`. El login habilita los flujos posteriores y este caso comprueba el saludo definido por `REQ-L04`. |
| **Datos** | Email: `ana.garcia@ejemplo.com` · Contraseña: `Segura2026!`. |
| **Resultado observado** | El encabezado identificado como `login-welcome` muestra exactamente `¡Hola, Ana!`. |
| **Requisito frente a observación** | `REQ-L04` exige un mensaje de bienvenida con el nombre, pero no define el texto exacto ni aclara si usa el nombre de pila o el nombre completo. La pantalla muestra `¡Hola, Ana!`. Esta diferencia conserva abierta `P4` de `docs/casos-login-v2.md`, sección 3. |
| **Qué NO demuestra este test** | No demuestra que el nombre mostrado sea el correcto según el negocio, que la sesión persista al navegar, que el catálogo cargue ni qué ocurre con credenciales inválidas. Tampoco resuelve `P4`. |

## Relación con otros archivos

- `docs/revision-login.md`, sección «Revisión del test de C10», registra la decisión `C10-J1` sobre
  `P4`. Es una **salida de la revisión**, no la fuente del caso.
- `docs/mapa-selectores.md` contiene los locators que usa el test.
