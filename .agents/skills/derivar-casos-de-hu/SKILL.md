---
name: derivar-casos-de-hu
description: Deriva casos de prueba de una historia de usuario, capa por capa, y cita en cada caso el criterio, el requerimiento y el fragmento textual del que sale. Propone; no firma, no ejecuta y no escribe tests.
---

# Derivar casos de prueba desde una historia de usuario

> Los seis campos de siempre: cuándo se usa · entrada · pasos · límites · cuándo pide decisión
> humana · salida y criterio de terminado.
>
> **Qué guarda este archivo.** No guarda los casos: esos viven en `docs/`. Guarda **cómo se dirige a
> la IA** para producirlos: qué se le pide en cada capa, qué se le prohíbe y dónde hay que parar a
> revisar.

---

## 1. Cuándo se usa

Cuando llega una historia de usuario o un requerimiento al sprint y hay que convertirlo en casos de
prueba que se puedan defender: de dónde salió cada uno y qué quedó sin cubrir.

**Cuándo NO se usa:** para decidir qué se automatiza (eso es `priorizar-automatizacion`), para
revisar casos ya escritos (eso es el juez con rúbrica), ni para escribir código de test.

---

## 2. Entrada

| # | Qué | Obligatoria |
|---|---|---|
| 1 | La **historia** con sus criterios de aceptación identificados (`CA1`, `CA2`…) y, si existen, sus requerimientos | Sí |
| 2 | Las **notas del equipo**: qué es crítico para el negocio, qué está por cambiar, qué no está definido | No, pero sin ellas el riesgo sale `SIN CONTEXTO` |
| 3 | Las reglas de `.agents/rules/criterio-qa.md` | Sí |

Sin la entrada 1 no arranca: pide la historia.

---

## 3. Pasos

Una capa por pedido, en este orden. **Lo que pasa a la capa siguiente es la versión revisada por la
QA, no la que devolvió la IA.**

0. **Encuadre.** Antes de pedir nada: una capa por vez, nada de casos hasta que se pidan, lo que no
   esté en la historia se marca `POR CONFIRMAR`, las citas van textuales entre comillas, y no se
   modifica ningún archivo.
1. **Contexto.** Cinco líneas: objetivo, quién lo usa, camino feliz, qué entra, qué sale.
2. **Reglas.** Una tabla `RG` con una sola condición comprobable por fila, el criterio del que sale
   cada una, y `(implícita)` en lo que se deduce.
3. **Preguntas.** Una tabla `P` con la pregunta, el fragmento textual que la origina y qué deja sin
   resolver. Solo lo que no se contesta leyendo la historia.
4. **Riesgos.** Una tabla `R` con qué puede salir mal, el daño concreto y el nivel. El impacto sale
   de las notas del equipo; sin notas, `SIN CONTEXTO`.
5. **Casos.** Derivados de las reglas, ordenados por riesgo, con siete columnas: número, caso, datos,
   resultado esperado, fuente, técnica y riesgo. La fuente lleva tres partes: criterio,
   requerimiento y **fragmento textual entre comillas**. Partición de equivalencia y valores límite,
   diciendo cuál se usó en cada caso.
6. **Entrega y para.** No decide qué se automatiza y no firma.

---

## 4. Límites — qué NO hace

- **No escribe casos antes de la capa 5**, aunque los tenga claros.
- **No completa lo que la historia no dice.** Va `POR CONFIRMAR`, nunca lo probable.
- **No inventa textos de mensajes de error, pantallas ni comportamientos.** Si la historia no fija el
  texto, el resultado esperado dice qué se observa, no qué dice el cartel.
- **No parafrasea la fuente.** El fragmento se copia literal entre comillas; si no aparece literal en
  la historia, el caso no entra: vuelve como pregunta abierta.
- **No explica en el lugar de la cita.** Si una pregunta nace de algo que la historia **no dice**, no
  se justifica con una frase del tipo *«no hay mención en la historia»*: se escribe `SIN FRAGMENTO` y
  se dice de dónde sale —una ausencia en la historia o una nota del equipo, citada literal—.
- **No resuelve una ambigüedad eligiendo la lectura más razonable:** la convierte en pregunta.
- **No junta dos condiciones en una regla.** Un criterio con un «y» en el medio suele dar dos reglas,
  y una regla sin partir esconde un caso que nadie prueba.
- **No marca un riesgo como ALTO sin notas del equipo:** escribe `SIN CONTEXTO` y dice qué dato le
  falta.
- **No modifica archivos.** Devuelve todo en la conversación.
- **(mía)** No marca un riesgo como `ALTO` basándose solamente en conocimiento general de seguridad: cada `ALTO` cita una nota del equipo que describa el daño concreto; si esa nota no existe, escribe `SIN CONTEXTO` y dice qué dato falta.

---

## 5. Cuándo pide decisión humana

Para y pregunta, en vez de resolver, cuando:

- la historia no trae criterios de aceptación, o se contradicen entre sí;
- el resultado esperado depende de una pregunta abierta;
- el impacto de un riesgo depende del negocio o del calendario del equipo;
- el fragmento que respaldaría un caso no aparece en la historia.

Y hay tres cosas que no delega nunca: **la pregunta que la IA no podía hacer** —la que depende del
equipo o del producto—, **qué caso se queda y cuál se va**, y **la firma**.

---

## 6. Salida y criterio de terminado

Las cinco secciones en orden —contexto, reglas, preguntas, riesgos, casos— y debajo una línea por
criterio de aceptación con los casos que lo cubren.

La corrida se considera terminada cuando:

- [ ] cada criterio de aceptación tiene al menos un caso;
- [ ] cada caso cita criterio, requerimiento y fragmento, y el fragmento aparece literal en la historia;
- [ ] todo rango tiene sus valores límite;
- [ ] ningún resultado esperado trae un texto que la historia no dice;
- [ ] cada `POR CONFIRMAR` apunta a una pregunta de la lista;
- [ ] la QA puede decir, caso por caso, de dónde salió.

El último punto no lo verifica la skill. **Lo verifica quien firma.**

---

## 7. Cómo se prueba esta skill

| Prueba | Con qué | Qué tiene que pasar |
|---|---|---|
| **Caso conocido** | `docs/HU-login.md`, que ya está resuelto y auditado en `docs/casos-login.md` | reproduce las cinco capas con la misma forma; si difiere, la pregunta no es quién tiene razón, sino cuál de los dos se puede respaldar |
| **Límite ambiguo** | `docs/HU-registro.md`: CA2 dice «entre 2 y 50 caracteres» sin decir si es inclusivo, y CA4 y CA5 sí lo dicen | aparece una pregunta que cita ese fragmento, y los casos de 2 y 50 quedan marcados con ella |
| **Sin contexto** | la misma historia **sin** la sección «Notas del equipo» | el riesgo sale `SIN CONTEXTO` y dice qué dato le falta, en vez de inventarlo |

Si una prueba no pasa, no se repite el pedido con otras palabras: **se corrige la línea de la sección
4 que quedó floja y se vuelve a correr.**

---

*Segunda skill de `qa-automation-portfolio`. Nació en C8, empaquetando los cinco pedidos y los gates
con los que se derivaron los casos del login.*

## Bitácora de corridas

### Corrida del 2026-10-04 · sobre HU-login.md

- **Un caso que encontró y yo no:** Ninguno confirmado. Identificó un posible caso para comprobar que el bloqueo dure 30 segundos, pero no lo derivó porque falta definir la tolerancia de medición.
- **Un caso mío que no encontró:** Ninguno. Reprodujo los ocho casos auditados.
- **¿Inventó algún texto o comportamiento que la historia no dice?** No inventó textos de mensajes ni comportamientos en los resultados esperados. Sin embargo, marcó R2 y R3 como riesgos ALTOS y afirmó que ese nivel salía de las notas del equipo, aunque esas notas no justifican literalmente esos dos niveles.
- **Qué línea le agrego a la sección 4 (límites) para que no vuelva a pasar:** exigir que cada riesgo ALTO cite una nota concreta del equipo; si no existe, debe escribir SIN CONTEXTO.

### Corrida del 2026-10-05 · HU-registro.md sin notas del equipo

- **Primer intento:** rechazado. El agente analizó `HU-login.md` y utilizó sus notas del equipo, aunque la entrada solicitada era HU-registro sin notas.
- **Segundo intento:** correcto. Analizó exclusivamente el texto pegado de HU-registro y avanzó una capa por vez.
- **Qué hizo al no tener notas del equipo:** clasificó los nueve riesgos como `SIN CONTEXTO` e indicó qué información del equipo necesitaría para asignarles un nivel.
- **¿Marcó algún riesgo como ALTO sin respaldo?:** No. La regla agregada después de la corrida del login funcionó.
- **Resultado de la derivación:** 26 casos vigentes; C15 fue fusionado con C14 y C22 fue eliminado por falta de fuente.
- **Hallazgos de la IA juez:** C02 usaba `"Ana"` en un caso de 2 caracteres; C14 y C15 duplicaban la comprobación; C22 no tenía fuente suficiente; el conteo final decía 25 en lugar de 26; C27 y P3 tenían inconsistencias de trazabilidad.
- **Decisión humana:** revisé las observaciones de la IA juez y acepté las correcciones antes de cerrar la corrida.
- **Conclusión:** el flujo fue IA generadora → IA juez → decisión humana. La salida no se aceptó automáticamente.

### Cómo revisé las salidas

1. ¿Los datos concretos corresponden exactamente al caso y al valor límite anunciado? Esta pregunta detectó que C02 decía “2 caracteres”, pero usaba `"Ana"`, que tiene 3.
2. ¿Hay dos casos que ejecutan la misma acción y comprueban el mismo resultado? Esta pregunta detectó la duplicación entre C14 y C15.
3. ¿Cada resultado esperado tiene respaldo en un criterio o fragmento literal de la historia? Esta pregunta detectó que C22 afirmaba el rechazo de una edad no numérica sin que la historia definiera ese comportamiento.
4. ¿Cada `POR CONFIRMAR` apunta a una pregunta y cada pregunta mantiene trazabilidad con algún caso cuando corresponde? Esta pregunta detectó las inconsistencias de C27 y P3.
5. ¿El total declarado coincide con la cantidad real de identificadores, considerando casos fusionados y eliminados? Esta pregunta detectó que quedaban 26 casos y no 25.

### La pregunta que encontró el problema más importante

**¿Cada resultado esperado tiene respaldo en un criterio o fragmento literal de la historia?**

Fue la más importante porque detectó que C22 convertía una suposición razonable —que el campo edad rechazaría `"abc"`— en un comportamiento esperado sin fuente. Aplicando la regla “un caso sin fuente no es un caso”, decidí eliminarlo.

### Método de revisión utilizado

Una primera IA generó la derivación y una segunda IA actuó como juez de la salida. Yo revisé los hallazgos del juez y tomé la decisión final sobre qué correcciones aceptar.