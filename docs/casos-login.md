# Casos de prueba — Login · Academia sin Humo

**Sistema bajo prueba:** `https://playground.calidadsinhumo.com/login`
**Historia:** `docs/HU-login.md` (HU-LOG-01, criterios CA1 a CA4)
**Especificación:** `https://playground.calidadsinhumo.com/documentacion`, sección 2
**Fecha:** 2026-10-04
**Responsable:** Gabriela Conde Moreau

> **Qué es este archivo y de dónde salió.** Es el resultado de las cinco capas de ATERRIZA que se
> corrieron en C8, en pantalla, con la IA: **un pedido por capa** y, después de cada salida, **el gate
> del grupo** —la revisión contra la historia, en voz alta, antes de avanzar—. Lo que quedó escrito acá
> es la versión **corregida en el gate**, no la que devolvió la IA.
>
> Llega hecho a tu repositorio para que tengas el resultado completo y auditable. **Lo que no llega
> hecho es el procedimiento:** los cinco pedidos están en `Materiales-S8.md`, sección *El encuadre y
> los cinco pedidos*, y son de donde sale tu skill.
>
> **Tu firma falta.** Pon fecha y tu nombre arriba cuando hayas pasado el gate de salida (abajo del
> todo).
>
> **Qué sobrevive en un equipo real.** Las **preguntas** (sección 3) van al refinamiento o al ticket.
> Los **casos** (sección 5) van a donde tu equipo guarde los casos: Jira, Xray, TestRail, una planilla.
> Las secciones 1, 2 y 4 son **banco de trabajo**: sostienen lo otro. El día que te salgan solas,
> sobran; de eso se encarga la skill.
>
> **La regla que sostiene el archivo** (`.agents/rules/criterio-qa.md`, sección 5): **un caso sin
> fuente no es un caso.** Cada caso cita el criterio, el requerimiento y el fragmento textual de la
> historia del que sale.

---

## 1. Contexto · A

- **Objetivo:** que una estudiante registrada entre a su cuenta para seguir sus cursos.
- **Quién lo usa:** estudiante registrada.
- **Camino feliz:** abre `/login` → escribe email y contraseña → pulsa el botón de login → aparece un
  mensaje de bienvenida con su nombre.
- **Qué entra:** email y contraseña.
- **Qué sale:** un mensaje de bienvenida con el nombre · o un mensaje de error · o un bloqueo de 30
  segundos con timer.

> **Gate A** *(el que se aplicó en clase)*. ¿Hay algo en estas cinco líneas que no esté en la historia?
> Trampa típica: *«y la lleva a Mis cursos»*. La historia **no dice adónde va**: dice que aparece un
> mensaje de bienvenida. Lo que no está respaldado se borra o se escribe `POR CONFIRMAR`.

---

## 2. Reglas · T

| RG | Regla — una sola condición que se puede comprobar | Sale de |
|---|---|---|
| RG1 | Sin email, no se inicia sesión. | CA1 |
| RG2 | Sin contraseña, no se inicia sesión. | CA1 |
| RG3 | Con un email no registrado, aparece un mensaje de error. | CA2 |
| RG4 | Con un email registrado y una contraseña incorrecta, aparece un mensaje de error. | CA2 |
| RG5 | Con credenciales inválidas, no se inicia sesión. | CA2 `(implícita)` |
| RG6 | Después de 5 intentos fallidos consecutivos, la cuenta se bloquea por 30 segundos. | CA3 |
| RG7 | Durante el bloqueo, el botón de login está deshabilitado. | CA3 |
| RG8 | Durante el bloqueo, un timer visual muestra los segundos restantes. | CA3 |
| RG9 | El botón se habilita exactamente cuando el timer llega a 0. | CA3 |
| RG10 | Tras un login exitoso, aparece un mensaje de bienvenida con el nombre del usuario. | CA4 |

Diez reglas: dos de CA1, tres de CA2 (una implícita), cuatro de CA3, una de CA4.

> **Gate T** *(el que se aplicó en clase)*. Una condición por línea · cada regla dice de qué criterio
> sale y las deducidas están marcadas `(implícita)` · **¿falta alguna condición?**, que no se contesta
> mirando la tabla sino **volviendo a los cuatro criterios**, uno por uno.
>
> **Modo de fallar:** un criterio con dos condiciones escondidas da un caso que prueba una y se da por
> bueno para las dos. **El número no es el gate; la cobertura sí.**

---

## 3. Preguntas abiertas · E

| P | Pregunta | Fragmento que la origina | Qué deja sin resolver |
|---|---|---|---|
| P1 | ¿«El nombre del usuario» es el nombre de pila o el completo? La cuenta de prueba se llama Ana García. | «con el nombre del usuario» | el texto exacto del caso 1 |
| P2 | ¿Qué dice el mensaje de error? ¿Es el mismo para un email no registrado y para una contraseña incorrecta? | «muestran un mensaje de error» | el texto de los casos 2 y 3; y si hace falta un caso de seguridad (ver riesgos) |
| P3 | Si dejo un campo vacío, ¿qué veo: un mensaje, el botón deshabilitado o el aviso del navegador? | «Ambos son obligatorios» | qué se observa en los casos 7 y 8 |
| P4 | ¿Un login exitoso en medio de los fallos reinicia el contador? ¿Los intentos se cuentan por email o por navegador? | «5 intentos fallidos consecutivos» | cómo se preparan los casos 4, 5 y 6 |
| P5 | Si los cinco intentos son con un email que no existe, ¿qué cuenta se bloquea? | «la cuenta se bloquea» | **ningún caso posible** hasta que se conteste |
| P6 | ¿Existe un mecanismo autorizado para resetear el bloqueo de la cuenta de prueba y volver a ejecutar los casos 4, 5 y 6 sin esperar? | `SIN FRAGMENTO` — dato del entorno y del equipo | cómo preparar y repetir de manera independiente los casos de bloqueo |

> **Gate E** *(el que se aplicó en clase)*. Cada pregunta cita su fragmento · se contesta con un dato,
> no con «depende» · si se contesta leyendo la historia, no era una pregunta.
>
> **Y la parte que no se delega:** la pregunta que la IA **no podía** hacer, porque depende de tu
> equipo y de tu producto. **Este es tu lugar:** si en tu trabajo el nombre del usuario viene de otro
> sistema, si producto ya contestó algo parecido, si esta pantalla está por rehacerse — agrégala acá
> abajo como P6, con su fragmento.
>
> **P5 es la regla común en acción:** sin resultado esperado no hay caso; queda como pregunta.

---

## 4. Riesgos · R

| R | Qué podría salir mal | Por qué duele | Nivel |
|---|---|---|---|
| R1 | El login válido no entra | sin sesión nadie llega a `/cursos` ni a `/mi-progreso` (notas del equipo) | ALTO |
| R2 | Con credenciales inválidas se entra igual | cualquiera entra a una cuenta ajena | ALTO |
| R3 | El bloqueo no se activa | se pueden probar contraseñas sin límite | ALTO |
| R4 | El botón se habilita antes de que termine el bloqueo | el bloqueo dura menos de lo prometido y nadie lo ve | MEDIO |
| R5 | Un campo vacío deja enviar el formulario | confunde a la persona; no expone datos | BAJO |

> **Gate R** *(el que se aplicó en clase)*. Cada `ALTO` dice por qué, con un daño concreto: *«podría
> fallar»* no es un porqué. Y **el nivel es criterio tuyo, no de la IA**: si lo subes o lo bajas,
> escribe tu razón. Esa razón es lo que defiendes en una reunión, no el nivel.
>
> **Riesgo sin fuente:** que el mensaje de error sea distinto según el email exista (permite averiguar
> qué emails están registrados). Es un riesgo real, pero la historia no lo dice: **no es caso**. Ya
> está como segunda mitad de P2. El día que producto conteste, se convierte en caso, con fuente.

---

## 5. Casos · R

> Numerados por riesgo: el primero es el que más duele si falla. **Los números no se reordenan
> después**, porque en C9 se citan por número.

| # | Caso | Datos | Resultado esperado | Fuente · CA · REQ · «fragmento» | Técnica | Riesgo |
|---|---|---|---|---|---|---|
| 1 | Login con credenciales válidas | `ana.garcia@ejemplo.com` / `Segura2026!` (cuenta de prueba, notas del equipo) | aparece un mensaje de bienvenida con el nombre del usuario · qué nombre: `POR CONFIRMAR (P1)` | CA4 · REQ-L04 · «muestra un mensaje de bienvenida con el nombre del usuario» | partición · válida | R1 |
| 2 | Contraseña incorrecta | `ana.garcia@ejemplo.com` / una contraseña que no es la suya | aparece un mensaje de error · texto: `POR CONFIRMAR (P2)` · no se inicia sesión (RG5, implícita) | CA2 · REQ-L02 · «una contraseña incorrecta muestran un mensaje de error» | partición · inválida | R2 |
| 3 | Email no registrado | un email que nadie registró, por ejemplo `noexiste@ejemplo.com` / `Segura2026!` | aparece un mensaje de error · texto: `POR CONFIRMAR (P2)` · no se inicia sesión (RG5, implícita) | CA2 · REQ-L02 · «Un email no registrado» | partición · inválida | R2 |
| 4 | Quinto intento fallido seguido | `ana.garcia@ejemplo.com` + contraseña incorrecta, 5 veces seguidas | el botón de login queda deshabilitado y un timer visual muestra los segundos restantes | CA3 · REQ-L03 · «después de 5 intentos fallidos consecutivos» · «el botón de login debe estar deshabilitado» · «un timer visual muestra los segundos restantes» | valor límite · 5 | R3 |
| 5 | Cuarto intento fallido seguido | igual que el caso 4, 4 veces seguidas | la cuenta no se bloquea: el botón sigue habilitado | CA3 · REQ-L03 · «después de 5 intentos fallidos consecutivos» | valor límite · 5 − 1 | R3 |
| 6 | Fin del bloqueo | después del caso 4, mirar el timer hasta 0 | mientras el timer muestra segundos, el botón sigue deshabilitado; se habilita exactamente cuando llega a 0 | CA3 · REQ-L03 · «el botón de login debe estar deshabilitado» · «el botón se habilita exactamente cuando el timer llega a 0» | valor límite · 0 | R4 |
| 7 | Email vacío | email vacío / `Segura2026!` | no se inicia sesión · qué se ve: `POR CONFIRMAR (P3)` | CA1 · REQ-L01 · «Ambos son obligatorios» | partición · inválida | R5 |
| 8 | Contraseña vacía | `ana.garcia@ejemplo.com` / contraseña vacía | no se inicia sesión · qué se ve: `POR CONFIRMAR (P3)` | CA1 · REQ-L01 · «Ambos son obligatorios» | partición · inválida | R5 |

**Cobertura:** RG1 → 7 · RG2 → 8 · RG3 → 3 · RG4 → 2 · RG5 → 2, 3 · RG6 → 4, 5 · RG7 → 4, 6 · RG8 → 4 ·
RG9 → 6 · RG10 → 1.

> **Gate de los casos** *(las tres comprobaciones que se hicieron en clase, y que puedes repetir en
> diez segundos por caso)*.
>
> 1. **Cada fragmento aparece literal** en `docs/HU-login.md`. Compruébalo con la búsqueda del editor:
>    menú **Edit → Find** (o Editar → Buscar) *(en Mac, Cmd+F; en Windows, Ctrl+F)*. Si no aparece
>    literal, dos opciones y ninguna es borrar el caso: o la cita está parafraseada y se corrige con la
>    frase real, o el caso **no sale de la historia** y vuelve a la sección 3 como pregunta abierta.
> 2. **Ningún esperado inventa un texto.** Aunque sepas qué mensaje muestra hoy la pantalla: eso es una
>    observación, no la fuente. Va `POR CONFIRMAR (P…)`.
> 3. **Cobertura:** cada regla de la sección 2 tiene al menos un caso.

---

## 6. Adónde va este archivo

- **C9:** un juez revisa estos casos contra una rúbrica escrita. Tú decides qué hacer con cada
  hallazgo.
- **C10:** uno de estos casos se convierte en el primer test de Playwright del repositorio.

---

## Gate de salida — fírmalo tú

- [[x] ] Busqué **al menos tres fragmentos** de la sección 5 en `docs/HU-login.md` y aparecen literales.
- [[x] ] Entiendo por qué el caso 1 dice `POR CONFIRMAR (P1)` en vez del nombre que muestra la pantalla.
- [[x] ] Entiendo por qué **no hay un caso para P5**.
- [[x] ] Agregué **mi** pregunta —la que la IA no podía hacer— a la sección 3, o sé que no tengo ninguna.
- [[x] ] Puse **fecha y nombre** arriba.

*Producido en C8 dirigiendo a la IA capa por capa y auditado en el gate de cada capa ·
qa-automation-portfolio · Ruta QA Automation con IA*
