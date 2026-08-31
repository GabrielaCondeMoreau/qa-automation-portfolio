# Flujo de IA para diagnosticar fallos de QA

> Úsalo cuando un test falla y necesitas apoyo del agente del IDE sin permitir cambios a ciegas.

## Objetivo

Llegar desde un fallo observable hasta una causa sustentada, un cambio mínimo aprobado y una nueva
ejecución que confirme o refute la propuesta.

## Antes de pedir ayuda

1. Ejecuta el test.
2. Lee la primera causa concreta del error.
3. Identifica el archivo y la línea señalados.
4. Conserva la salida relevante.

No empieces con “arréglalo”. Primero necesitamos evidencia del problema.

## Instrucción reutilizable para el agente

```text
Analiza este fallo sin modificar archivos.

Objetivo: identificar la causa y proponer el cambio mínimo.

Entrega:
1. causa más probable;
2. evidencia observable que la sustenta;
3. archivo y línea relacionados;
4. cambio mínimo propuesto;
5. resultado que deberíamos observar al volver a ejecutar.

Detente y espera mi aprobación antes de modificar cualquier archivo.
```

Adjunta o señala al agente el mensaje del fallo, el archivo relacionado, el comando ejecutado y el
resultado que esperabas observar.

## Gate humano antes de autorizar

- [ ] La causa explica el mensaje que realmente apareció.
- [ ] La evidencia citada existe en la salida o en el archivo.
- [ ] El archivo y la línea corresponden al fallo.
- [ ] El cambio propuesto es el mínimo necesario.
- [ ] No agrega esperas, dependencias ni archivos sin justificación.
- [ ] Puedo predecir qué debería ocurrir después del cambio.

Si alguna respuesta es “no”, no autorices. Pide una corrección o investiga otra hipótesis.

## Después de autorizar

1. **Revisa exactamente qué cambió** — no lo que la IA dijo que cambió:

   ```bash
   git diff
   ```

   Las líneas con `-` son como estaba; las líneas con `+`, como está ahora. Si aparece algo que no
   aprobaste, detente antes de ejecutar.

2. Ejecuta nuevamente el test.
3. Compara el resultado con la predicción.
4. Confirma el resultado en la terminal.

> Para descartar un cambio no aprobado: `git restore <archivo>`. **Siempre con el nombre del
> archivo, nunca con punto** — `git restore .` descarta todo lo no commiteado, incluida tu
> evidencia.

## Condición de parada

El flujo termina únicamente cuando:

- el test relevante fue ejecutado nuevamente;
- el resultado esperado es observable;
- el cambio quedó dentro del alcance aprobado;
- `git diff` muestra únicamente el cambio aprobado.

Un mensaje de la IA como “listo” o “corregido” no es una condición de parada.

## Si la primera propuesta no funciona

No encadenes cambios al azar. Vuelve al último resultado observado y pide:

```text
La propuesta anterior no produjo el resultado esperado. No modifiques nada más.
Compara la predicción con esta nueva salida, descarta la hipótesis anterior si corresponde y propone
el siguiente experimento mínimo. Detente antes de actuar.
```


## Portabilidad a otra IA

El núcleo de este flujo es agnóstico: fallo observable, archivos permitidos, diagnóstico sin cambios,
gate humano, autorización explícita, nueva ejecución y condición de parada.

- **Agente de IDE o CLI:** señala los archivos permitidos y conserva bloqueadas las escrituras hasta
  aprobar el cambio.
- **Aplicación de chat:** pega manualmente el error y el fragmento mínimo; ejecuta tú los comandos y
  devuelve la salida al chat.
- **Otra herramienta agentic:** adapta nombres de comandos, permisos y ubicación de instrucciones;
  no cambies el objetivo, el gate ni la condición de cierre.

Antes de migrar confirma: acceso a archivos, herramientas disponibles, permisos de escritura, datos
que salen del entorno y forma de detener la ejecución. Consulta `Guia-Portabilidad-IA.md`.
