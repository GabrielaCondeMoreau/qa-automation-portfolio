# Guía base — IA agnóstica para QA

## 1. Separar las capas

| Capa | Qué es | Ejemplos |
|---|---|---|
| Modelo | Motor que interpreta y genera | Claude, Gemini, GPT |
| Aplicación de chat | Interfaz conversacional | Claude, Gemini Apps, ChatGPT |
| CLI | Interfaz que se utiliza escribiendo comandos en una terminal | herramientas CLI de cada proveedor |
| Agente de proyecto | Persigue una meta usando contexto, herramientas, permisos y un ciclo de trabajo | agente del IDE o terminal |
| Skill | Capacidad reutilizable con entrada, procedimiento, límites, salida y cierre | analizar una HU con evidencia |
| Subagente | Agente delegado para una tarea acotada | revisión independiente de accesibilidad |
| Workflow | Secuencia coordinada de pasos, capacidades y gates | generar → revisar → ejecutar → decidir |

Los nombres comerciales cambian. La función de cada capa es la referencia portable.

## 2. Skill, agente y subagente

> **La skill sabe cómo hacer una tarea. El agente decide cuándo y cómo ejecutarla. El subagente
> recibe una parte delimitada del trabajo.**

- Una skill no trabaja de forma autónoma: empaqueta un procedimiento reutilizable.
- Un agente recibe una meta, utiliza herramientas, observa y decide el siguiente paso.
- Un subagente trabaja con una responsabilidad y una salida delimitadas, y devuelve su resultado.
- Una tarea secuencial pequeña no necesita subagentes.

### Ejemplo QA

- **Prompt:** “Encuentra ambigüedades en esta HU”.
- **Skill:** procedimiento estable para leer fuente, citar regla, marcar ambigüedad y detenerse si
  falta información.
- **Agente:** abre la HU y documentos permitidos, usa la skill y produce evidencia.
- **Subagente:** revisa únicamente accesibilidad o regresión como análisis independiente.

## 3. Chat frente a agente de proyecto

Una aplicación de chat responde dentro de una conversación y solo conoce el contexto que recibe o
las conexiones habilitadas.

Un agente de proyecto puede, según la herramienta y los permisos concedidos, leer archivos, buscar,
ejecutar comandos y observar resultados. Que pueda hacerlo no significa que deba autorizarse todo.

Ejemplos de distinción:

- **Claude / Claude Code:** modelo o aplicación conversacional frente a herramienta agentic de
  proyecto disponible en terminal e integraciones.
- **Gemini Apps / experiencia agentic de Google:** conversación general frente a trabajo sobre un
  proyecto mediante Antigravity, IDE o CLI vigente.

Los productos cambian rápidamente. Verifica nombre, disponibilidad, permisos y política de datos
antes de usar una herramienta en el trabajo.

## 4. Qué es CLI

CLI significa *Command-Line Interface*: interfaz de línea de comandos. Se usa desde una terminal:

```bash
git status
npm test
```

La terminal es la ventana o entorno. La CLI es el programa que interpreta comandos. Un modelo no es
una CLI, y una CLI agentic no es solamente un chat con fondo negro.

## 5. Contrato portable de una capacidad

Toda capacidad del curso debe poder describirse sin una marca:

1. objetivo;
2. entrada;
3. fuentes permitidas;
4. procedimiento;
5. herramientas necesarias;
6. límites y acciones prohibidas;
7. formato de salida;
8. autorización;
9. gate humano;
10. condición de cierre.

## 6. Migrar a otra IA

Antes de migrar, separa:

### Núcleo portable

Objetivo, entrada, reglas, procedimiento, salida, gate y cierre.

### Adaptador de herramienta

Ubicación de instrucciones, nombre de carpetas, sintaxis, permisos, comandos y mecanismo para cargar
skills o delegar subagentes.

### Checklist

- [ ] ¿Puede leer archivos o debo pegarlos manualmente?
- [ ] ¿Puede ejecutar comandos?
- [ ] ¿Pide autorización antes de escribir?
- [ ] ¿Dónde conserva instrucciones reutilizables?
- [ ] ¿Cómo limito archivos y herramientas permitidos?
- [ ] ¿Cómo observo la evidencia?
- [ ] ¿Cómo detengo la ejecución?
- [ ] ¿Qué datos pueden salir del entorno laboral?

Si una herramienta solo ofrece chat, conserva el procedimiento pero ejecuta manualmente las acciones
y devuelve la evidencia al chat. No afirmes que tienes un agente si no existe un ciclo con
herramientas y observación.
