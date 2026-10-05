# HU-REG-01 — Registro de estudiante

> **Sistema:** Academia sin Humo · `playground.calidadsinhumo.com/registro`
> **Fuente de los requerimientos:** `playground.calidadsinhumo.com/documentacion`, módulo 1
> (REQ-R01 a REQ-R07), consultada el 2026-09-19.
> **Quién la escribió:** historia de ejemplo armada para el curso a partir de esos requerimientos. En
> un equipo real la escribe producto; aquí se reescribió con el formato que suele llegar a un sprint.
> **Para qué está en C8:** es la historia que tu skill nunca vio. Con ella se prueba la skill.

---

## Historia

**Como** persona interesada en los cursos de la academia,
**quiero** crear mi cuenta con mis datos básicos,
**para** poder iniciar sesión e inscribirme en los cursos.

---

## Criterios de aceptación

| ID | Criterio | Requerimiento |
|---|---|---|
| CA1 | El formulario pide nombre completo, email, contraseña y edad. Los cuatro campos son obligatorios. | REQ-R01 |
| CA2 | El nombre debe tener entre 2 y 50 caracteres. | REQ-R02 |
| CA3 | El email debe tener formato válido: debe contener un `@` seguido de un dominio con punto. | REQ-R03 |
| CA4 | La contraseña debe tener entre 8 y 64 caracteres (inclusive). | REQ-R04 |
| CA5 | La edad debe estar entre 16 y 99 (inclusive). | REQ-R05 |
| CA6 | Tras un registro exitoso, el formulario se limpia completamente. | REQ-R06 |
| CA7 | No se puede registrar un email que ya existe en el sistema. | REQ-R07 |

---

## Notas del equipo

- El registro es la puerta de entrada: si falla, nadie llega al login ni a los cursos.
- Producto quiere salir con esto en la próxima versión; el diseño del formulario no se va a tocar.
- Los textos de los mensajes de error todavía no están definidos por producto.
