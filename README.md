# QA Automation Portfolio

Proyecto acumulativo de la Ruta QA Automation con IA.

## Qué demuestra hoy

- Puedo instalar y ejecutar un proyecto Playwright.
- Puedo leer la evidencia de un fallo antes de corregirlo.
- Puedo restaurar el verde y guardar el cambio con Git.

## Comandos

```bash
npm install
npx playwright install chromium
npm test
```

## Recursos de trabajo

- `docs/prompt-template.md`: estructura para dirigir una solicitud a la IA.
- `docs/flujo-ia-diagnostico-fallos.md`: flujo para analizar un fallo, validar la propuesta y
  autorizar solamente un cambio mínimo.

## Historia del proyecto

| Sesión | Aporte | Evidencia |
|---|---|---|
| S1 | Criterio para validar salidas de IA | `evidence/s1-validacion-ia.md` |
| S2 | Primer ciclo reproducible y Git | `tests/primer-ciclo.spec.ts` + historial Git |
