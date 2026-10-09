---
name: diagnosticar-fallo-playwright
description: Lee un rojo o un verde sospechoso de un test de Playwright, nombra la causa con la línea de la salida que la prueba y propone el cambio mínimo. No arregla hasta verde, no agrega esperas fijas y no decide si el producto está bien.
---

# Diagnosticar un fallo de Playwright

> Los seis campos de siempre: cuándo se usa · entrada · pasos · límites · cuándo pide decisión
> humana · salida y criterio de terminado.
>
> **Qué guarda este archivo.** El procedimiento que se ejecutó a mano en C10 y en C11 sobre
> `tests/e2e/login.spec.ts`: cuatro formas de leer lo que devuelve el runner y qué se revisa en
> cada una. **La regla que lo sostiene:** primero la causa, después el cambio. Un test que se pone
> verde sin que nadie sepa por qué no está arreglado: está tapado.

---

## 1. Cuándo se usa

| Situación | Ejemplo |
|---|---|
| Un test se puso **rojo** | el runner devuelve `1 failed` |
| Un test es rojo **a veces** y verde otras, sin que nadie haya cambiado nada | el mismo archivo, tres corridas, resultados distintos |
| Un test da **verde** y hay motivo para sospechar | un caso negativo nuevo, una aserción recién agregada, un test que nadie vio fallar |
| Alguien propone un **arreglo** —una persona, un tutorial o una IA— | antes de aceptarlo |

**Cuándo NO se usa:** para escribir un test nuevo, para decidir qué se automatiza
(`priorizar-automatizacion`), para revisar la calidad de un test terminado (`revisar-con-rubrica`)
ni para decidir si el producto se comporta como el negocio quiere. **Esta skill explica por qué un
test dio lo que dio; no dice si el producto está bien.**

---

## 2. Entrada

| # | Qué | Obligatoria |
|---|---|---|
| 1 | El **archivo del test**, completo | Sí |
| 2 | La **salida completa del runner** para ese test: desde la línea `Error:` hasta el final del bloque, con los números de línea | Sí, si es un rojo |
| 3 | **Qué tenía que pasar**, según la fuente: el caso, el REQ o la fila del backlog | Sí |
| 4 | `.agents/rules/criterio-qa.md`, sección 6 | Sí |

Sin la salida del runner no se diagnostica un rojo: **se pide**. Adivinar la causa leyendo solo el
código es exactamente lo que esta skill existe para evitar.

---

## 3. Pasos

1. **Reproducir una vez.** Correr solo ese test:

   ```bash
   npx playwright test tests/e2e/<archivo>.spec.ts -g "<un pedazo del título, sin signos>"
   ```

   Si el resultado cambia entre corridas, correrlo **tres veces** y anotar las tres. Un test que
   cambia de resultado sin que cambie nada es un **test flaky**, y eso ya es un dato.

2. **Leer la salida y ubicarla en una de estas cuatro lecturas:**

   | # | Lo que dice la salida | Qué pasó | Qué se revisa |
   |---|---|---|---|
   | 1 | `expect(locator)…` con `Locator:`, `Expected:` **y** `Received:` | el elemento apareció y dice otra cosa | **el producto o la expectativa**: se compara `Expected` con la fuente |
   | 2 | `expect(locator)…` con `Expected:` y `element(s) not found`, **sin** `Received:` | el elemento no apareció en todo el tiempo de espera | **el locator** contra `docs/mapa-selectores.md`, **o el paso anterior**, que quizás nunca llegó |
   | 3 | `expect(received)…` con `Expected:` y `Received:`, **sin** línea `Locator:` ni `Timeout:` | la aserción juzgó un valor leído **una sola vez**: una foto de un instante | si a `expect` se le pasó un valor ya leído (`isVisible()`, `count()`, `textContent()`) en lugar del locator |
   | 4 | **verde**, y es un caso negativo o una aserción nueva | todavía nada: hay que medir la aserción | la **prueba de control** del paso 5 |

   Las lecturas 1 y 3 tienen `Expected` y `Received` las dos. **Lo que las separa es la primera
   línea del error** —`expect(locator)` o `expect(received)`— y si hay `Locator:` y `Timeout:`.

3. **Nombrar la causa con su evidencia.** Una frase con la causa, la línea de la salida que la
   prueba —copiada textual— y el archivo con el número de línea.

4. **Proponer el cambio mínimo.** Una línea, si alcanza. Según la lectura:

   | Lectura | Cambio mínimo |
   |---|---|
   | 1 | si la fuente respalda el `Received`, se corrige la expectativa; **si la fuente no fija el texto, no se cambia nada: se pide decisión** (sección 6) |
   | 2 | se corrige el locator según el mapa, o se corrige el paso anterior que no llegó |
   | 3 | se le pasa a `expect` el **locator**, no el valor: `await expect(page.getByTestId('…')).toBeVisible()` o `.toHaveText('…')`. Así la aserción reintenta sola hasta el timeout |
   | 4 | se quita o se reemplaza la aserción que no distingue; y se ordena: primero la aserción que espera la respuesta |

5. **Volver a ejecutar, y medir.** Correr de nuevo el mismo comando del paso 1. Si el test es un
   **caso negativo**, cada aserción de su bloque de verificación pasa la **prueba de control**:

   - se pega esa línea **al final** del test positivo —el que sí entra—;
   - se corre solo el test positivo;
   - **tiene que ponerse rojo.** Si da verde, esa línea también pasa cuando el login funciona: no
     distingue nada y no entra;
   - se borra la línea del test positivo. Era un control, no un cambio.

6. **Entregar y parar.** Se devuelve la salida de la sección 6. No se aplica el cambio si no se
   pidió.

---

## 4. Límites — qué NO hace

- **No agrega esperas fijas.** Nada de `waitForTimeout`, `sleep`, `setTimeout` ni un número de
  milisegundos para «darle tiempo». Es la tercera regla de `.agents/rules/criterio-qa.md` §6. Una
  espera fija que pone verde un test no lo arregló: adivinó un número que hoy alcanzó.
- **No sube un timeout para que pase.** Mismo problema con otro nombre.
- **No arregla hasta verde.** Si el primer cambio no da el resultado esperado, **vuelve al paso 2**
  con la salida nueva. No prueba otro cambio, y otro, y otro, hasta que algo pase.
- **No copia el `Received` al `Expected` sin fuente.** Eso pone el test verde y esconde justo lo que
  el test tenía que detectar.
- **No cambia un locator por otro que «también funciona»** sin que el nuevo esté en el mapa con su
  evidencia.
- **No decide si el producto está bien.** Dice qué muestra la pantalla; si eso es correcto lo decide
  el negocio.
- **No toca archivos que no sean el test**, ni el `playwright.config.ts`, ni otros tests.

---

## 5. Cuándo pide decisión humana

Para y pregunta, en vez de resolver, cuando:

- `Received` es distinto de `Expected` y **la fuente no fija el texto** (el caso de `P4` y el saludo
  `¡Hola, Ana!` en `docs/casos-login-v2.md` §3);
- el test es flaky y **no se reproduce** en tres corridas;
- la causa está en el **producto** (cambió, está caído o responde distinto a lo documentado);
- la única aserción que distinguiría el caso necesita un dato que el entorno no deja preparar;
- el cambio mínimo obliga a tocar el config, otro test o el mapa de selectores.

---

## 6. Salida y criterio de terminado

### 6.1 · La salida

Seis líneas, en este orden y nada más:

```text
LECTURA:          1, 2, 3 o 4 (sección 3, paso 2)
CAUSA:            una frase
EVIDENCIA:        la línea de la salida del runner, copiada textual
ARCHIVO Y LÍNEA:  tests/e2e/<archivo>.spec.ts:<línea>
CAMBIO MÍNIMO:    la línea como queda, o «ninguno: pido decisión» y por qué
CÓMO SE COMPRUEBA: el comando del paso 1 y, si es un caso negativo, la prueba de control
```

### 6.2 · El criterio de terminado

- [ ] la causa cita una línea textual de la salida del runner, no una suposición sobre el código;
- [ ] el cambio propuesto no tiene ninguna espera fija ni sube ningún timeout;
- [ ] el cambio toca una sola cosa;
- [ ] se volvió a ejecutar y el resultado es el que la causa predecía;
- [ ] si es un caso negativo, cada aserción pasó la prueba de control;
- [ ] la QA puede explicar la causa sin leer esta salida.

El último punto no lo verifica la skill. **Lo verifica quien firma.**

---

## 7. Cómo se prueba esta skill

Tres corridas, con salidas conocidas de `recursos-s10/` y `recursos-s11/`. Se repiten cada vez que
se toca la sección 3.

| Prueba | Con qué | Qué tiene que pasar |
|---|---|---|
| **El rojo del dato** | el saludo cambiado a `'¡Hola, Ana García!'` (rojo A de C10) | lectura 1; **no** propone copiar `¡Hola, Ana!` al `Expected`: pide decisión por `P4` |
| **El rojo de la foto** | el intento 1 con `isVisible()` (`recursos-s11/fuente-demostracion-c11.md`) | lectura 3; propone pasar el locator a `expect`; **ninguna** espera fija |
| **El verde sospechoso** | la línea `await expect(page).toHaveURL(/.*login/);` como candidata para C03 | lectura 4; la prueba de control da verde en el test positivo, así que la línea no entra |

Si una prueba no pasa, no se repite el pedido con otras palabras: **se corrige la línea de la
sección 3 o 4 que quedó floja y se vuelve a correr.**

---

## 8. Dónde se vuelve a usar

| Clase | Para qué |
|---|---|
| **C12** | la suite tiene que estar verde antes y después de mover los locators a un Page Object; un rojo en el medio se lee con esta skill antes de tocar nada |
| **C13** | se agrega un paso: abrir el `trace.zip` y la captura de `test-results/` antes de nombrar la causa. **Hasta C13, la evidencia es la salida del runner** |
| **C14** | los tests que genere el `pom-agent` pasan por la lectura 4 y por la prueba de control antes de aceptarse |
| **C17** | un rojo en la integración continua se lee igual: primero la salida, después el cambio |

---

*Cuarta skill de `qa-automation-portfolio`, después de `priorizar-automatizacion` (C7),
`derivar-casos-de-hu` (C8) y `revisar-con-rubrica` (C9). Nace en C11, empaquetando las cuatro
lecturas que se hicieron a mano en C10 y en C11 sobre `tests/e2e/login.spec.ts`. Se revisa cuando
aparece una lectura nueva —la primera, prevista para C13: el trace—.*
