# Cómo pedirle selectores a la IA

> **Esto es lo único que te llevas de S3, y es lo único que vas a usar.** No es un documento para
> llenar: es un procedimiento para repetir. Vive en tu repositorio porque lo vas a volver a abrir
> cada vez que tengas que automatizar una pantalla nueva.

## El ciclo, en tres movimientos

1. **Copias el HTML del elemento** — en DevTools: clic derecho sobre el nodo → Copy → **Copy outerHTML**.
2. **Pegas la instrucción de abajo + ese HTML** en la IA, en un solo mensaje.
3. **Compruebas cada propuesta en DevTools** antes de aceptar ninguna.

El paso 3 no se delega. Es el único que te pagan.

## La instrucción

```text
Analiza únicamente el outerHTML que te entrego. No modifiques archivos.

Objetivo: proponer hasta tres selectores CSS para encontrar este elemento.

Para cada opción:
1. escribe el selector literal;
2. señala qué atributo o texto del HTML utilizaste;
3. explica un posible riesgo de estabilidad;
4. indica cómo puedo comprobarlo en DevTools.

Usa solamente atributos o texto presentes en el HTML. No escribas el test completo.
Detente para que yo valide las propuestas en el DOM real.

outerHTML:
[PEGAR AQUÍ]
```

### Por qué esas frases y no otras

| Frase | Qué hace |
|---|---|
| *“Analiza únicamente el outerHTML que te entrego”* | Le acota la fuente. Sin eso propone lo que suele haber en un login, no lo que tienes delante |
| *“Usa solamente atributos o texto presentes en el HTML”* | La misma idea al revés: que no invente un `data-testid` que no existe |
| *“Detente para que yo valide”* | El gate. Sin esa frase, un agente con permisos escribe el test solo |
| *“Indica cómo puedo comprobarlo en DevTools”* | Te da **la forma de verificarlo**, no una promesa de que está bien |

## Cómo compruebas una propuesta

En DevTools, pestaña **Elements**, `Ctrl+F` o `Cmd+F`, pegas el selector. Miras **dos cosas**:

1. **¿Cuántas coincidencias?**
2. **¿El elemento resaltado es el que querías?**

Un número solo no es una comprobación. `1` puede ser un elemento equivocado.

## Qué hacer con lo que te devuelve

- **Si te da una recomendación o dice que una opción es “la más robusta”:** léela como una opinión.
  No se lo pediste, y la estabilidad no se puede demostrar mirando un HTML — depende de si el equipo
  se compromete a mantener ese atributo.
- **Si una propuesta no dice de qué atributo salió:** no la compruebes. Ya sabes qué hacer con ella.
- **Si te propone comprobar con `document.querySelector` en la Console:** es válido, hace lo mismo.
  La búsqueda de Elements resalta el elemento en la página, así ves cantidad **e** identidad de una.
- **Si empieza a escribir el test:** se salió del alcance. Pídele que vuelva y se detenga.

## Antes de pegar nada en una IA

Revisa que el fragmento no lleve datos privados, tokens ni credenciales reales. En este playground
son de demostración. En tu empresa esto se revisa siempre, sin excepción.

## De qué depende cada tipo de selector

No hay un ganador universal. Lo que se rompe no es el selector: es aquello de lo que depende.

| Forma | De qué depende | Se rompe cuando |
|---|---|---|
| `#email` | de un `id` | alguien lo renombra en un refactor |
| `[data-testid="…"]` | de un **acuerdo del equipo** | nadie se comprometió a mantenerlo |
| `[type="email"]` | del tipo del campo | aparece un segundo campo del mismo tipo |
| `.clase-visual` | de la apariencia | hay un rediseño |
| `form div > input` | de la estructura | alguien agrega un contenedor |

Y un aviso que te va a ahorrar una mañana: **el mismo `id` puede existir en otra página.** `#email`
no identifica *el email del login*: identifica *el email de la página que esté abierta*.

## En S4

A esto le vamos a sumar los locators de Playwright (`getByRole`, `getByLabel`, `getByText`), que
buscan por **cómo una persona percibe** el elemento — un criterio que CSS no puede expresar. Y ahí sí
vas a registrar decisiones, porque vas a tener algo que hoy no tienes: **evidencia de una ejecución**,
no de una mirada.

# Refinamiento de S4

Hoy le sumamos a lo anterior funciones de Playwright como `getByLabel` y `getByRole`. Por ejemplo,
`getByLabel('Email')` busca el campo asociado a la etiqueta Email, y
`getByRole('button', { name: 'Iniciar sesión' })` busca el botón con ese nombre.

## LEES · Instrucción de refinamiento

```text
Para cada selector CSS ya comprobado, propone un locator de Playwright que represente cómo una
persona reconoce el elemento. Usa solo información observable en el HTML entregado. Señala qué
condición podría hacer fallar tu propuesta. No modifiques archivos y detente para que yo valide.

Ejemplo del formato esperado: para un campo con la etiqueta visible Email, una propuesta puede ser
page.getByLabel('Email'). Explica siempre qué texto, etiqueta o rol del HTML respalda la propuesta.
```

Comparada con la instrucción de S3 cambió una cosa y se agregó otra:

- **Cambió el criterio:** ya no pedimos "cómo está construido" sino "cómo lo reconoce una persona".
- **Se agregó:** *"señala qué condición podría hacer fallar tu propuesta"*. No le pedimos que nos diga
  que su respuesta es buena, sino **cuándo dejaría de serlo**.

## ESCRIBES · Comparación CSS ↔ locator

> **Por qué aquí sí se escribe y en S3 no.** La columna que manda es **Evidencia ejecutable**: lo que
> devolvió `npm test`. Un locator sin ejecutar sigue siendo una propuesta, y una propuesta no se
> registra.

| Elemento | Selector CSS | Locator de Playwright propuesto | Evidencia ejecutable | Decisión y límite |
|---|---|---|---|---|
| Campo email | `#email` | `page.getByLabel('Email')` | `1 passed`; único y visible | Aceptado; depende de que la etiqueta `Email` siga asociada al campo y lo identifique de forma única |
| Campo contraseña | `#password` | `page.getByLabel('Contraseña')` | `1 passed`; único y visible | Aceptado; depende de que la etiqueta `Contraseña` siga asociada al campo y lo identifique de forma única |
| Botón Iniciar sesión | `button[type="submit"]` | `page.getByRole('button', { name: 'Iniciar sesión' })` | `1 passed`; único y visible | Aceptado; depende de que conserve el rol `button` y el nombre accesible `Iniciar sesión` |
| Caso donde conservamos CSS o test id (opcional) | | No aplica | | |

La última fila es opcional. Complétala solo si encuentras un caso real donde el elemento no tiene una
señal que la persona perciba —por ejemplo, un contenedor sin nombre visible— o donde el equipo mantiene
un atributo para pruebas. **No inventes un caso ni una ejecución para llenar la fila.**

## ESCRIBES · Elemento nuevo pedido a la IA, verificado ejecutando

> Elige un elemento que **no** esté arriba. Pídele a la IA **un** locator con la instrucción de
> refinamiento, pégalo en la única línea marcada de `tests/comprobar-propuesta-ia.spec.ts` y ejecuta:
>
> ```bash
> npm test -- tests/comprobar-propuesta-ia.spec.ts
> ```

| Elemento | Locator propuesto por la IA | Condición de fallo que ella señaló | Resultado de la ejecución | Decisión |
| Título de la página | `page.getByRole('heading', { name: 'Iniciar sesión' })` | Fallaría si deja de ser un encabezado, cambia su nombre accesible o aparece otro encabezado con el mismo nombre | `1 passed`; encontró un único elemento visible | Aceptado; la propuesta quedó confirmada por la ejecución |
| Título de la página | | | `1 passed` / `Expected: 1` `Received: …` | |

**Gate:** no es "¿la IA acertó?". Es **puedo decir de dónde salió cada cosa**: qué propuso, qué
condición de fallo declaró y qué devolvió el comando. Un locator no es un test: la IA no escribió ni
una línea de ese archivo.

## Cierre de S4

- [ ] Las tres filas obligatorias tienen su CSS y su locator de Playwright al lado.
- [ ] Cada locator fue **ejecutado**, no solo leído.
- [ ] Si encontré un caso real para conservar CSS o test id, completé la fila opcional con su razón.

## Pregunta abierta para S5

Ya tienes locators que encuentran el elemento correcto. ¿Qué falta para que eso sea una **prueba**?
Encontrar un elemento no es todavía comprobar que la aplicación hace lo que promete.

## Preparación para S5

Completa esta sección siguiendo `Tarea-S5-Consigna.md`:

1. ¿Qué línea abre la página?

   `await page.goto(LOGIN_URL);`

2. ¿Qué tres locators se crean?

   - `const email = page.getByLabel('Email');`
   - `const password = page.getByLabel('Contraseña');`
   - `const submit = page.getByRole('button', { name: 'Iniciar sesión' });`

3. ¿Qué se comprueba primero: cantidad o visibilidad?

   Primero se comprueba la cantidad con `toHaveCount(1)` y después la visibilidad con `toBeVisible()`.

4. ¿Qué palabra se repite antes de las acciones y comprobaciones?

   La palabra `await`.

> Creo que `await` sirve para _esperar que cargue el elemento___________. En S5 lo comprobaremos ejecutando el código.