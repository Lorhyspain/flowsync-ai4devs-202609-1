## Matriz de trazabilidad inicial

| # | Scenario (en una línea) | Prueba que lo cubre (nombre en la suite) | Estado | Si «No lo sé», qué faltó |
|---|---|---|---|---|
| 1 | Al obtener una tarea de «Ada Lovelace», su `assignee` trae ese nombre y sus iniciales | — | No lo sé | Se parece `Auth \| iniciales › un nombre de dos palabras da la inicial de cada una`: prueba el getter `User.initials` (el mismo que usa `assignee`), pero a través del login, no en una tarea |
| 2 | Ninguna tarea, suelta o en la lista, trae email ni datos de acceso en su `assignee` | — | No cubierto | |
| 3 | Si el responsable se registró sin nombre, `assignee.fullName` llega nulo y las iniciales siguen llegando | — | No lo sé | Se parecen `Auth \| iniciales › sin nombre, las iniciales salen del email` y `Auth \| registro › una cuenta puede quedarse sin nombre`, pero los dos miran la cuenta en login/registro, no una tarea |

> Nota de la revisión (sin tocar código): la tarea suelta (`GET /tasks/:id`) arma el `assignee` con `TaskAssigneeTransformer`, que solo devuelve `id`, `fullName` e `initials`. En cambio, la lista, la creación y el cambio de estado usan `TaskTransformer` → `UserTransformer`, que **sí incluye `email`** (y también `createdAt`/`updatedAt` de la cuenta). El test que falta para la fila 2 debería salir rojo en la lista.

## Matriz de trazabilidad actualizada

> Se mantiene al día a medida que se añaden tests. Última ejecución: 2026-10-11, `node ace test functional --files=tasks/assignee` → 2 en verde, 1 en rojo.

**Scenarios del requisito:** 3
**Scenarios cubiertos:** 3 (2 en verde, 1 en rojo)

| # | Scenario (en una línea) | Prueba que lo cubre (nombre en la suite) | Estado | Si «No lo sé», qué faltó |
|---|---|---|---|---|
| 1 | Al obtener una tarea de «Ada Lovelace», su `assignee` trae ese nombre y sus iniciales | `Tasks \| responsable › el responsable llega con su nombre y sus iniciales` (`tests/functional/tasks/assignee.spec.ts`) | Cubierto · ✅ verde | |
| 2 | Ninguna tarea, suelta o en la lista, trae email ni datos de acceso en su `assignee` | `Tasks \| responsable › la tarea no filtra el email ni otros datos de la cuenta` (`tests/functional/tasks/assignee.spec.ts`) | Cubierto · ❌ rojo | |
| 3 | Si el responsable se registró sin nombre, `assignee.fullName` llega nulo y las iniciales siguen llegando | `Tasks \| responsable › un responsable sin nombre llega con nombre nulo e iniciales` (`tests/functional/tasks/assignee.spec.ts`) | Cubierto · ✅ verde | |

> Fila 2 en rojo, y se entrega en rojo: la tarea suelta pasa, pero en la lista (`GET /tasks`) el `assignee` trae `email` (`expected { id: 1, …(5) } to not have nested property 'email'`). La causa es la de la nota de arriba: `TaskTransformer` reutiliza `UserTransformer`. No se ha tocado el código.
>
> Los tres tests miran la tarea por los dos caminos para «obtenerla»: suelta (`GET /tasks/:id?today=…`) y dentro de la lista (`GET /tasks`). No miran la respuesta de la creación (`POST /tasks`) ni la del cambio de estado (`PATCH /tasks/:id/status`), que usan el mismo `TaskTransformer` que la lista.

## Las tres líneas

1. **Cubiertos que creía antes de mirar / cubiertos de verdad:** 

**Scenarios cubiertos antes de mirar:** 20 
**Scenarios cubiertos antes de escribir nuevos tests:** 0

2. **Scenario del que no supe si era hueco de test o hueco de spec, y por qué:** 
 - openspec/specs/tasks/spec.md, scenario «Responsable sin nombre»: dice que las iniciales llegan «para que la interfaz pueda representarlo sin recurrir a su email».                                          
 - openspec/specs/auth/spec.md:148, scenario «Cuenta sin nombre»: dice que sin nombre las iniciales se derivan del email (ada@example.com → AE)

Una spec pide no recurrir al email y la otra calcula las inciales justo a partir del email. Parece un hueco en las specs.

3. **Algo que el scenario no decidía y tuve que decidir al escribir el test:**

En el scenario 2 («La tarea no filtra datos de cuenta») hubo que decidir qué campos puede traer el `assignee`, y el test exige exactamente `id`, `fullName` e `initials`. El scenario solo prohíbe «el email y cualquier otro dato de acceso», y el requisito dice «nombre e iniciales» y «ningún otro dato de esa cuenta». **El `id` no aparece en ninguno de los dos**: lo di por bueno porque lo admite el `design.md` del change archivado `add-task-list`, no la spec. Si el `id` cuenta como «otro dato», el test es demasiado permisivo; si no cuenta, la spec debería decirlo.
 
