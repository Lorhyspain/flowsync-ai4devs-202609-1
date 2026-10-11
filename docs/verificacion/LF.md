# Verificación: «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md`. Suite revisada: `backend/tests/` — solo existe `tests/functional/auth/` (`signup`, `login`, `session`, `initials`: 20 tests). Abiertos y leídos uno a uno: ninguno pide una ruta de `/api/v1/tasks` ni afirma nada sobre `assignee`.

**Scenarios del requisito:** 3
**Scenarios cubiertos:** 0

## Matriz de trazabilidad inicial

| # | Scenario (en una línea) | Prueba que lo cubre (nombre en la suite) | Estado | Si «No lo sé», qué faltó |
|---|---|---|---|---|
| 1 | Al obtener una tarea de «Ada Lovelace», su `assignee` trae ese nombre y sus iniciales | — | No lo sé | Se parece `Auth \| iniciales › un nombre de dos palabras da la inicial de cada una`: prueba el getter `User.initials` (el mismo que usa `assignee`), pero vía login, no en una tarea |
| 2 | Ninguna tarea, suelta o en la lista, trae email ni datos de acceso en su `assignee` | — | No cubierto | |
| 3 | Si el responsable se registró sin nombre, `assignee.fullName` llega nulo y las iniciales siguen llegando | — | No lo sé | Se parecen `Auth \| iniciales › sin nombre, las iniciales salen del email` y `Auth \| registro › una cuenta puede quedarse sin nombre`, pero miran la cuenta en login/registro, no una tarea |

> Al revisar (sin tocar código): la tarea suelta (`GET /tasks/:id`) arma el `assignee` con `TaskAssigneeTransformer` (`id`, `fullName`, `initials`), pero la lista, la creación y el cambio de estado usan `TaskTransformer` → `UserTransformer`, que **sí incluye `email`**. El test que falta para la fila 2 debería salir rojo en la lista.

## Las tres líneas

1. **Cubiertos que creía antes de mirar / cubiertos de verdad:** 

   Para ver cuántos escenarios había cubiertos, verifiqué primero cuántos tests había escritos. De esta investigación, la conclusión fue que los tests que había en el proyecto, no eran test unitarios, eran test de integración de autenticación: todos functional de auth; `tests/unit/` no existe, y `tasks` no tiene ninguno:

   | Fichero | Tests | Qué cubre |
   |---|---|---|
   | `signup.spec.ts` | 7 | Registro: devuelve token, nombre opcional, la contraseña no sale, contraseña corta, confirmación distinta, email mal formado, email duplicado |
   | `login.spec.ts` | 4 | Login correcto, contraseña equivocada, email desconocido, email mal formado |
   | `session.spec.ts` | 6 | Perfil con token, sin cabecera, token inventado, logout invalida el token, cerrar una sesión no cierra las demás, registro y login públicos |
   | `initials.spec.ts` | 3 (un test parametrizado) | Iniciales: dos palabras, una palabra, sin nombre (salen del email) |

Puesto que la spec viva de auth hay 45 escenarios, y tenemos 20 tests, pensé que se cubrirían algún escenario, pero el resultado fue que no.

Como necesitaba comprobar cuántos escenarios de la spec viva estaban cubiertos de verdad, generé la matriz de trazabilidad inicial y el resultado fue solo había realmente 3 scenarios de pruebas, 0 cubiertos (1 no cubierto, 2 «no lo sé» por tests de auth que se parecen pero no miran tareas).

2. **Scenario del que no supe si era hueco de test o hueco de spec, y por qué:** 
3. **Algo que el scenario no decidía y tuve que decidir al escribir el test:** 
