# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Registra a partir de ahora en el fichero prompts.md todos los prompts que te haga con el formato especificado en dicho fichero
```

**Qué salió:** funcionó a la primera; se borró el ejemplo y se registró este prompt.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Verifica si en este proyecto hay tests codificados
```

**Qué salió:** solo hay tests functional de auth en el backend (4 ficheros); nada de tasks, ni unit, ni frontend.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lee los escenarios de la spec viva de esta feature y los tests existentes y una matriz de trazabilidad con el formato indicado en el fichero README.md apartado A.1 en la siguiente ubicación: docs/verificacion/LF.md
```

**Qué salió:** matriz creada: 3 scenarios, 0 cubiertos (1 no cubierto, 2 «no lo sé» por tests de auth que se parecen pero no miran tareas).

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En el fichero LF.md genera las tres líneas que se requieren en esta práctica, en la parte B, pero no las rellenes, eso lo haré yo más adelante.
```

**Qué salió:** añadido el apartado con las tres líneas vacías al final de LF.md.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
En el fichero en la sección "Las tres líneas", apartado 1 incluye al final del punto 1. el cuadro de resumen con los test unitarios actualmente incluidos en el proyecto.
```

**Qué salió:** añadida la tabla resumen bajo el punto 1; se aclara que no son unitarios sino functional de auth.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
en que rama estoy?
```

**Qué salió:** respondió la rama actual.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lee la spec viva del proyecto y los test existentes y actualiza la matriz de trazabilidad inicial, incluida en el fichero LF.md
```

**Qué salió:** matriz re-verificada abriendo los 20 tests: sigue 0/3; afinado el «qué faltó» y añadida nota de que la lista serializa el `assignee` con `email` (`TaskTransformer` → `UserTransformer`).
