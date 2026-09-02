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
