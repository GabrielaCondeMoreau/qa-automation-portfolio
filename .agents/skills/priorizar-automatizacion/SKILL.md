---
name: priorizar-automatizacion
description: Puntúa candidatos a automatización por riesgo con cuatro criterios y devuelve la tabla con total y zona. Propone puntajes; no decide, no firma y no escribe tests.
---

# Priorizar automatización

> **Cómo leer este archivo.** Seis campos, siempre los mismos: cuándo se usa · entrada · pasos ·
> límites · cuándo pide decisión humana · salida y criterio de terminado. Si alguno queda vacío, la
> capacidad todavía no está lista para empaquetarse.
>
> **Esta skill es la única copia del procedimiento.** Los criterios, la escala y las zonas viven en
> `docs/estrategia-automatizacion.md` §2, porque son el formato de ese documento. El **procedimiento**
> —qué se pide, con qué límites y dónde para— vive acá y en ningún otro lado. Un procedimiento con
> dos copias termina con una corregida y la otra circulando vieja.

---

## 1. Cuándo se usa

Cuando hay más candidatos a probar que tiempo para probarlos y hay que poder explicar el orden.

Situaciones típicas: al abrir un sprint, al recibir una funcionalidad nueva, al heredar un proyecto
sin suite, o cada vez que alguien pide «automaticemos todo».

**Cuándo NO se usa:** para escribir un test (eso es C10), para diseñar casos de prueba (eso es C9),
o para decidir si un bug se arregla. Esta skill ordena trabajo de automatización; no lo ejecuta.

---

## 2. Entrada

Sin estas tres cosas, la skill no arranca. Si falta alguna, se pide antes de puntuar.

| # | Qué | Dónde vive |
|---|---|---|
| 1 | **La lista de candidatos, cada uno con su fuente** (archivo, REQ o fila). Un candidato sin fuente no entra. | `docs/contrato-api.md` §10 · `docs/estrategia-automatizacion.md` §6 |
| 2 | **El contexto de equipo**: cada cuánto sale una versión, qué está por cambiar, qué datos de prueba se pueden preparar. | `docs/estrategia-automatizacion.md` §1 |
| 3 | **Los cuatro criterios, la escala de 1 a 3 y las zonas.** | `docs/estrategia-automatizacion.md` §2 |

---

## 3. Pasos

1. **Lee las tres entradas** de la sección anterior. Si el contexto de equipo (entrada 2) está vacío
   o no se entregó, **dilo antes de puntuar**: la mitad de los puntajes depende de eso.
2. **Descarta lo que no tiene fuente.** Un candidato sin archivo, REQ o fila no se puntúa: se lista
   aparte para que la QA lo mueva a `docs/estrategia-automatizacion.md` §6.
3. **Puntúa cada candidato de 1 a 3** en los cuatro criterios, usando exactamente la escala de
   `docs/estrategia-automatizacion.md` §2:
   - **FRECUENCIA** — 1 una sola vez · 2 en alguna versión · 3 en cada versión o todos los días
   - **ESTABILIDAD** — 1 cambia cada semana o está en construcción · 2 cambia a veces · 3 estable hace meses
   - **RIESGO** — 1 cosmético · 2 molesta pero se puede seguir trabajando · 3 crítico (acceso, datos, dinero, seguridad)
   - **MANTENIMIENTO** — 1 caro de mantener · 2 mantenible con esfuerzo · 3 barato de mantener
     *(ojo: 3 es el MÁS FÁCIL de mantener, para que los cuatro criterios apunten en la misma dirección)*
4. **Suma el total** (de 4 a 12) y marca la zona: 10–12 verde · 7–9 amarillo · 4–6 rojo.
5. **Marca `SIN CONTEXTO`** en toda celda cuyo puntaje dependa de información que no esté en las
   entradas, y di en una línea qué dato hace falta. No pongas un número razonable en su lugar.
6. **Lista aparte** los candidatos que, con la evidencia entregada, **no se pueden verificar hoy**, y
   di por qué.
7. **Entrega la tabla y para.** No continúes hacia la decisión.

---

## 4. Límites — qué NO hace

Esta sección es la que separa una skill de un pedido largo. Si se borra, queda un prompt.

- **No completa las columnas «decisión» ni «razón».** Las firma la QA. Ni siquiera como sugerencia,
  ni entre paréntesis, ni «por si sirve».
- **No agrega candidatos** que no estén en la lista entregada. Si detecta un hueco evidente, lo dice
  al final como observación separada, no como fila.
- **No inventa** endpoints, pantallas, requerimientos, campos ni comportamientos. La superficie real
  está en `docs/contrato-api.md` y `docs/mapa-selectores.md`. Si algo no está ahí, no existe.
- **No adivina puntajes.** Donde falta información, escribe `SIN CONTEXTO`, no un número plausible.
- **Si no recibió la entrada 2** —el contexto de equipo—, **no puntúa estabilidad ni mantenimiento**:
  esos dos criterios dependen del calendario y de los datos de prueba, y ninguno de los dos está en
  el repositorio.
- **No escribe código, tests ni pasos de prueba.**
- **No modifica ningún archivo del repositorio.** Devuelve la tabla; quien la pega es la QA.
- **No ordena por total.** El total ordena la conversación; el orden final lo decide una persona.

---

## 5. Cuándo pide decisión humana

Para y pregunta, en vez de resolver, cuando:

- el puntaje depende del calendario del equipo o de un rediseño previsto;
- el candidato prueba una regla que el producto **hoy no cumple** —hay que decidir qué se hace con
  una fila que va a quedar en rojo desde el primer día, y esa decisión no es técnica—;
- el entorno no permite verificar lo que el candidato afirma;
- dos candidatos empatan en total y hay que elegir cuál va primero;
- la lista viene sin fuente.

---

## 6. Salida y criterio de terminado

### 6.1 · La salida

Una sola tabla, con estas columnas y en este orden:

```text
# | candidato | fuente | Frec | Estab | Riesgo | Mant | Total | Zona | qué dato me falta
```

Debajo de la tabla, tres cosas y nada más:

1. la lista de candidatos **sin fuente**, que no se puntuaron;
2. la lista de candidatos **no verificables hoy**, con su razón;
3. si el contexto de equipo estaba vacío, una línea diciéndolo.

Las columnas «decisión» y «razón» **no aparecen en la salida**. Se agregan a mano al pegar la tabla
en `docs/estrategia-automatizacion.md` §3, y ese momento tiene nombre: **la firma**.

### 6.2 · El criterio de terminado

La corrida se considera terminada cuando:

- [ ] cada candidato con fuente de la entrada tiene su fila, y ninguna fila tiene un candidato que no estaba;
- [ ] cada celda tiene un número **o** dice `SIN CONTEXTO` con el dato que falta;
- [ ] las columnas «decisión» y «razón» están ausentes;
- [ ] existen las dos listas aparte (aunque estén vacías y lo digan);
- [ ] la QA puede decir, celda por celda, de dónde salió cada número.

El último punto no lo verifica la skill. **Lo verifica quien firma.**

---

## 7. Cómo se prueba esta skill

Una skill que nunca corrió no es una skill: es un archivo. Estas corridas usan material del propio
repositorio y se repiten **cada vez que se toca este archivo**.

| Prueba | Con qué | Qué tiene que pasar |
|---|---|---|
| **Caso conocido** | la fila `L1` ya firmada a mano en `docs/estrategia-automatizacion.md` §3 — login por pantalla con credenciales válidas, REQ-L04 | reproduce un score defendible (`3·3·3·3 = 12 🟢`) y **no** escribe decisión ni razón |
| **Caso sin contexto** | el mismo candidato, pero **sin** pasarle el contexto de equipo de §1 | escribe `SIN CONTEXTO` en estabilidad y mantenimiento, y dice qué dato necesita |
| **Caso nuevo** | la lista cruda entera de `docs/contrato-api.md` §10, que nunca puntuó | los puntúa con la misma escala, sin inventar endpoints, y separa los que no tienen fuente |

**Cómo se lee el resultado del caso conocido, en las dos ramas:**

| Si… | Entonces… |
|---|---|
| coincide con tu fila firmada | coincide **porque los criterios están escritos**, no porque haya adivinado. Eso es reproducibilidad: otra persona con los mismos criterios llega al mismo número |
| difiere en un número | la pregunta no es quién tiene razón: es **cuál de los dos puntajes se puede respaldar**. Si el tuyo se apoya en algo que la skill no tenía —lo que sabes de tu equipo—, la que corrige el archivo eres tú |

**Y si en el caso sin contexto puntúa igual:** no se dice que la IA se equivocó. Se dice lo que pasó
de verdad: **la línea de límite quedó floja.** Se abre la sección 4 de este archivo, se escribe la
línea que falta, se guarda y **se vuelve a correr**.

> Esa corrección es la lección que sostiene la clase donde nació esta skill: **una skill se corrige
> editando el archivo, no repitiendo el pedido.** Un prompt se arregla escribiendo mejor la próxima
> vez. Una skill se arregla una vez, y queda arreglada para todas las próximas veces.

---

## 8. Si tu herramienta no lee archivos

Esta skill **señala** archivos en vez de copiarlos, y eso funciona con un agente que puede abrir el
repositorio —Antigravity, por ejemplo—.

En una aplicación de chat que no ve tus archivos, el procedimiento no cambia: pegas a mano el
contenido de `docs/estrategia-automatizacion.md` §1 y §2, más tu lista de candidatos, y después este
archivo entero desde la sección 3 hasta la 6. Cambia dónde vive el contexto; **no cambian los pasos,
ni los límites, ni el criterio de terminado**.

---

*Primera skill de `qa-automation-portfolio`. Nace en C7, empaquetando un procedimiento que se ejecutó
a mano tres veces en la misma clase. Se revisa cuando cambian los criterios de
`docs/estrategia-automatizacion.md` §2.*

*Primera skill de `qa-automation-portfolio`... `docs/estrategia-automatizacion.md` §2.*

## Bitácora de corridas

### Corrida del 2026-09-21

- **Qué le pasé:** El contexto de `docs/estrategia-automatizacion.md` §1 y dos candidatos nuevos con fuente: `POST /api/enroll` con un `courseId` inexistente, respaldado por `REQ-A03`, y `POST /api/login` con contraseña incorrecta, respaldado por `REQ-L02`.
- **Qué devolvió bien:** Conservó los candidatos y sus fuentes, propuso frecuencia, riesgo y mantenimiento, no escribió decisiones ni razones y marcó `SIN CONTEXTO` en estabilidad porque no había evidencia de que los comportamientos llevaran meses sin cambiar.
- **Qué tuve que corregirle a mano después:** Resolví el dato faltante asignando estabilidad `2` de manera provisional. Después calculé los totales y las zonas y escribí personalmente las decisiones, razones y condiciones de revisión en el backlog.
- **Qué línea le agregaría a la sección 4 (límites) para que no vuelva a pasar:** Ninguna en esta corrida: la skill respetó el límite existente y no inventó la estabilidad. La resolución provisional de `SIN CONTEXTO` fue una decisión humana posterior.