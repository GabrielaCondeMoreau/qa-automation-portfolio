# Revisión — Casos de prueba · Login (v2)

| | |
| --- | --- |
| **Archivo juzgado** | `docs/casos-login-v2.md` — solo §3 Preguntas abiertas (P1–P8) y §5 Casos (C01–C13) |
| **Fuente** | `docs/HU-login.md` — Historia, criterios CA1–CA4 (REQ-L01 a REQ-L04) y Notas del equipo |
| **Reglas aplicadas** | `.agents/rules/criterio-qa.md` |
| **Juez** | skill `revisar-con-rubrica` · workflow `generar-y-juzgar` |
| **Fecha** | 2026-10-06 |

> Las secciones §1 Contexto, §2 Reglas, §4 Riesgos, §6 Cobertura y §7 Criterio de terminado **no se
> pasaron al juez** (paso 1 del workflow): son el análisis de quien escribió los casos.

---

## 1. PUNTAJES

| Dimensión | Puntaje | En qué se apoya |
| --- | --- | --- |
| **D1 · Trazabilidad** | 3 | Las 13 piezas (C01–C13) y las 8 preguntas (P1–P8) citan CA, REQ y fragmento; los fragmentos citados aparecen literales en `docs/HU-login.md`. P8 declara `SIN FRAGMENTO` con su origen en lugar de forzar una cita. |
| **D2 · Cobertura** | 2 | CA1 (C04–C06), CA2 (C02–C03), CA3 (C07–C12) y CA4 (C01, C13) tienen pieza, con negativos y bordes (C08 = 4 intentos, C07 = 5, C11 = timer 0). Pero dos promesas de CA3 no tienen ninguna pieza que las verifique: la duración de 30 segundos y el carácter «consecutivo» del conteo → H06, H07 y QUÉ FALTA. |
| **D3 · Claridad ejecutable** | 2 | Datos concretos en las 13 piezas. En C04, C05, C06 y C11 el resultado esperado admite dos comportamientos posibles y queda a interpretación de quien ejecuta → H01, H02, H03, H04. |
| **D4 · Honestidad sobre lo no verificable** | 2 | Las marcas `POR CONFIRMAR → P1/P3/P4` y P8 `SIN FRAGMENTO` son coherentes con la nota «La documentación no fija el texto de ningún mensaje de la pantalla de login.». Pero las alternativas «o» de C04, C05 y C11 no están declaradas ni apuntan a ninguna pregunta abierta → H04, H05. |
| **TOTAL** | **9 / 12** | El total ordena la conversación; no aprueba nada. |

---

## 2. HALLAZGOS

| # | Pieza citada | Dimensión | Qué encontré | Por qué importa |
| --- | --- | --- | --- | --- |
| H01 | C04 | D3 | El resultado esperado admite dos comportamientos distintos: «Se impide el envío o se muestra un mensaje de error indicando que el email es obligatorio». | Dos ejecutoras pueden observar comportamientos opuestos y ambas dan por bueno el caso; no se puede escribir una aserción única ni fallar si el producto hace lo contrario de lo esperado. |
| H02 | C05 | D3 | Ídem para contraseña vacía: «Se impide el envío o se muestra un mensaje de error indicando que la contraseña es obligatoria». | Mismo problema que H01: el resultado queda a interpretación. |
| H03 | C06 | D3 | El resultado admite «Se impide el envío o se muestran mensajes de error para ambos campos». P1 declara la duda, pero el caso en sí no fija qué se observa. | El caso más borde de CA1 (campos vacíos) es el que menos se puede ejecutar sin preguntar. |
| H04 | C11 | D3 · D4 | «El timer desaparece o muestra 0» son dos resultados posibles, sin `POR CONFIRMAR` ni pregunta abierta que los cubra. | En el borde exacto del fin del bloqueo (timer = 0) la aserción depende de quien ejecute, y la duda no está registrada en ninguna parte. |
| H05 | C04, C05 | D4 | La alternativa de comportamiento (impide envío vs. muestra error) no está declarada como `POR CONFIRMAR` ni apunta a una pregunta abierta: P3 solo cubre el **texto** del mensaje. | Rompe el criterio de terminado del propio archivo («Cada `POR CONFIRMAR` apunta a una pregunta de la lista (P1, P3, P4)»): queda una ambigüedad fuera de la lista. |
| H06 | C07, C10, C11 | D2 | Ninguna pieza fija la duración de 30 segundos: C10 no afirma el valor inicial del timer y C11 solo espera a que el timer llegue a 0. Un bloqueo de 20 s con un timer de 20 s haría pasar a C07–C12 sin que nada falle. | CA3 promete «la cuenta se bloquea por 30 segundos» y el conjunto no lo verifica. |
| H07 | C07–C12 | D2 | Ninguna pieza cubre el carácter «consecutivo»: el conjunto solo tiene fallos seguidos; ningún caso intercala un intento exitoso entre los fallos. | Si un éxito no resetea el contador, el conjunto lo daría por bueno y el rate limiting real sería otro. |


---

## 3. QUÉ FALTA — cobertura · 3 viñetas

> Hay 3 huecos rastreables hasta la historia: el piso de lo que se busca. Citar un cuarto obligaría a
> inventar un requisito que la fuente no dice.

- Ninguna pieza fija la duración del bloqueo: el conjunto pasaría con un timer de 20 segundos · sale de CA3 · «después de 5 intentos fallidos consecutivos, la cuenta se bloquea por 30 segundos.»
- Ninguna pieza cubre el carácter consecutivo del conteo: no hay un intento exitoso intercalado entre los fallos · sale de CA3 · «5 intentos fallidos consecutivos»
- Ninguna pieza comprueba que el login da acceso efectivo a las páginas que requieren sesión · sale de Nota del equipo · «las páginas `/cursos` y `/mi-progreso` requieren sesión (REQ-S01).»

---

## 4. LO QUE NO PUDE EVALUAR

- **Los textos exactos de error y de bienvenida** (`POR CONFIRMAR` → P3, P4): la fuente dice «La documentación no fija el texto de ningún mensaje de la pantalla de login.», así que no hay texto contra el cual juzgarlos hasta que se confirme o se ejecute.
- **Las secciones §1, §2, §4, §6 y §7 del archivo de casos**: el paso 1 del workflow prohibe pasarlas al juez; revisarlas sería revisar los casos contra el análisis de quien los escribió, no contra la historia.
- **La columna Riesgo (R1–R5)**: los riesgos no están en la fuente entregada; sus niveles `SIN CONTEXTO` dependen de datos del equipo que `HU-login.md` no trae.
- **Si la cuenta de prueba funciona y si existe redirect post-login**: la nota publica la cuenta («La pantalla publica una cuenta de prueba…») y P8 marca `SIN FRAGMENTO`, pero verificar ambos requiere ejecutar el producto, no leer la fuente.

---

## 5. Tabla de decisiones

> Una fila por hallazgo y una por cada viñeta de «QUÉ FALTA». **Decisión y razón las firma la QA**
> (regla §2 de `criterio-qa.md`): registradas en el paso 4 el 2026-10-06. No queda ninguna fila en
> `PENDIENTE`.

| # | Qué señaló el juez | Decisión | Razón |
| --- | --- | --- | --- |
| H01 | C04 · D3 — resultado admite «se impide el envío o se muestra un mensaje de error» | `ACEPTO Y NO CORRIJO HOY` | C04 contiene resultados alternativos y no define una única señal observable. CA1 establece que el email es obligatorio, pero no especifica si el envío se bloquea, si aparece un mensaje o si deben ocurrir ambas cosas. La corrección depende de que el equipo confirme el comportamiento. |
| H02 | C05 · D3 — misma alternativa de resultado que H01, con la contraseña vacía | `ACEPTO Y NO CORRIJO HOY` | C05 presenta dos resultados alternativos. CA1 establece que la contraseña es obligatoria, pero no especifica si el envío se bloquea, si aparece un mensaje o si deben ocurrir ambas cosas. La corrección depende de que el equipo confirme el comportamiento. |
| H03 | C06 · D3 — «se impide el envío o se muestran mensajes para ambos campos» sin fijar qué se observa | `ACEPTO Y NO CORRIJO HOY` | C06 contiene resultados alternativos y no define una única señal observable. CA1 establece que ambos campos son obligatorios, pero no determina si se bloquea el envío, si aparecen mensajes para ambos campos o si ocurren ambas cosas. El comportamiento exacto depende de resolver P1. |
| H04 | C11 · D3·D4 — «el timer desaparece o muestra 0» sin `POR CONFIRMAR` ni pregunta que lo cubra | `ACEPTO Y CORRIJO` | La fuente define que el botón se habilita exactamente cuando el timer llega a 0, pero no define si después el timer desaparece o permanece mostrando 0. Se debe eliminar de C11 la frase “El timer desaparece o muestra 0”. |
| H05 | C04, C05 · D4 — la alternativa de comportamiento no está declarada ni ligada a ninguna pregunta abierta | `ACEPTO Y CORRIJO` | C04 y C05 remiten a P3, pero P3 solo pregunta por el texto del mensaje de credenciales inválidas y no define el comportamiento de los campos obligatorios vacíos. Propón una pregunta abierta específica y enlaza ambos casos a ella, pero no la agregues sin mi aprobación. |
| H06 | C07, C10, C11 · D2 — ninguna pieza fija la duración de 30 segundos del bloqueo | `ACEPTO Y CORRIJO` | Esperar 30 segundos antes de comprobar el estado final no detectaría una habilitación anticipada. Propón un caso que compruebe que el botón permanece deshabilitado mientras el timer es mayor que 0 y se habilita al llegar a 0, pero no lo agregues sin mi aprobación. |
| H07 | C07–C12 · D2 — ninguna pieza cubre el carácter «consecutivo» del conteo de intentos | `ACEPTO Y NO CORRIJO HOY` | Los casos no comprueban qué sucede cuando un login exitoso interrumpe los intentos fallidos. El resultado esperado depende de resolver P6 y confirmar si el éxito reinicia el contador. |
| F1 | QUÉ FALTA — duración de 30 s sin ninguna pieza que la verifique · CA3 · «la cuenta se bloquea por 30 segundos.» | `ACEPTO Y CORRIJO` | Falta comprobar que el bloqueo dure los 30 segundos completos. La misma corrección propuesta para H06 debe cubrir F1; no generes dos casos duplicados. |
| F2 | QUÉ FALTA — «consecutivo» sin pieza que intercale un intento exitoso · CA3 · «5 intentos fallidos consecutivos» | `ACEPTO Y NO CORRIJO HOY` | No se comprueba el carácter consecutivo porque ningún caso intercala un login exitoso. El resultado depende de resolver P6. |
| F3 | QUÉ FALTA — acceso a las páginas que requieren sesión sin pieza · Nota del equipo · «las páginas `/cursos` y `/mi-progreso` requieren sesión (REQ-S01).» | `RECHAZO` | REQ-S01 es una regla válida, pero no pertenece a los criterios CA1–CA4 de HU-LOG-01. Su verificación corresponde a una historia o conjunto de casos sobre sesión y autorización; no constituye un faltante de cobertura de estos casos de login. |

---

---

## 6. Propuestas del paso 5 — pendientes de aprobación

Presentadas en el chat a la QA. **No se incorporaron a `docs/casos-login-v2.md`**: se agregan solo con
aprobación explícita. El juez no se re-ejecutó.

- **Propuesta 1 — corrección de C11** (H04): eliminar del resultado esperado la frase «El timer desaparece o muestra 0.».
- **Propuesta 2 — pregunta abierta P9** (H05): comportamiento y texto cuando solo un campo está vacío; al aprobarla, reenlazar C04 y C05 de P3 a P9.
- **Propuesta 3 — caso C14** (H06 · F1): un único caso que compruebe que el botón permanece deshabilitado mientras el timer es mayor que 0, que se habilita exactamente al llegar a 0 y que el bloqueo dura los 30 segundos completos.

---

*Workflow `generar-y-juzgar` · pasos 1–5 ejecutados el 2026-10-06 · decisiones de la QA registradas
en el paso 4 · juez `revisar-con-rubrica` ejecutado una sola vez (no re-ejecutado) · archivo de casos
sin modificar · propuestas del paso 5 pendientes de aprobación explícita.*

---

## El caso de C10

- **Caso elegido:** C01 — Login exitoso con credenciales válidas.
- **Por qué va primero:** el login válido es la puerta de entrada al sistema; si falla, la persona no puede acceder a su cuenta ni continuar con las funcionalidades autenticadas. Además, es el candidato L1 priorizado en el backlog.
- **Datos:** email `ana.garcia@ejemplo.com` y contraseña `Segura2026!`.
- **Qué tiene que verse para decir que pasó:**
  - `¡Hola, Ana!`
  - `Has iniciado sesión correctamente.`
- **De dónde sale:**
  - La historia HU-LOG-01, CA4 y REQ-L04 exigen «un mensaje de bienvenida con el nombre del usuario».
  - El texto exacto no está definido por la historia y continúa `POR CONFIRMAR` en P4.
  - Evidencia observada manualmente en pantalla el 2026-10-06: `¡Hola, Ana!` y `Has iniciado sesión correctamente.`
- **Qué NO demuestra este test:** no demuestra el rechazo de credenciales inválidas, la obligatoriedad de los campos, el bloqueo después de cinco intentos, la duración del bloqueo ni el acceso a páginas protegidas. Tampoco demuestra que el texto exacto observado sea un requerimiento contractual.