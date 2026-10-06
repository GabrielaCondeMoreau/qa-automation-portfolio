---
name: revisar-con-rubrica
description: Revisa un artefacto de QA contra una rúbrica de cuatro dimensiones y devuelve hallazgos accionables citando el caso. Señala; no aprueba, no corrige y no escribe lo que falta.
---

# Revisar con rúbrica

> **Cómo leer este archivo.** Seis campos, los mismos de siempre: cuándo se usa · entrada · pasos ·
> límites · cuándo pide decisión humana · salida y criterio de terminado. La rúbrica de la sección 2
> es parte del procedimiento y **vive solamente acá**: no está copiada en materiales, ni en la
> consigna de la tarea, ni en el workflow que la invoca.
>
> **Esta skill no aprueba nada.** Devuelve hallazgos con su dimensión y el caso que los produce.
> Aceptar, corregir o rechazar cada hallazgo es trabajo de la QA, y queda firmado en el archivo del
> artefacto revisado.
>
> **No maquilles: un rojo honesto vale más que un verde regalado.**

---

## 1. Cuándo se usa

Cuando hay un artefacto de QA terminado y hace falta revisarlo con la misma vara todas las veces,
sin que el resultado dependa de quién lo mire o de a qué hora del día se mire.

Sirve para tres tipos de artefacto, y la rúbrica es la misma en los tres:

| Artefacto | Desde cuándo | Qué se revisa |
|---|---|---|
| **Casos de prueba** | C9 | el conjunto de casos de una historia o de un ítem del backlog, con sus preguntas abiertas |
| **Tests de Playwright** | C10 | el archivo `.spec.ts` recién escrito, antes de darlo por bueno |
| **Documentación viva** | C9 | `docs/contrato-api.md`, `docs/estrategia-automatizacion.md`, `docs/mapa-selectores.md` |

**Cuándo NO se usa:** para generar casos (eso lo hace `derivar-casos-de-hu`, o la IA capa por capa con
tu gate) ni para escribir tests, para decidir qué se automatiza (eso es
`priorizar-automatizacion`), ni para revisar el producto. **Esta skill mira el artefacto, no la
aplicación.** Que un caso esté bien escrito no dice nada sobre si el producto lo cumple: eso lo
responde ejecutar.

---

## 2. La rúbrica — cuatro dimensiones

Cada dimensión se puntúa de **1 a 3**. Total de **4 a 12**. El total ordena la conversación; **no
aprueba nada**.

### D1 · Trazabilidad — ¿cada pieza dice de dónde salió?

| | |
|---|---|
| **1** | ninguna pieza cita fuente |
| **2** | algunas citan fuente y otras no |
| **3** | cada pieza cita una fuente localizable, y las fuentes citadas existen en lo que se entregó |

Fuente localizable es un criterio de aceptación con su fragmento, un REQ, una fila del backlog, una
sección del contrato o una fila del mapa de selectores. Una fuente citada que **no aparece** en lo
entregado —un REQ que no existe, un fragmento que no está literal en la historia— es un hallazgo de
esta dimensión, no de otra.

### D2 · Cobertura — ¿el conjunto cubre lo que las fuentes prometen?

| | |
|---|---|
| **1** | solo el camino feliz |
| **2** | hay algún negativo, pero queda al menos un requisito de las fuentes sin ninguna pieza |
| **3** | cada requisito de las fuentes entregadas tiene al menos una pieza, y hay negativos y bordes |

Esta dimensión se mide sobre **el conjunto**, no pieza por pieza: una pieza sola no cubre nada.

**Y no se puntúa en abstracto: se nombra.** Esta dimensión produce siempre una lista aparte,
**«QUÉ FALTA»**, de **3 a 5 viñetas**. Cada viñeta nombra **un hueco concreto** del conjunto, no una
carencia general. Una viñeta sirve cuando quien la lee puede convertirla en una pieza sin volver a
preguntar qué quiso decir.

| Viñeta que no sirve | Viñeta que sirve |
|---|---|
| «falta cubrir los casos negativos» | «CA3 dice *la cuenta se bloquea por 30 segundos*: ninguna pieza comprueba la duración» |
| «la cobertura está incompleta» | «CA1 dice *Ambos son obligatorios*: hay una pieza por cada campo vacío, ninguna con los dos vacíos» |

Dos reglas duras, y son las de siempre:

- **Cada viñeta cita la fuente de la que sale el hueco**: el criterio, el requisito o la fila, con su
  fragmento. Un hueco que no se puede rastrear hasta lo entregado **no se escribe**: sería inventar un
  requisito, y eso es exactamente lo que caza la dimensión 1.
- **La viñeta nombra el hueco; no escribe la pieza que falta.** *«Ninguna pieza comprueba la duración
  del bloqueo»*, sí. *«Caso 10: esperar 30 segundos y verificar que…»*, no.

**Tres es el piso de lo que se busca, no un cupo que haya que llenar.** Si hay menos de tres huecos
rastreables, van los que haya y se dice cuántos son; inventar el tercero para llegar a tres es el modo
de fallar que esta skill existe para evitar. Si hay más de cinco, van los cinco que más duelen y se
dice que hay más.

### D3 · Claridad ejecutable — ¿otra persona lo ejecuta sin preguntarte y obtiene lo mismo?

| | |
|---|---|
| **1** | no dice con qué datos se ejecuta ni qué se espera ver |
| **2** | dice los datos o el resultado, pero uno de los dos queda a interpretación |
| **3** | datos concretos + resultado observable, con el texto, el elemento o el status exacto |

*«Responde bien», «funciona correctamente» y «se muestra el mensaje adecuado» son puntaje 2 como
máximo, y cada uno produce su hallazgo.*

### D4 · Honestidad sobre lo no verificable — ¿declara lo que con esto no se puede comprobar?

Es la versión de rúbrica de `.agents/rules/criterio-qa.md`: §1 (`SIN FUENTE`, `SIN CONTEXTO`) y §5
(un caso sin fuente no es un caso: lo que no tiene fragmento que lo respalde va como pregunta abierta,
y el esperado que la fuente no fija va `POR CONFIRMAR`).

| | |
|---|---|
| **1** | afirma resultados que las fuentes entregadas no respaldan |
| **2** | no inventa, pero tampoco declara lo que falta |
| **3** | marca `SIN FUENTE` o `POR CONFIRMAR` donde la fuente no alcanza, cada `POR CONFIRMAR` apunta a una pregunta abierta que cita su fragmento, y lista aparte lo que hoy no se puede verificar con su razón |

### Cómo se lee cada dimensión según el artefacto

| Dimensión | En casos de prueba | En un test de Playwright | En documentación |
|---|---|---|---|
| **Trazabilidad** | el caso cita su criterio, su REQ y un fragmento que aparece literal en la fuente | el nombre del test o un comentario cita el REQ o la fila del backlog | cada afirmación cita archivo, REQ u observación propia |
| **Cobertura** | cada requisito tiene al menos un caso · «QUÉ FALTA» nombra los que no | el archivo cubre el caso feliz y su negativo · «QUÉ FALTA» nombra la rama sin test | cada sección de la fuente tiene su fila · «QUÉ FALTA» nombra las que no |
| **Claridad ejecutable** | datos concretos + resultado observable | nombre que dice qué se rompió si falla, aserción específica y sin esperas fijas | otra persona la usa sin preguntarte |
| **Honestidad** | marca lo no verificable hoy (`POR CONFIRMAR`, `SIN FUENTE`) y no presenta como requisito un texto que la fuente no da | el test no afirma lo que no verifica | separa especificación, lo visto en pantalla e incógnita |

### La regla dura de esta rúbrica

**Todo puntaje menor a 3 viene con al menos un hallazgo que cita la pieza por su número.** Un 2 sin
hallazgo no vale: se descarta ese puntaje y se vuelve a pedir. Un número sin hallazgo no se puede
accionar, y una revisión que no se puede accionar no sirvió para nada.

---

## 3. Entrada

Sin estas tres cosas la skill no arranca. Si falta alguna, se pide antes de puntuar.

| # | Qué | Dónde vive |
|---|---|---|
| 1 | **El artefacto a revisar**, completo y con las piezas numeradas | el archivo del artefacto |
| 2 | **Las fuentes contra las que se revisa**: los requisitos, el contrato, el mapa o la fila del backlog | `docs/` |
| 3 | **Qué se está revisando**: casos, test o documentación | lo dice quien invoca |

Si quien invoca pasa también **las reglas del repositorio** (`.agents/rules/criterio-qa.md`), se
aplican al revisar: dicen cómo se escribe un caso en este repositorio, no son el análisis de la autora.

**Lo que esta skill no debe recibir:** el pedido con el que se generó el artefacto, la conversación
donde se generó, ni el análisis de quien lo escribió (su contexto, sus reglas derivadas, sus riesgos).
Un juez que vio cómo se hizo el trabajo tiende a explicar por qué está bien en vez de mirar qué le
falta; y un juez que recibe las reglas que derivó la autora revisa los casos contra esa lectura, no
contra la fuente.

---

## 4. Pasos

1. **Lee las tres entradas.** Si las fuentes no vinieron, dilo y para: sin fuentes no se puede
   puntuar trazabilidad ni cobertura, que son la mitad de la rúbrica.
2. **Numera las piezas** del artefacto si no vienen numeradas, y usa esos números en todos los
   hallazgos.
3. **Puntúa las cuatro dimensiones** de la sección 2, de 1 a 3, sobre el conjunto.
4. **Escribe un hallazgo por cada problema concreto**, con su dimensión y el número de la pieza. Cada
   puntaje menor a 3 tiene que quedar respaldado por al menos un hallazgo.
5. **Escribe «QUÉ FALTA»**: de 3 a 5 viñetas, cada una con el hueco nombrado y la fuente de la que
   sale, con su fragmento. **No escribas la pieza que falta.**
6. **Lista aparte lo que no pudiste evaluar** y por qué.
7. **Entrega y para.** No propongas correcciones ni vuelvas a generar.

---

## 5. Límites — qué NO hace

- **No aprueba ni rechaza.** No escribe `LISTO`, `APROBADO`, `LISTO PARA AUTOMATIZAR` ni `REHACER`.
  Devuelve puntajes y hallazgos; la decisión sobre cada hallazgo la firma la QA. **No maquilles: un
  rojo honesto vale más que un verde regalado.**
- **No corrige el artefacto.** No reescribe casos, no arregla redacciones, no toca archivos.
- **No escribe las piezas que faltan.** En «QUÉ FALTA» nombra el hueco; escribir la pieza es trabajo
  de quien genera.
- **No inventa fuentes.** Si una pieza cita un REQ que no está en lo entregado, eso es un hallazgo de
  trazabilidad, no un motivo para suponer que el REQ existe. **Y un hueco que no se puede rastrear
  hasta las fuentes entregadas no entra en «QUÉ FALTA»:** nombrarlo sería inventar el requisito que lo
  justifica.
- **No puntúa lo que no puede ver.** Si no le entregaron las fuentes, escribe `SIN FUENTE` en
  trazabilidad y cobertura y dice qué necesita.
- **No opina sobre el producto.** No dice si el comportamiento está bien o mal: eso es criterio de
  negocio y se decide afuera.
- **No pone un puntaje sin hallazgo.** Un 1 o un 2 sin al menos un hallazgo citado es una salida
  inválida.

---

## 6. Cuándo pide decisión humana

Para y pregunta, en vez de resolver, cuando:

- lo que dice la fuente y lo que alguien vio en pantalla no coinciden, y el caso podría estar bien
  escrito contra cualquiera de los dos;
- el requisito admite más de una lectura razonable y hace falta criterio de negocio para elegir una;
- el hueco de cobertura depende de algo que el equipo tiene que preparar antes —un dato, un reseteo,
  un permiso—;
- el artefacto entra en desacuerdo con una decisión ya firmada en `docs/estrategia-automatizacion.md`;
- no queda claro si algo es un caso faltante o una decisión deliberada de alcance.

---

## 7. Salida y criterio de terminado

### 7.1 · La salida

Cuatro bloques, en este orden y nada más:

```text
1. PUNTAJES
   dimensión | puntaje | en qué se apoya

2. HALLAZGOS
   # | pieza citada | dimensión | qué encontré | por qué importa

3. QUÉ FALTA — cobertura · de 3 a 5 viñetas
   - <el hueco, nombrado> · sale de <criterio o requisito> · «<fragmento>»

4. LO QUE NO PUDE EVALUAR
   qué no pude evaluar y por qué
```

No hay bloque de veredicto, y no lo hay a propósito.

### 7.2 · El criterio de terminado

La corrida se considera terminada cuando:

- [ ] las cuatro dimensiones tienen puntaje, o dicen qué falta para poder puntuarlas;
- [ ] cada puntaje menor a 3 tiene al menos un hallazgo que cita una pieza por su número;
- [ ] cada hallazgo dice qué encontró y por qué importa, no solo que algo está mal;
- [ ] «QUÉ FALTA» tiene entre 3 y 5 viñetas —o dice cuántos huecos rastreables había, si eran menos—,
      cada una con su fuente citada y **ninguna** escrita como una pieza nueva;
- [ ] no aparece ninguna palabra de aprobación en la salida;
- [ ] la QA puede decir, hallazgo por hallazgo y hueco por hueco, qué va a hacer con él.

El último punto no lo verifica la skill. Lo verifica quien firma.

---

## 8. Cómo se prueba esta skill

Tres corridas. Se repiten cada vez que se toca la rúbrica de la sección 2.

| Prueba | Con qué | Qué tiene que pasar |
|---|---|---|
| **El control** | un artefacto que incluye una pieza deliberadamente floja —sin fuente, sin datos y sin resultado observable— | la marca por trazabilidad y por claridad ejecutable, citándola por su número. Si no la marca, la floja no es la pieza: es la línea de la rúbrica |
| **Artefacto real** | los casos de una historia real —por ejemplo, tu `docs/casos-login.md`—, con la historia como fuente | produce hallazgos accionables, **ningún** puntaje sin hallazgo, y un «QUÉ FALTA» donde **cada viñeta se puede rastrear hasta la historia**. Si una no se puede, esa viñeta es un requisito inventado |
| **Sin fuentes** | el mismo artefacto, pero sin entregarle los requisitos | escribe `SIN FUENTE` en trazabilidad y cobertura y dice qué necesita, en vez de puntuar igual |

Si la tercera corrida puntúa igual sin las fuentes, el límite está flojo: se afina la sección 5 de
este archivo y se vuelve a correr. **La skill se corrige editando el archivo, no repitiendo el
pedido.**

---

## 9. Si tu herramienta no lee archivos

El procedimiento no cambia: pegas el artefacto, pegas las fuentes y pegas la rúbrica de la sección 2.
Cambia dónde vive el contexto; no cambian las dimensiones, ni los límites, ni el criterio de
terminado.

Lo que sí hay que sostener a mano es lo que en un agente sale gratis: **el juez tiene que trabajar en
una conversación nueva**, sin la conversación donde se generó el artefacto.

---

*Tercera skill de `qa-automation-portfolio`, después de `priorizar-automatizacion` (C7) y
`derivar-casos-de-hu` (C8): las dos primeras producen, esta revisa. Nace en C9. La invoca el paso 2 (Juzgar) de
`.agents/workflows/generar-y-juzgar.md`. Se revisa cuando cambia la rúbrica de la sección 2 o cuando
aparece un tipo de artefacto nuevo.*
