# Registro de roles y capacidades — qa-automation-portfolio

> ## Este archivo llega dado. Hoy solo necesitas saber que existe.
>
> **Qué es:** el índice del repositorio para cualquier IA que trabaje acá adentro. Qué es este
> proyecto, dónde está la verdad y qué capacidades existen.
>
> **Por qué llega escrito:** hoy —en C7— el trabajo es la skill. Este archivo está acá para que la
> carpeta `.agents/` esté completa desde el primer día y para que la skill tenga dónde registrarse.
> **En C8 lo vas a entender entero y lo vas a hacer tuyo:** completar el contexto, comprobar que los
> archivos de la sección 2 existen de verdad en tu `docs/` y agregar lo que falte.
>
> **Este archivo no ejecuta nada.** Es un registro. Que exista una carpeta `.agents/` no convierte al
> repositorio en un agente.

---

## 1. Qué es este repositorio

| | |
|---|---|
| **Proyecto** | `qa-automation-portfolio` — el repositorio que crece durante toda la ruta |
| **Sistema bajo prueba** | Academia sin Humo · `https://playground.calidadsinhumo.com` |
| **Especificación** | `https://playground.calidadsinhumo.com/documentacion` |
| **Estado hoy** | documentación viva + una skill. Todavía **no hay tests**: el primero se escribe en C10 |
| **Responsable de las decisiones** | la QA dueña del repositorio. Ninguna capacidad de acá firma nada |

---

## 2. Dónde está la verdad

Ningún pedido vuelve a pegar este contenido en el chat. Se señala el archivo.

| Archivo | Qué contiene | Nació en |
|---|---|---|
| `docs/prompt-template.md` | la estructura base para pedirle algo a la IA | C1 |
| `docs/mapa-selectores.md` | los elementos del login localizados y comprobados en el DOM real | C3 · C4 |
| `docs/js-esencial.md` | lo mínimo de JavaScript para leer un test | C5 |
| `docs/contrato-api.md` | contrato dado + discrepancias observadas + incógnitas + la lista cruda de candidatos | C6 |
| `docs/estrategia-automatizacion.md` | el backlog priorizado y firmado: fuente, score, decisión y razón | C7 |
| `.agents/rules/criterio-qa.md` | las reglas estables, siempre activas | C7 (semilla) · C8 (cosechado) |

---

## 3. Capacidades registradas

### `priorizar-automatizacion` · skill

| | |
|---|---|
| **Dónde vive** | `.agents/skills/priorizar-automatizacion/SKILL.md` |
| **Qué hace** | puntúa candidatos a automatización contra cuatro criterios y devuelve la tabla con total y zona |
| **Qué NO hace** | no decide, no escribe la razón, no agrega candidatos, no inventa, no escribe tests |
| **Qué necesita de entrada** | una lista de candidatos **con fuente** + el contexto de equipo de `docs/estrategia-automatizacion.md` §1 + la escala de su §2 |
| **Dónde deja la salida** | en la conversación, para que la QA la pegue y la **firme** en `docs/estrategia-automatizacion.md` §3 |
| **Cuándo pide decisión humana** | siempre que un puntaje dependa de un dato que no está en el repositorio |
| **Nació en** | C7, empaquetando un procedimiento ejecutado a mano tres veces en la misma clase |

---

## 4. Cómo crece este archivo

Se agregan filas; no se borran las anteriores. Lo previsto en la ruta:

| Clase | Qué se registra |
|---|---|
| C8 | la segunda skill del repositorio, empaquetada en autonomía |
| C9 | el workflow `generar-y-juzgar` y la skill `revisar-con-rubrica` |
| C11 | la skill `diagnosticar-fallo-playwright` |
| C14 | el agente `pom-agent` |
| C16 | el agente `api-agent` |
| C17 | la capacidad que produce el workflow de integración continua |

Una capacidad entra al registro solo si **se va a usar en tres o más momentos o en el trabajo
cotidiano**. Si se usa una vez, fue un pedido puntual y no necesita archivo.

---

## 5. Lo que este registro no cubre

- **No hay agentes todavía.** Un agente es un modelo con herramientas, un ciclo de trabajo y una
  condición de parada. Lo que hay hoy son reglas y una skill: instrucciones, no autonomía.
- **No hay subagentes.** Se usan cuando el trabajo es divisible de verdad o cuando hacen falta
  miradas independientes que después alguien reconcilia. Todavía no es el caso.
- **El criterio no está acá.** Se puede escribir el procedimiento; no se puede escribir la firma.

---

*Semilla entregada en C7 · se completa en C8 · qa-automation-portfolio · Ruta QA Automation con IA*
