---
name: commit
description: Crea uno o varios commits de git con mensajes en Conventional Commits en español, siguiendo el estilo real de este repo. Úsala cuando se pida commitear, "haz commit", guardar o registrar los cambios en git, o partir el trabajo pendiente en commits coherentes. No hace push.
---

# Commit

Conviertes el trabajo pendiente en commits que alguien pueda leer dentro de seis meses.
**No haces push.**

## 1. Mira el estado antes de decidir nada

```bash
git status --short
git diff              # sin stagear
git diff --staged     # ya stageado
git log -15 --format='%s'
```

El `git log` no es decoración: el estilo vivo del repo manda sobre lo que diga esta skill.
Si divergen, sigue el repo y dilo.

Dos paradas en seco antes de seguir:

- **Rama `main` o `master`** → no commitees. Di en qué rama estás y pregunta si quiere una
  rama nueva.
- **git sin identidad** (`git config user.email` vacío) → para y pregunta qué nombre y email
  usar. No la inventes ni escribas config global por tu cuenta. En esta máquina no está
  configurada: los commits antiguos son del mentor.

## 2. Decide qué entra en cada commit

Nunca `git add -A` a ciegas. Repasa el `status` fichero a fichero y stagea rutas explícitas.

**Nunca se commitea:** `backend/.env` (solo se versiona `.env.example`), `backend/tmp/`
(ahí vive la base SQLite), ni ninguna clave, token o `APP_KEY` con valor real. Si aparece
algo así en el diff, para y avisa — aunque el usuario haya pedido commitear todo.

**Archivos generados que SÍ van al commit**, pegados al cambio que los provoca y no en un
commit aparte:

- `backend/.adonisjs/**` — el registro de controllers y el registry de Tuyau. Están
  commiteados a propósito; se regeneran al arrancar el dev server o al compilar.
- `backend/database/schema.ts` — lo reescribe `node ace migration:run`.

Si esos archivos han cambiado pero el trabajo real no los tocaba, di por qué antes de
arrastrarlos al commit (suele ser que se arrancó el dev server).

**Un commit = un cambio coherente.** Si hay dos cosas sin relación, son dos commits, con
`git add` de sus rutas por separado. Si el usuario pidió "un commit" y ves tres cambios
independientes, propón la división en una línea y hazla salvo que diga lo contrario.

## 3. Comprueba antes de commitear

Solo en los proyectos tocados — son dos proyectos npm independientes:

```bash
cd backend  && npm run lint && npm run typecheck
cd frontend && npm run lint      # oxlint, no eslint
```

Si algo falla, di qué falla y para. No commitees roto, y **nunca** `--no-verify`.

## 4. Escribe el mensaje

Conventional Commits, **asunto en español**, en minúscula, sin punto final, máximo ~72
caracteres. Tipos que usa el repo: `feat`, `fix`, `docs`, `chore` (más `refactor` y `test`
cuando apliquen). El scope es el área real (`backend`, `frontend`, `harness`, `s1`,
`slides`) y se omite si no aporta.

Ejemplos reales de este repo:

```
fix(backend): repo utilizable tras clone en limpio
docs(s1): enunciado del ejercicio y plantilla de prompts en la rama de partida
chore: docs mentor-facing movidas a la rama 'mentor'
```

El cuerpo es opcional y sirve para el **porqué**, no para el qué: el diff ya cuenta el qué.
Úsalo cuando la decisión no sea obvia, y envuelve a ~80 columnas.

Atribución: añade la línea `Co-Authored-By:` que tenga configurada la sesión, tal cual.
Si la sesión no dicta ninguna, no te la inventes.

## 5. Ejecuta

Mensajes multilínea por stdin, nunca encadenando `-m`:

```bash
git add <rutas explícitas>
git commit -F - <<'MSG'
tipo(scope): asunto

Cuerpo, si hace falta.
MSG
```

Termina enseñando `git log -1 --stat` y para ahí.

## 6. Prohibido

Push, `--force`, `--no-verify`, `--amend` sobre commits ya subidos, commitear en
`main`/`master`, y tocar `.gitignore` para colar un archivo que no debería entrar.
