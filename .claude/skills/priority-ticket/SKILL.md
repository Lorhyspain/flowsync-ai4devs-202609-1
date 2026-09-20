---
name: priority-ticket
description: Convierte un ticket de Jira en un plan de implementación ajustado a las convenciones de FlowSync. Úsala cuando se pida trabajar, planificar, estimar o "coger" un ticket de Jira, se pase una clave de ticket (FS-123), una URL de Atlassian, o se pida el siguiente ticket asignado. Entrega un plan; no toca archivos.
---

# Priority ticket

Coges un ticket de Jira y devuelves un plan de implementación que alguien de este equipo
podría ejecutar sin volver a preguntar nada. **No escribes código en esta skill.**

## 1. Identifica el ticket

- Si vienen clave (`FS-123`) o URL en los argumentos, ese es el ticket.
- Si no, usa el MCP de Atlassian para listar los tickets asignados al usuario en estado
  «Por hacer», enséñaselos numerados y pregunta cuál. No elijas por él.
- Si el MCP de Atlassian no está disponible, dilo y para. No inventes el contenido del
  ticket ni sigas con lo que te suene del nombre.

Lee el ticket **completo** por el MCP: título, descripción, criterios de aceptación,
etiquetas, y los comentarios (ahí suele estar la mitad del contexto real).

## 2. Resume lo que has entendido

Antes de planificar, escribe en 3-5 líneas: qué pide el ticket, qué criterios de aceptación
tiene y qué queda ambiguo. Si algo bloquea de verdad el plan, pregunta ahora; lo demás lo
resuelves tú y lo marcas como supuesto.

## 3. Sitúalo en el repo

Lee `AGENTS.md` antes de proponer nada: es la guía de arquitectura y convenciones, y manda
sobre cualquier costumbre general de AdonisJS o React. Después localiza los archivos reales
que toca el ticket (búscalos, no los adivines) y decide si es trabajo de `backend/`, de
`frontend/` o de los dos — son dos proyectos npm independientes, y cada comando se lanza
dentro de su directorio.

Comprueba explícitamente las trampas que más se rompen aquí:

- **Migration-first.** `backend/database/schema.ts` es generado y lleva "DO NOT EDIT".
  Un campo nuevo es: migración → `node ace migration:run` → el `@column` aparece solo.
  Los modelos de `app/models/` no declaran columnas, componen la clase generada.
- **`.adonisjs/` es generado.** Incluido el registro `controllers` que usan las rutas y el
  registry de Tuyau. Está commiteado, pero no se edita a mano.
- **Validación con VineJS.** El controller llama a `request.validateUsing(<validador>)` con
  un validador de `#validators/*`. Nunca se valida a mano.
- **Salida vía transformer.** `return serialize(XTransformer.transform(entidad))`, que
  envuelve en `{ data: ... }`. El `return` pelado de `AccessTokensController.destroy` es una
  inconsistencia existente, no un patrón a copiar.
- **Alias de imports** (`#controllers/*`, `#models/*`, ...), nunca rutas relativas largas.
- **Fechas**: Luxon `DateTime` en todas partes.
- **Auth**: el guard por defecto es `api` (access tokens); el guard `web` está configurado
  pero ninguna ruta lo usa.
- **Frontend**: hoy es el scaffold de Vite sin tocar — no hay router, ni cliente HTTP, ni
  estado global. Si el ticket los necesita, elegir esas piezas es parte del plan y hay que
  decirlo, no darlo por hecho.
- **Lint asimétrico**: backend ESLint + Prettier, frontend oxlint (no eslint, no Prettier).
- **Tests**: las suites de Japa existen pero no hay ningún `.spec.ts` todavía; el primero
  que se escriba fija el patrón. Si el ticket merece test, dilo y di dónde iría.
- Dependencias nuevas: solo con justificación explícita.

## 4. Entrega el plan

En este formato, sin relleno:

**Ticket** — clave, título y estado actual.

**Qué hay que conseguir** — los criterios de aceptación en tus palabras, como lista
verificable.

**Archivos a tocar** — tabla con ruta exacta (`backend/app/controllers/foo_controller.ts`),
si es nuevo o modificado, y qué cambia en una línea. Marca aparte los archivos **generados**
que cambiarán solos al correr un comando: no cuentan como trabajo manual.

**Orden de ejecución** — pasos numerados, con el comando literal donde haga falta
(`cd backend && node ace make:migration ...`). El orden importa: migración antes de modelo,
modelo antes de controller.

**Convenciones que condicionan el plan** — nómbralas, una línea cada una, y por qué aplica
aquí. Si el ticket empuja a algo que choca con `AGENTS.md`, señálalo en vez de obedecer al
ticket en silencio.

**Supuestos y riesgos** — lo que has decidido tú, y qué se rompería si el supuesto es falso.

**Verificación** — qué comandos prueban que está hecho (`npm run typecheck`, `npm run lint`,
`node ace test --files="..."`) y qué habría que mirar a mano.

## 5. Para ahí

No edites archivos, no crees migraciones, no instales dependencias y no hagas commit dentro
de esta skill. El plan es el entregable; aplicarlo es una decisión aparte del usuario.
