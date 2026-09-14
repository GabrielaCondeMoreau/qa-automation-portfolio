# JavaScript esencial para leer tests

## Test observado

- Archivo: `tests/orden-ejecucion.spec.ts`
- Fecha:- Fecha: 2026-09-14
- Responsable: Gabriela Conde Moreau

## 1. Mapa de lectura

| Fragmento real | Cómo lo leo | ¿Prepara o espera? | Evidencia de ejecución |
|---|---|---|---|
| `const LOGIN_URL = ...` | guarda la URL con un nombre | prepara información | ocurre antes del test |
| `async ({ page }) => {` | función asíncrona que recibe `page` | abre un bloque que puede usar `await` | contiene los pasos |
| `const email = page.getByLabel('Email')` | crea una descripción del campo | prepara un locator; no espera | aparece después del log 2 |
| `await page.goto(LOGIN_URL)` | inicia la navegación y espera su promesa | espera | log 1 termina antes del log 2 |
| `await expect(email).toHaveCount(1)` | espera la comprobación de cantidad | espera | bloque 3 termina antes del 4 |

## 2. Predicción y resultado

**Comando del ejercicio de predicción:**

```bash
npx playwright test tests/orden-ejecucion.spec.ts -g "confirma el orden"
```

**Orden de los tres mensajes que predigo antes de ejecutar:**

1. `1. antes de esperar`
2. `3. después de esperar`
3. `2. operación terminada`

**Orden de los tres mensajes observado en la terminal:**

**Orden de los tres mensajes observado en la terminal:**

1. `1. antes de esperar`
2. `3. después de esperar`
3. El mensaje `2. operación terminada` no llegó a mostrarse antes de que fallara el test.

**¿Coincidieron? ¿Qué corregí?**

Coincidió parcialmente con mi predicción. Sin `await`, el código continuó con el mensaje 3 sin esperar a que terminara `registrarDespues`. Sin embargo, el mensaje 2 no llegó a aparecer en la terminal antes de que la comparación fallara. Corregí mi idea de que siempre llegarían a imprimirse los tres mensajes.

## 3. Experimento controlado

- Línea donde retiré temporalmente `await`: `await registrarDespues(eventos, '2. operación terminada', 50);`
- Resultado esperado: el test fallaría porque continuaría con el mensaje 3 antes de que `registrarDespues` agregara el mensaje 2.
- Resultado real: el test falló. El array recibido contenía `1. antes de esperar` y `3. después de esperar`, pero faltaba `2. operación terminada`.
- Por qué falló o cambió: al retirar `await`, el test no esperó a que terminara `registrarDespues` y ejecutó `expect(eventos).toEqual(...)` antes de que el mensaje 2 fuera agregado al array.
- Evidencia de que restauré el archivo y volvió a verde: -- Evidencia de que restauré el archivo y volvió a verde: ejecuté `npm test -- tests/orden-ejecucion.spec.ts` y obtuve `2 passed`.

**Comando de cierre para comprobar el archivo completo:**

```bash
npm test -- tests/orden-ejecucion.spec.ts
```

**Resultado de cierre esperado:** `2 passed`.

## 4. Capacidad de IA — leer código en orden

Usa esta instrucción con un agente de proyecto cuando recibas un test que no entiendes:

```text
Analiza únicamente el código que te entrego. No modifiques archivos.

Objetivo: ayudarme a predecir el orden de ejecución.

Devuelve una tabla con:
1. fragmento literal;
2. explicación en lenguaje sencillo;
3. si solo prepara información o inicia una operación asíncrona;
4. qué promesa espera cada await;
5. qué afirmación necesita comprobarse ejecutando.

No afirmes que toda línea de Playwright necesita await. Marca los resultados como pendientes hasta
que yo entregue logs reales.
Detente para que yo escriba mi predicción y ejecute el test.

Código:
[PEGAR AQUÍ]
```

## 4b. Instrucción 2 — Explicar un error con mi propio documento

> Se usa **después** del experimento controlado, con el archivo ya restaurado. El objetivo no es
> arreglar nada: es comprobar si tu vocabulario alcanza y encontrar los huecos que te faltan.

**Antes de pegar nada, escribe tu predicción:**

- Creo que la IA me va a explicar el error diciendo que: al retirar `await`, el test continuó sin esperar a que terminara `registrarDespues` y comprobó el array antes de que se agregara el mensaje 2.

```text
Esta tabla es mi mapa de lectura del test. Es mi vocabulario: solo entiendo estos términos.

Explícame el error de abajo usando únicamente las palabras que aparecen en mi tabla.

Si para explicarlo necesitas un término que no está en mi tabla, no lo uses: nómbralo aparte, en una
lista al final, y dime en una línea qué tendría que entender yo primero.

No modifiques archivos y no propongas la corrección: el archivo ya está restaurado.

Mi tabla:
[PEGAR LA TABLA DE LA SECCIÓN 1]

El error:
[PEGAR LA SALIDA DEL ROJO CONTROLADO]
```

**Gate de esta consulta:** no es *“¿tiene razón?”*. Es **¿pude seguir la explicación de punta a punta
con lo que ya sé?**

- **¿Coincidió con mi predicción?**
Sí. La IA explicó que, al no esperar, el test continuó del paso 1 al paso 3 y realizó la comprobación sin que estuviera presente el paso 2.

- **¿En qué punto tuve que releer?**
Tuve que releer la diferencia entre el contenido esperado y el contenido recibido por `toEqual`.

### Lo que todavía no entiendo

Los términos que la IA marcó como fuera de tu vocabulario. Esta lista es tu plan de estudio, y crece
por huecos detectados trabajando, no por copiar teoría.

| Término | Qué tendría que entender primero | ¿Ya lo resolví? |
|---|---|---|
| `registrarDespues` | Que es una función asíncrona que espera y después agrega un mensaje. | Sí |
| `Array` | Que guarda varios elementos respetando su orden. | Sí |
| `toEqual` | Que compara el contenido real con el contenido esperado. | Sí |
| `Expected` | Que representa el resultado esperado por la comprobación. | Sí |
| `Received` | Que representa el resultado encontrado realmente. | Sí |

## 5. Gate humano

- [x] La explicación cita el código real.
- [x] Diferencia creación de locator y operación asíncrona.
- [x] No confunde `1 passed` con una coincidencia.
- [x] Comparé la predicción con los logs reales.
- [x] Restauré el test después del experimento.
- [x] Pedí la explicación del error con mi propio vocabulario y anoté los términos que me faltaban.

## 6. Portabilidad del procedimiento

- **Entrada:** código real del test.
- **Salida:** tabla de lectura y afirmaciones pendientes de ejecución.
- **Gate:** comparar la predicción con logs y resultado del runner.
- **Condición de cierre:** explicación actualizada, archivo restaurado y `2 passed`.

En un agente de IDE o CLI puedes señalar el archivo. En una aplicación de chat debes pegar el
fragmento y ejecutar el test por tu cuenta. No se requieren subagentes para leer un único flujo.

## 7. Predicciones para leer HTTP

| Concepto | Mi predicción | Evaluación | ¿Necesita fuente o ejecución? |
|---|---|---|---|
| Request | PREDICCIÓN: es data que le solicito al endpoint. | PARCIALMENTE CORRECTA: es el mensaje que un cliente envía al servidor para solicitar una acción sobre un recurso; puede contener datos. | La definición necesita fuente. La request concreta necesita ejecución para observar URL, método, headers y contenido. |
| Response | PREDICCIÓN: es la respuesta del servidor ante el request. | CORRECTA, PERO INCOMPLETA: es el mensaje de respuesta y puede incluir status, headers y contenido. | La definición necesita fuente. La response concreta necesita ejecución para observar sus valores. |
| Método HTTP | PREDICCIÓN: es un protocolo de comunicación. | INCORRECTA: HTTP es el protocolo; el método indica la acción solicitada, por ejemplo `GET` o `POST`. | Su definición necesita fuente. El método usado en una request concreta necesita ejecución. |
| Status | PREDICCIÓN: informa si la consulta salió bien o mal. | PARCIALMENTE CORRECTA: el código forma parte de la response e informa el resultado; también distingue información, redirección y diferentes clases de errores. | Su definición necesita fuente. El código devuelto por el servidor necesita ejecución. |
| Header | PREDICCIÓN: es el cabezal de la URL, donde se envían parámetros adicionales. | INCORRECTA: es un campo de información adicional de una request o response; no forma parte del cabezal de la URL. | Su definición necesita fuente. Los headers y valores concretos necesitan ejecución. |

**Fuente documental consultada:** RFC 9110 — HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html

**Evidencia disponible:** todavía no ejecuté una solicitud HTTP. Por lo tanto, no registré como observado ningún método, status, header ni contenido concreto.