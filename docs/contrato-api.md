# Contrato de la API — Academia sin Humo

> **Este documento te lo dan.** No lo escribes tú.
>
> Es la documentación del producto, exportada tal como la entrega el equipo que construyó la API.
> En tu trabajo llega igual: como un PDF, una página de Confluence, un Swagger o un mensaje de un
> desarrollador. Cambia el formato, no cambia lo que tienes que hacer con él: **leerlo, usarlo y
> verificarlo.**

**Base URL:** `https://playground.calidadsinhumo.com`
**Fuente del documento:** `https://playground.calidadsinhumo.com/documentacion` — secciones 3, 5 y 6
**Entregado por:** equipo de producto de Academia sin Humo
**Copiado a este repositorio el:**

---

## Cómo se lee este archivo

| Sección | Quién la escribe | Qué contiene |
|---|---|---|
| 0 a 3 | **el producto** | lo que la API **promete**. Llega escrito. No lo edites. |
| **4 · Discrepancias observadas** | **tú, QA** | el registro mínimo de los cinco casos y, cuando no coinciden, las dos versiones del hallazgo |
| **5 · Lo que el contrato no define** | **tú, QA** | los huecos: casos que ocurren y que este documento no cubre |
| 6 a 9 | procedimiento | cómo organizarlo con IA, el gate, qué hacer si no te dan contrato, adónde va |

**Las tres advertencias que hay que decir en voz alta:**

1. Todo lo que dicen las secciones 0 a 3 es una **promesa**. Nadie verificó todavía que el producto
   la cumpla.
2. Un contrato dado **no prueba nada**. Prueba que alguien escribió lo que debería pasar.
3. La única forma de saber si el producto cumple es **ejecutar**. Eso es lo tuyo, y por eso las dos
   únicas secciones que escribes son la 4 y la 5.

---

## 0. Superficie declarada de la API

| Método | Ruta | De dónde salió | Para qué |
|---|---|---|---|
| POST | `/api/login` | documentación · sección 2 | iniciar sesión; devuelve la cookie `ash_session` |
| POST | `/api/enroll` | documentación · REQ-A01 | inscribirse a un curso |
| GET | `/api/courses` | **observación en Network** — REQ-C01 define qué muestra el catálogo, no el endpoint que lo alimenta | listar cursos con cupos y prerequisitos |
| GET | `/api/auth/me` | **observación en Network** — no está documentado | quién es la sesión actual |
| GET | `/api/progress` | **observación en Network** — no está documentado | inscripciones y progreso |

> **Ya hay una lección acá.** De los cinco endpoints que existen, **la documentación nombra dos**.
> Los otros tres aparecieron mirando la pestaña Network mientras alguien usaba la aplicación. Un
> contrato dado casi nunca cubre toda la superficie real: cubre lo que alguien se acordó de escribir.

Rutas que **no existen** aunque aparezcan en materiales viejos: `/api/reservas`, `/api/perfil`,
`/api/users`. Las tres devuelven `404`.

---

## 1. POST /api/enroll — el endpoint del día

**Qué envía (REQ-A01):** un body JSON con el campo `courseId`.

**Qué debe validar (REQ-A02):** que el curso exista, que haya cupos y que el prerequisito esté
completado. Textual del documento: *"Las mismas reglas que la UI"*.

**Las cinco respuestas esperadas (REQ-A03):**

| # | Caso | Body que se envía | Status que promete la spec | Respuesta documentada | REQ |
|---|---|---|---|---|---|
| 1 | Inscripción exitosa | `{"courseId":"fundamentos"}` | `200` | `status: "inscrito"` | REQ-A03 |
| 2 | Falta el campo obligatorio | `{}` | `400` | `El campo courseId es obligatorio` | REQ-A03 · REQ-A01 |
| 3 | Curso que no existe | `{"courseId":"no-existe"}` | `404` | `Curso no encontrado` | REQ-A03 |
| 4 | Sin cupos | `{"courseId":"api-testing"}` | `200` | `status: "lista-espera"` | REQ-A03 · REQ-C02 |
| 5 | Prerequisito no completado | `{"courseId":"playwright-cero"}` | `403` | rechazo por prerequisito pendiente | REQ-A03 · REQ-C03 · REQ-C06 |

**Tabla de decisión de REQ-C02** — así llega escrita en la documentación:

| Prerequisito completado | Cupo disponible | Resultado esperado |
|---|---|---|
| Sí | Sí | Inscrito |
| Sí | No | Lista de espera |
| No | Sí | Rechazado (prerequisito pendiente) |
| No | No | Rechazado |

**Regla que conecta las dos capas (REQ-C06):** *"La API de inscripción (`POST /api/enroll`) debe
aplicar las mismas reglas de validación que la UI. Un curso con prerequisito pendiente debe ser
rechazado tanto en la UI como en la API."*

**Regla que define "completado" (REQ-C03):** *"Un curso solo se desbloquea cuando el estudiante ha
completado su prerequisito. Estar inscrito o en progreso no cuenta como completado."*

**Regla sobre cómo se muestra la lista de espera (REQ-C05):** *"Si el estudiante queda en lista de
espera, el badge debe mostrar 'Lista de espera' (no 'Inscrito')."* Aplica al caso 4: conviene mirar
**todo** el body de la respuesta, no solo el campo `status`.

**Mapa de prerequisitos documentado:**

```text
Fundamentos de Testing          ← sin prerequisito
  ↳ Playwright desde cero       ← requiere Fundamentos
  ↳ Diseño de casos de prueba   ← requiere Fundamentos
      ↳ API Testing             ← requiere Playwright desde cero
      ↳ CI/CD para QA           ← requiere Playwright desde cero
      ↳ Liderazgo QA            ← requiere Diseño de casos
```

---

## 2. POST /api/login

| | |
|---|---|
| Qué envía | `{ "email": "...", "password": "..." }` |
| Status esperado | `200` con credenciales válidas · `401` con credenciales inválidas · `400` si falta un campo |
| REQ que lo respalda | REQ-L01 (ambos campos obligatorios) · REQ-L02 (credenciales inválidas → error) |
| Qué devuelve | mensaje de éxito y los datos del usuario |
| Cómo mantiene la sesión | header `set-cookie` con `ash_session` |

**Reglas de negocio que le aplican:**

- **REQ-L01** — El login requiere email y contraseña. Ambos son obligatorios.
- **REQ-L02** — Las credenciales se validan contra los usuarios registrados. Un email no registrado o
  una contraseña incorrecta muestran un mensaje de error.
- **REQ-L03** — *Rate limiting*: después de 5 intentos fallidos consecutivos, la cuenta se bloquea por
  30 segundos.
- **REQ-L04** — Tras un login exitoso, el sistema muestra un mensaje de bienvenida con el nombre del
  usuario.

> **Cuidado en clase y en la tarea:** REQ-L03 es una regla del producto, no un error. Si te bloqueas,
> el sistema está funcionando como está escrito.

---

## 3. GET /api/courses

| | |
|---|---|
| Status esperado | `200` |
| REQ que lo respalda | REQ-C01 define el **contenido** del catálogo; el endpoint no está documentado aparte |
| Qué devuelve | `{"courses":[...],"total":N}` |
| Campos de cada curso | `id`, `title`, `description`, `level`, `duration`, `prerequisiteId`, `maxStudents`, `enrolled`, `icon` |
| ¿Necesita sesión? | **el documento no lo dice** |

**Regla asociada (REQ-C04):** *"Al inscribirse exitosamente, el número de cupos disponibles debe
reducirse en 1."*

---

## 4. Discrepancias observadas

> **Esta sección la escribes tú.** El resto de este archivo llegó escrito.
>
> Una discrepancia **no es un error tuyo**. Es un hallazgo: la spec dice una cosa y el producto hace
> otra. Se escriben **las dos versiones** y se cita el REQ. No se elige la que conviene, no se
> corrige el documento para que cierre, y no se decide quién tiene razón. Esa decisión no es de QA.
> **La detección sí.**

**Verificación:** ejecutada por `Gabriela Conde Moreau` el `2026-09-16` con `Postman`.
Casos ejecutados: `5` de 5.


**Registro mínimo de ejecución:** marca cada caso que ejecutes. Si coincide, no copies otra vez la
regla completa; registra el caso, la fecha y el resultado.

| Caso | Fecha | Resultado |
|---|---|---|
| 1 | 2026-09-16 | coincide |
| 2 | 2026-09-16 | coincide |
| 3 | 2026-09-16 | coincide |
| 4 | 2026-09-16 | discrepancia |
| 5 | 2026-09-16 | discrepancia |

| # | Endpoint y dato | Lo que dice el contrato (REQ) | Lo que respondió el producto | Cómo lo verifiqué | Fecha |
|---|---|---|---|---|---|
| 1 | `POST /api/enroll` con `{"courseId":"playwright-cero"}` | `403`, rechazo por prerequisito pendiente — REQ-A03, REQ-C03 y REQ-C06 | `200 OK`; `status: "inscrito"`, `displayStatus: "inscrito"` y mensaje `Inscripción exitosa a "Playwright desde cero"` | Postman | 2026-09-16 |
| 2 | `POST /api/enroll` con `{"courseId":"api-testing"}` | `200` con `status: "lista-espera"` — REQ-A03 y REQ-C02; el badge debe mostrar `Lista de espera`, no `Inscrito` — REQ-C05 | `200 OK`; `status: "lista-espera"`, pero `displayStatus: "inscrito"`; mensaje `Sin cupos para "API Testing con Playwright". Agregado a lista de espera.` | Postman | 2026-09-16 |

**Formato de una fila bien escrita** — es un ejemplo, no es tu hallazgo:

```text
POST /api/<endpoint> con <dato exacto>
  contrato : <status> — REQ-XXX, <frase textual del requerimiento>
  producto : <status> — <fragmento textual del body>
  verificado: curl, 2026-08-XX
```

Las cinco piezas que no pueden faltar: **endpoint exacto · dato exacto · respuesta exacta · fuente
citada con número · fecha.** Ninguna de las cinco es opinión.

---

## 5. Lo que el contrato no define — incógnitas

> También la escribes tú. Y **no es una falla**: es el mapa de los huecos del documento que te dieron.
> Un QA que dice *"esto no está definido"* está haciendo su trabajo.
>
> **Discrepancia** = la spec dice una cosa y el producto hace otra.
> **Incógnita** = la spec no dice nada y tú observaste algo.

-- El contrato exige validar los prerequisitos del estudiante, pero no define si `POST /api/enroll` requiere sesión ni cómo identifica al usuario cuyo progreso debe consultar.
- El contrato no define la respuesta de `POST /api/enroll` cuando se envía sin body. Verificado con Postman el 2026-09-16: respondió `500 Internal Server Error` con body vacío.
- El contrato no define la respuesta de `/api/enroll` ante un método no permitido. Verificado con Postman el 2026-09-16: `GET /api/enroll` respondió `405 Method Not Allowed` con body vacío.
- El contrato no define la respuesta de `POST /api/enroll` ante un body con JSON malformado. Verificado con Postman el 2026-09-16 enviando `{courseId`: respondió `500 Internal Server Error` con body vacío.
- El contrato exige `403` y rechazo por prerequisito pendiente, pero no define el schema ni el texto exacto del body de esa respuesta de error.

Si te cuesta arrancar, estas preguntas suelen destapar algo:

- ¿El documento dice si `/api/enroll` necesita sesión?
- ¿Qué debería responder el endpoint ante un método que no acepta?
- ¿Qué debería responder si el body llega mal formado?
- ¿Qué prometen `/api/auth/me` y `/api/progress`, que existen y no están documentados?

---

## 6. Cómo organizar este contrato con IA

La IA puede localizar y organizar los casos escritos en este contrato. No puede decidir si el
producto cumple mientras no tenga evidencia de una ejecución.

```text
Trabaja únicamente con el contrato que te proporcioné.

Busca los casos documentados para POST /api/enroll y devuelve una tabla con:
- número del caso;
- dato que se envía;
- status esperado;
- texto o estado esperado;
- requerimiento que respalda la respuesta.

No agregues casos que no estén escritos en el contrato.
Si falta un dato, escribe "no definido".
Después de cada fila, cita la sección o el REQ exacto que usaste.
```

**El gate:**

1. Elige una fila de la respuesta.
2. Ubica con tus ojos el REQ citado en este archivo.
3. Si la cita no existe, mezcla casos o completa un dato ausente, marca la salida como **no respaldada**.
4. Ejecuta el caso para obtener evidencia del producto.

**La IA localiza y organiza. La fuente respalda. La ejecución produce evidencia. QA autoriza la
conclusión.**

---

## 7. Gate humano

- [x] Leí el contrato antes de ejecutar: sé qué debía pasar en cada uno de los cinco casos.
- [x] Ejecuté yo, hoy, y sé con qué comando o desde qué pantalla.
- [x] Cada fila de la sección 4 tiene **las dos versiones** y el REQ que la respalda.
- [x] No corregí ninguna línea de las secciones 0 a 3 para que la tabla cerrara.
- [x] La sección 5 no está vacía.
- [x] Ninguna afirmación mía sale de una IA sin que yo haya visto la línea citada.
- [x] No hay tests escritos en este archivo. Eso es C15.

**La prueba de la reunión:** si alguien señala una fila de la sección 4 y pregunta *"¿por qué acá
dice 403?"*, la respuesta tiene que ser *"REQ-A03, sección 1, caso 5; la abro ahora"*. No *"lo puso la
IA"*, no *"me parece"*.

---

## 8. Cuando no te dan contrato: explorar

Va a pasar, y más seguido de lo que te gustaría. No hay documentación, o la hay y quedó vieja. **No
te quedas sin trabajo: cambias de fuente.** El procedimiento es este, y es el mismo en cualquier
producto.

| Paso | Qué haces | Qué produce |
|---|---|---|
| 1 | Abre DevTools → Network → filtro Fetch/XHR y **usa la aplicación como un usuario** | la lista de endpoints que existen de verdad |
| 2 | Anota método, ruta y para qué sirve cada uno | la sección 0 escrita por observación |
| 3 | Ejecuta el camino feliz de cada endpoint y guarda status y body textuales | el comportamiento base |
| 4 | Repite cambiando **un** dato por vez: falta un campo, dato inexistente, método distinto, body roto | los bordes |
| 5 | Escribe cada resultado como **observación con fecha**, nunca como regla | un registro de observaciones |
| 6 | Lleva las preguntas que quedaron abiertas a quien pueda responderlas | las definiciones que faltan |

**La regla que no se puede saltear:** lo que observaste es una **muestra**, no una regla. Que hoy
haya devuelto `400` no significa que la regla sea `400`: significa que hoy devolvió `400`. Por eso
cada línea lleva fecha, y por eso lo que sale de acá se escribe como observación, no como promesa.

**Y el aporte más valioso de esta situación es el paso 6.** En un equipo sin documentación, tu lista
de preguntas abiertas suele ser el primer documento que alguien escribió sobre cómo funciona el
producto.

---

## 9. Adónde va este archivo

- **C7** lo lee para decidir qué vale la pena automatizar. Las filas de la sección 4 son candidatas
  fuertes: ya tienen endpoint, dato y resultado esperado.
- **C15** lo abre para escribir los tests de API: cada caso con fuente se convierte en un test.
- **C16** se lo entrega a un agente que genera tests de API. El agente **no puede inventar
  endpoints**: solo conoce los que están acá.
- Un caso que hoy no tiene fuente es un test que en C15 no vas a poder escribir. Y decirlo también es
  una respuesta profesional: *"no puedo verificar esto porque el contrato no lo define"*.

## 10. Candidatos a probar — lista cruda

> Escrita por QA. Lista sin ordenar y sin priorizar: se ordena en S7.

- Verificar que `POST /api/enroll` con `{"courseId":"api-testing"}` devuelva `status: "lista-espera"` y muestre `displayStatus: "Lista de espera"` según REQ-C05.
- Verificar qué responde `POST /api/enroll` cuando `courseId` se envía como número en lugar de texto; el contrato no define este tipo de dato.
- Verificar que un login con credenciales válidas muestre el mensaje de bienvenida con el nombre del usuario según REQ-L04.
- Verificar que `GET /api/enroll` sea rechazado como método no permitido y no produzca cambios en las inscripciones.
- Verificar que `POST /api/enroll` con `{"courseId":"fundamentos"}` responda `200`, inscriba al estudiante y reduzca los cupos disponibles según REQ-C04.
- Verificar qué devuelve `GET /api/auth/me` con y sin una sesión activa; el endpoint existe pero no está documentado.
- Verificar que `POST /api/enroll` con JSON malformado responda con un error de cliente controlado y no con `500 Internal Server Error`.
- Verificar que `POST /api/enroll` con `{"courseId":"playwright-cero"}` rechace la inscripción cuando el estudiante no completó `Fundamentos de Testing`, según REQ-A03, REQ-C03 y REQ-C06.
- Verificar que `POST /api/enroll` con body `{}` responda `400` y el error `El campo courseId es obligatorio`.
- Verificar el contenido de `GET /api/courses` y que cada curso incluya los campos declarados en la sección 3 y REQ-C01.
- Verificar la respuesta de `POST /api/enroll` cuando la request no contiene body; el 2026-09-16 respondió `500` con body vacío.
- Verificar que cinco intentos consecutivos de login con contraseña incorrecta bloqueen la cuenta durante 30 segundos según REQ-L03.
- Verificar que `POST /api/enroll` con un `courseId` inexistente responda `404` y `Curso no encontrado`.
- Verificar que el status y el body sean coherentes cuando una inscripción se rechaza por prerequisito pendiente.
- Verificar qué devuelve `GET /api/progress` para un usuario con y sin inscripciones; el endpoint existe pero su contrato no está documentado.