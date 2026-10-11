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
Actualiza la matriz de trazabilidad del fichero LF.md con la matriz de trazabilidad del proyecto. Rellena la matriz con el formato especificado en el fichero README.md
```

**Qué salió:** matriz de LF.md re-verificada contra la suite y el código: sigue con 3 scenarios y 0 cubiertos; se añadió la nota de que la lista expone el `email` del `assignee` mediante `UserTransformer`.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
escribe los tests que faltan (uno por escenario), siguiendo el estilo de los que ya exiten en el proyecto en backend/tests/functional/task y genera en el fichero LF.md una nueva matriz de trazabilidad que podrás ir actualizando si añadimos más tests. No modifiques la matriz inicial de trazabilidad que hemos creado anteriormente. No toquees nada fuera de la carpeta de tests. Pase lo que pase, no arregles el código, y no aflojes el test para que pase. Si algo se pone rojo, se queda rojo y se entrega rojo: hoy toca saber qué está mal, no taparlo. Quien verifica no arregla, porque quien arregla deja de ver.
```

**Qué salió:** `backend/tests/functional/tasks/assignee.spec.ts` con 3 tests (uno por scenario); 2 en verde y 1 en rojo (la lista expone `email` en el `assignee`). Nueva matriz «actualizada» en LF.md, la inicial intacta.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ayúdame a identificar qué podría revisar para rellenar el punto 2 de la sección "Las tres líneas" del fichero LF.md
```

**Qué salió:** pistas de qué revisar (spec de tasks vs. spec de auth, design.md del change archivado, el `id` del assignee y las respuestas de crear/cambiar estado), sin rellenar la línea.

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ahora ayúdame a rellenar el punto 3. del apartado "Las tres líneas"
```

**Qué salió:** rellenado el punto 3 con la decisión del `id` en el `assignee` (el test lo admite; la spec no lo menciona, solo el design.md).

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
haz el commit y abre el PR
```

**Qué salió:** commit de la matriz, los tests y prompts.md, y PR abierto.
