---
description: Juzga un archivo de casos de prueba con la skill revisar-con-rubrica, deja la revisión escrita y registra las decisiones de la QA. La única parte humana es decidir.
---

# Workflow — generar y juzgar

> **Qué es esto.** Pasos fijos, en orden, que corren solos de punta a punta. La persona entra en **un
> solo punto**: decidir qué se hace con cada hallazgo. Todo lo mecánico —preparar lo que ve el juez,
> juzgar, dejarlo escrito, registrar— lo hace el workflow.
>
> **Cómo se corre.** Un solo pedido:
>
> ```text
> Corre el workflow generar-y-juzgar sobre docs/casos-login-v2.md
> ```

---

## Los pasos

| #   | Paso                  | Quién           | Qué deja                                                                     |
| --- | --------------------- | --------------- | ---------------------------------------------------------------------------- |
| 1   | **Preparar**          | automático      | lo que el juez va a ver, y nada más                                          |
| 2   | **Juzgar**            | automático      | puntajes, hallazgos, «QUÉ FALTA» y lo que no pudo evaluar                    |
| 3   | **Dejarlo escrito**   | automático      | `docs/revision-<funcionalidad>.md`, con cada decisión en `PENDIENTE`         |
| 4   | **Decidir**           | **QA**          | una decisión con su razón por cada hallazgo y cada viñeta de «QUÉ FALTA»     |
| 5   | **Registrar**         | automático      | las decisiones escritas en la revisión, y los casos nuevos que la QA aprobó  |

Los casos ya existen: los generó la skill `derivar-casos-de-hu` y la QA los aprobó. Este workflow
no los genera de nuevo: **juzga lo que ya hay**.

---

## Paso 1 · Preparar (automático)

1. Lee el archivo de casos que te indicaron.
2. Toma la fuente de su encabezado, en la línea **Historia** (por ejemplo, `docs/HU-login.md`).
3. Para el juez, toma **solo** dos secciones del archivo de casos: **Preguntas abiertas** y **Casos**.

**No le pases al juez** ninguna otra sección: contexto, reglas, riesgos, cobertura, criterio de
terminado. Son el análisis de quien escribió los casos. Si el juez las recibe, revisa los casos
contra esa lectura, y como los casos salieron de ella, van a coincidir siempre. Con la historia
sola, revisa contra la fuente.

## Paso 2 · Juzgar (automático)

Usa la skill `revisar-con-rubrica` con:

- **Tipo de artefacto:** casos de prueba.
- **Artefacto:** las dos secciones del paso 1.
- **Fuente:** la historia del paso 1.
- **Reglas:** `.agents/rules/criterio-qa.md`.

Cada cita de «QUÉ FALTA» tiene que aparecer literal en la historia. Si no se puede citar, esa viñeta
no va.

## Paso 3 · Dejarlo escrito (automático)

Crea `docs/revision-<funcionalidad>.md` (por ejemplo, `docs/revision-login.md`) con:

1. El encabezado: archivo juzgado, fuente, fecha.
2. La salida completa del juez: puntajes, hallazgos, «QUÉ FALTA» y lo que no pudo evaluar.
3. La tabla de decisiones, con **una fila por hallazgo y una por cada viñeta de «QUÉ FALTA»**:

| #   | Qué señaló el juez | Decisión    | Razón |
| --- | ------------------ | ----------- | ----- |
| H01 | …                  | `PENDIENTE` |       |
| F1  | … (viñeta 1)       | `PENDIENTE` |       |

**No modifiques el archivo de casos.** Después, **detente** y muestra la tabla en el chat. Pide a la
QA sus decisiones.

## Paso 4 · Decidir (QA) — el único paso humano

La QA dice en el chat qué hace con cada fila. Tres decisiones posibles, y todas llevan razón:

| Decisión                  | Cuándo                                        | La razón dice               |
| ------------------------- | --------------------------------------------- | --------------------------- |
| `ACEPTO Y CORRIJO`        | tiene razón y se arregla ahora                | qué se cambia               |
| `ACEPTO Y NO CORRIJO HOY` | tiene razón, pero depende de algo             | qué lo destraba             |
| `RECHAZO`                 | no aplica                                     | por qué no aplica           |

Por ejemplo: *«F1, acepto y corrijo. H03, rechazo: <por qué no aplica, con la evidencia que
abriste>»*. Antes de decidir una fila, abre su evidencia: el caso o la frase de la historia que cita.

**Al menos un `RECHAZO`.** Si la QA acepta todo, el juez dejó de ser un juez y pasó a ser el que
decide.

## Paso 5 · Registrar (automático)

1. Escribe cada decisión y su razón en la tabla de `docs/revision-<funcionalidad>.md`.
2. Por cada `ACEPTO Y CORRIJO` que pida un caso nuevo, **propón** el caso en el chat, con el mismo
   formato de la tabla de casos, el número siguiente al último y su fragmento literal de la historia.
   **Agrégalo al archivo de casos solo si la QA lo aprueba.**
3. Por cada `ACEPTO Y NO CORRIJO HOY` que dependa de una respuesta, **propón** la pregunta nueva para
   la sección de preguntas abiertas. También se agrega solo si la QA la aprueba.

---

## Condición de parada

Termina cuando **no queda ninguna fila en `PENDIENTE`**. No antes.

No vuelve a juzgar por su cuenta. Un ciclo que se repite hasta que el juez no encuentra nada no
produce calidad: produce una salida que aprendió a no tener observaciones.

## Qué NO hace

- **No aprueba.** Ningún paso escribe que los casos están listos.
- **No decide.** El paso 4 no tiene versión automática.
- **No escribe casos sin permiso.** Propone; la QA aprueba.
- **No prueba el producto.** Revisa los casos. Si el login funciona, lo dice ejecutar, y eso
  empieza en C10.

> **Honestidad.** Los pasos corren en la misma conversación. Lo que protege al juez es el paso 1:
> solo recibe la historia, las preguntas, los casos y las reglas del repositorio. Es lo que está a nuestro alcance, y se nota en
> la salida.

---

*Workflow de `qa-automation-portfolio`. Nace en C9. Usa `revisar-con-rubrica`. Desde C10 se usa
igual, cambiando el artefacto: en vez de casos de prueba, el test de Playwright recién escrito.*
