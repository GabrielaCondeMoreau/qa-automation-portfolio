# HU-LOG-01 — Inicio de sesión

> **Sistema:** Academia sin Humo · `playground.calidadsinhumo.com/login`
> **Fuente de los requerimientos:** `playground.calidadsinhumo.com/documentacion`, sección 2
> (REQ-L01 a REQ-L04), copiados palabra por palabra el 2026-09-19.
> **Quién la escribió:** historia de ejemplo armada para el curso a partir de esos requerimientos. En
> un equipo real la escribe producto; aquí tiene el formato que suele llegar a un sprint.

---

## Historia

**Como** estudiante registrada en la academia,
**quiero** iniciar sesión con mi email y mi contraseña,
**para** entrar a mi cuenta y seguir mis cursos.

---

## Criterios de aceptación

| ID | Criterio | Requerimiento |
|---|---|---|
| CA1 | El login requiere email y contraseña. Ambos son obligatorios. | REQ-L01 |
| CA2 | Las credenciales se validan contra los usuarios registrados. Un email no registrado o una contraseña incorrecta muestran un mensaje de error. | REQ-L02 |
| CA3 | Rate limiting: después de 5 intentos fallidos consecutivos, la cuenta se bloquea por 30 segundos. Durante el bloqueo: el botón de login debe estar deshabilitado; un timer visual muestra los segundos restantes; el botón se habilita exactamente cuando el timer llega a 0. | REQ-L03 |
| CA4 | Tras un login exitoso, el sistema muestra un mensaje de bienvenida con el nombre del usuario. | REQ-L04 |

---

## Notas del equipo

- El login es la puerta de entrada: las páginas `/cursos` y `/mi-progreso` requieren sesión
  (REQ-S01). Si el login falla, nadie llega a sus cursos.
- La pantalla publica una cuenta de prueba: `ana.garcia@ejemplo.com` / `Segura2026!`.
- La documentación no fija el texto de ningún mensaje de la pantalla de login.
