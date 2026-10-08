# Criterio QA — reglas estables de este repositorio

> ## Este archivo llega dado, y llega a medio hacer. A propósito.
>
> **Qué es:** las reglas que ya venías repitiendo en cada pedido, escritas **una sola vez**. No se
> invocan: están siempre activas. Cualquier capacidad de este repositorio —la skill de hoy y las que
> vengan— trabaja debajo de estas reglas.
>
> **Por qué está incompleto:** acá abajo hay **cuatro** reglas, y son las cuatro que la skill de hoy
> necesita para funcionar. Entre C1 y C7 apareció bastante más que eso: cómo se pide un diagnóstico,
> qué locators se usan, cómo se explica código, qué se hace con una discrepancia. **Eso se cosecha en
> C8**, que es la clase donde este repositorio se convierte en un sistema de trabajo completo.
>
> **Qué NO va en este archivo:** el contexto del producto (eso vive en `docs/`) y los procedimientos
> con pasos (eso vive en `.agents/skills/`).

---

## 1. Honestidad sobre la fuente

Estas tres reglas son la misma idea con tres nombres, uno por artefacto. La idea es: **cuando falta
un dato, se escribe que falta.**

| Regla | Cuándo aplica | Nació en |
|---|---|---|
| Si un dato no está en lo que te entregué, escribe `SIN FUENTE` en esa celda y sigue. No lo completes con lo probable. | cualquier tabla o documento | C1 · C6 |
| Si un puntaje depende de información que no te di, escribe `SIN CONTEXTO` y di en una línea qué dato necesitas. No lo adivines. | priorización | C7 |
| **No inventes** endpoints, pantallas, requerimientos, campos ni comportamientos. La superficie real del sistema bajo prueba está en `docs/contrato-api.md` y en `docs/mapa-selectores.md`. Si algo no está ahí, no existe hasta que alguien lo verifique. | siempre | C6 · C7 |

---

## 2. Quién decide

| Regla | Nació en |
|---|---|
| No completes las columnas «decisión» ni «razón» de ningún documento. **Esas dos las firmo yo.** | C7 |

---

## 3. Cómo crece este archivo

Una regla entra acá cuando cumple las tres condiciones:

1. **Ya la escribiste al menos dos veces** en pedidos distintos.
2. **Vale para más de un artefacto.** Si solo aplica a un procedimiento, va dentro de esa skill, no acá.
3. **No es contexto del producto.** *"El curso `api-testing` no tiene cupo"* no es una regla: es un
   dato, y los datos viven en `docs/`.

Si una regla deja de cumplirse en la práctica, se borra. Un archivo de reglas que nadie respeta
enseña justo lo contrario de lo que dice.

---

## 4. Para cosechar en C8

> **Esta sección la llenas tú, en la tarea, y la vas a usar el miércoles.** Escribe crudo: no
> ordenes, no clasifiques y no decidas si cada línea es una regla, un dato o un procedimiento. Eso es
> exactamente el trabajo de C8, y hacerlo antes te lo arruina.


### Reglas mías que deberían estar siempre encendidas

> Cosas que le repetiste a la IA más de una vez entre C1 y C7, en pedidos de temas distintos.

-- No presentar como hecho nada que no tenga respaldo en la fuente; marcar explícitamente `SIN FUENTE`, `SIN CONTEXTO` o `INFERENCIA`. C1 · C6 · C7.
- No modificar archivos ni escribir tests cuando el pedido sea solamente analizar, explicar o proponer. C2 · C3 · C4 · C7.
-
-

### Cosas que hice más de una vez y que todavía no son skill

> Procedimientos que repetiste. Una de estas va a ser tu **segunda skill**, y en C8 la vas a
> empaquetar sin que nadie te lleve de la mano.
- Proponer opciones, comprobar cada una contra el sistema real y registrar cantidad de coincidencias y elemento encontrado. C3 · C4.
- Escribir una predicción, ejecutar el comando y comparar la predicción con los logs y el resultado real. C2 · C5 · C6.
- Introducir un cambio controlado, observar el fallo, restaurar el archivo y volver a ejecutar hasta obtener verde. C2 · C5.
- Comparar el contrato o requerimiento con la respuesta ejecutada y registrar coincidencias, discrepancias e incógnitas. C1 · C6.
-
## 5. Cosechadas en C8

| Regla | Cuándo aplica | Nació en |
|---|---|---|
| Un caso sin fuente no es un caso. Cada caso de prueba cita el criterio de aceptación o el requerimiento del que sale y el fragmento textual que lo justifica. Si no encuentras el fragmento, el caso no entra a la tabla: se escribe como pregunta abierta, con lo que haría falta saber para convertirlo en caso. | cualquier caso de prueba, escenario o test | C8 |
| Separar siempre lo esperado, lo predicho y lo observado. Si algo todavía no se ejecutó, no se presenta como evidencia: se marca como predicción o como pendiente de comprobación. | análisis, diagnósticos y reportes de ejecución | C1 · C5 · C6 |
-
## 6. Cosechadas en C10

| Regla | Cuándo aplica | Nació en |
|---|---|---|
| Si un locator se apoya en la apariencia o en la estructura de la página —una clase de CSS, una cadena tipo `form div > input`, XPath—, no entra. En su lugar va el locator que representa cómo una persona reconoce el elemento: `getByRole`, `getByLabel`, `getByText`. `getByTestId` entra cuando conservarlo es la decisión correcta y puedo explicar por qué: el elemento no tiene ninguna señal que una persona perciba, o lo que el test verifica es justamente su texto —y un elemento no se busca por el mismo texto que se está comprobando—. Se comprueba así: de cada locator del archivo puedo señalar la fila de `recursos-s10/mapa-selectores-c10.md` o la línea de la fuente de demostración de C10 de donde salió. | cualquier test o selector | C3 · C4 |
| Ningún selector se da por bueno sin comprobarlo antes contra el DOM real: en DevTools, pestaña Elements, buscándolo y mirando dos cosas —cuántas coincidencias hay y si la resaltada es la que quería—, o ejecutándolo. Un selector que se ve razonable y que nadie comprobó sigue siendo una propuesta. Se comprueba así: la fila de ese elemento en `recursos-s10/mapa-selectores-c10.md` tiene escrita su evidencia; si esa celda está vacía, el locator no entra al test. | cualquier locator, lo haya propuesto yo o la IA | C3 · C4 |
| Ninguna espera fija: nada de `waitForTimeout`, `sleep` ni un número de milisegundos suelto para «darle tiempo a que cargue». En su lugar va `await` sobre el locator o sobre el `expect`, que consulta la página y reintenta solo hasta el timeout. Se comprueba así: buscar `waitForTimeout` y `sleep` dentro del archivo de test no devuelve ninguna línea. | cualquier test de Playwright | C5 · C10 |
-

---

*Semilla entregada en C7 con cuatro reglas · se cosecha entero en C8.*
