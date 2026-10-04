# Cuentas y acceso

## Purpose

Permitir que una persona cree una cuenta en FlowSync, inicie y cierre sesión, consulte su perfil, y que la aplicación web solo le muestre las pantallas que corresponden a su estado de sesión.

## Requirements

### Requirement: Registro de cuenta por la API

El sistema SHALL permitir crear una cuenta enviando nombre completo, email, contraseña y confirmación de contraseña a `POST /api/v1/auth/signup`, y SHALL responder con los datos públicos del usuario creado y un token de acceso que ya permite usar las rutas protegidas.

#### Scenario: Registro correcto

- **WHEN** se envía un email válido que no está registrado, una contraseña de entre 8 y 32 caracteres, la misma contraseña en la confirmación y un nombre completo (o `null`)
- **THEN** la respuesta es correcta (2xx) y su cuerpo es `{ data: { user, token } }`, donde `user` contiene `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt`, y `token` es una cadena utilizable como `Bearer`

#### Scenario: El token del registro abre sesión inmediatamente

- **WHEN** se acaba de registrar una cuenta y se pide el perfil con el token devuelto
- **THEN** el perfil devuelto corresponde a la cuenta recién creada, sin necesidad de iniciar sesión aparte

#### Scenario: La contraseña nunca viaja de vuelta

- **WHEN** se registra una cuenta
- **THEN** la respuesta no contiene la contraseña ni ningún derivado de ella

### Requirement: Validación del registro

El sistema SHALL rechazar con un 422 cualquier registro que no cumpla las reglas de los campos, devolviendo `{ errors: [...] }` con un elemento por fallo que indica el campo (`field`), la regla incumplida (`rule`) y un mensaje.

#### Scenario: Email ya registrado

- **WHEN** se intenta registrar un email que ya pertenece a otra cuenta, escrito exactamente igual
- **THEN** la respuesta es 422 con un error sobre `email` con regla `database.unique`, y no se crea una segunda cuenta

#### Scenario: Email con formato inválido o demasiado largo

- **WHEN** el email no tiene formato de email o supera los 254 caracteres
- **THEN** la respuesta es 422 con un error sobre `email`

#### Scenario: Contraseña fuera de longitud

- **WHEN** la contraseña tiene menos de 8 caracteres o más de 32
- **THEN** la respuesta es 422 con un error sobre `password` con regla `minLength` o `maxLength`

#### Scenario: Confirmación distinta

- **WHEN** la confirmación de contraseña no coincide con la contraseña
- **THEN** la respuesta es 422 con un error sobre `passwordConfirmation` con regla `sameAs`

#### Scenario: Nombre completo ausente

- **WHEN** el cuerpo no incluye la clave `fullName` (ni siquiera con valor `null`)
- **THEN** la respuesta es 422 con un error sobre `fullName`

#### Scenario: Nombre completo nulo

- **WHEN** se envía `fullName: null` y el resto de campos es válido
- **THEN** la cuenta se crea y el `fullName` del usuario devuelto es `null`

### Requirement: Inicio de sesión por la API

El sistema SHALL emitir un token de acceso nuevo cuando se envían a `POST /api/v1/auth/login` un email y una contraseña que corresponden a una cuenta existente, con el mismo formato de respuesta que el registro.

#### Scenario: Credenciales correctas

- **WHEN** se envían el email y la contraseña de una cuenta existente
- **THEN** la respuesta es correcta (2xx) con `{ data: { user, token } }`, y el token permite acceder a las rutas protegidas

#### Scenario: Cada inicio de sesión emite un token distinto

- **WHEN** la misma cuenta inicia sesión dos veces
- **THEN** recibe dos tokens distintos y ambos siguen siendo válidos a la vez

#### Scenario: Credenciales incorrectas

- **WHEN** el email no corresponde a ninguna cuenta, o la contraseña no es la de esa cuenta
- **THEN** la respuesta es 400 con `{ errors: [...] }` sin campo asociado, y la respuesta es la misma en los dos casos, sin revelar cuál de los dos falló

#### Scenario: Petición de inicio de sesión mal formada

- **WHEN** falta el email o la contraseña, o el email no tiene formato de email
- **THEN** la respuesta es 422 con un error por campo, sin llegar a comprobar las credenciales

### Requirement: Acceso autenticado por token

El sistema SHALL exigir un token de acceso válido en la cabecera `Authorization: Bearer <token>` para consultar el perfil y para cerrar sesión, y SHALL rechazar con un 401 cualquier petición a esas rutas sin token, con un token desconocido o con un token revocado.

#### Scenario: Sin token

- **WHEN** se pide `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin cabecera `Authorization`
- **THEN** la respuesta es 401 con `{ errors: [...] }`

#### Scenario: Token inválido

- **WHEN** se envía un token que el sistema no ha emitido o que ya se revocó
- **THEN** la respuesta es 401

### Requirement: Consulta del perfil

El sistema SHALL devolver en `GET /api/v1/account/profile` los datos públicos de la cuenta a la que pertenece el token, envueltos en `{ data: ... }`.

#### Scenario: Perfil propio

- **WHEN** se pide el perfil con un token válido
- **THEN** la respuesta es 200 con `{ data: { id, fullName, email, initials, createdAt, updatedAt } }` de la cuenta dueña del token, sin la contraseña

### Requirement: Iniciales del usuario

El sistema SHALL incluir en los datos públicos del usuario unas iniciales en mayúsculas, calculadas a partir del nombre completo o, si no lo hay, del email.

#### Scenario: Nombre con al menos dos palabras

- **WHEN** el nombre completo es «Ada Lovelace»
- **THEN** las iniciales son «AL»

#### Scenario: Nombre de una sola palabra

- **WHEN** el nombre completo es «Ada»
- **THEN** las iniciales son las dos primeras letras en mayúsculas, «AD»

#### Scenario: Sin nombre

- **WHEN** el nombre completo es `null` y el email es `ana@ejemplo.com`
- **THEN** las iniciales son la primera letra de la parte local y la primera del dominio, «AE»

### Requirement: Cierre de sesión por la API

El sistema SHALL revocar el token con el que se hace la petición a `POST /api/v1/account/logout`, de modo que deje de servir, sin afectar a otros tokens de la misma cuenta.

#### Scenario: Cierre correcto

- **WHEN** se cierra sesión con un token válido
- **THEN** la respuesta es 200 con `{ message: "Logged out successfully" }`, y una petición posterior al perfil con ese mismo token responde 401

#### Scenario: Otros tokens siguen vivos

- **WHEN** una cuenta tiene dos tokens y cierra sesión con uno
- **THEN** el otro sigue permitiendo consultar el perfil

### Requirement: Respuestas siempre en JSON

El sistema SHALL responder en JSON a cualquier petición de la API, incluidos los errores, aunque el cliente no lo pida expresamente.

#### Scenario: Error sin cabecera Accept

- **WHEN** se hace una petición que falla (validación, credenciales o falta de autenticación) sin cabecera `Accept`
- **THEN** el cuerpo del error es JSON con la forma `{ errors: [...] }`, no una página HTML

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register` un formulario con nombre completo (marcado como opcional), email, contraseña (con la indicación «Entre 8 y 32 caracteres.») y repetición de contraseña, que al enviarse crea la cuenta y deja a la persona dentro con la sesión iniciada.

#### Scenario: Registro correcto desde la pantalla

- **WHEN** una persona sin sesión rellena el formulario con datos válidos y pulsa «Crear cuenta»
- **THEN** el botón muestra «Creando cuenta…» y queda deshabilitado mientras se envía, y al terminar la persona aparece en su perfil con la sesión iniciada

#### Scenario: Nombre vacío

- **WHEN** la persona deja el nombre vacío o solo con espacios
- **THEN** la cuenta se crea sin nombre y el perfil muestra «Sin nombre»

#### Scenario: Contraseñas que no coinciden

- **WHEN** la contraseña y su repetición son distintas y se pulsa «Crear cuenta»
- **THEN** aparece «Las contraseñas no coinciden.» bajo la repetición de contraseña, sin que se llegue a enviar nada al servidor

#### Scenario: Email ya registrado

- **WHEN** el email ya pertenece a una cuenta
- **THEN** aparece bajo el campo de email «Ese email ya está registrado. Inicia sesión en su lugar.»

#### Scenario: Errores de validación del servidor

- **WHEN** el servidor rechaza el registro por las reglas de los campos
- **THEN** cada campo con error muestra debajo un mensaje en castellano (por ejemplo «la contraseña debe tener al menos 8 caracteres.»), y no se muestra aviso general si todos los errores tienen campo en pantalla

#### Scenario: Enlace a inicio de sesión

- **WHEN** la persona pulsa «Inicia sesión» bajo el formulario
- **THEN** llega a la pantalla de inicio de sesión

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login` un formulario de email y contraseña que, con credenciales correctas, deja a la persona dentro con la sesión iniciada.

#### Scenario: Inicio de sesión correcto

- **WHEN** una persona sin sesión introduce credenciales correctas y pulsa «Entrar»
- **THEN** el botón muestra «Entrando…» y queda deshabilitado mientras se envía, y al terminar aparece en su perfil

#### Scenario: Credenciales incorrectas

- **WHEN** las credenciales no son correctas
- **THEN** aparece un aviso general «El email o la contraseña no son correctos.» y la persona sigue en la pantalla de inicio de sesión

#### Scenario: Campos mal rellenados

- **WHEN** se envía el formulario con el email vacío o con formato inválido, o sin contraseña
- **THEN** el mensaje de error aparece bajo el campo afectado

#### Scenario: Servidor inaccesible

- **WHEN** el servidor no responde al enviar el formulario
- **THEN** aparece el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

#### Scenario: Enlace a registro

- **WHEN** la persona pulsa «Crea una» bajo el formulario
- **THEN** llega a la pantalla de registro

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar en `/profile`, a quien tiene sesión, sus iniciales, su nombre completo (o «Sin nombre»), su email, la fecha de alta como «Miembro desde» en formato largo en castellano, y un botón para cerrar sesión.

#### Scenario: Ver el perfil

- **WHEN** una persona con sesión abre `/profile`
- **THEN** ve sus iniciales en un círculo, su nombre o «Sin nombre», su email y «Miembro desde» con una fecha del estilo «4 de octubre de 2026»

#### Scenario: Cerrar sesión

- **WHEN** la persona pulsa «Cerrar sesión»
- **THEN** el botón muestra «Cerrando sesión…», la persona acaba en la pantalla de inicio de sesión sin ningún aviso, y al recargar la página sigue sin sesión

#### Scenario: Cerrar sesión con el servidor caído

- **WHEN** la persona pulsa «Cerrar sesión» y el servidor no responde
- **THEN** la sesión se cierra igualmente en el navegador y la persona acaba en la pantalla de inicio de sesión

### Requirement: Persistencia de la sesión en el navegador

La aplicación web SHALL conservar la sesión entre recargas y pestañas del mismo navegador, y SHALL volver a validarla contra el servidor cada vez que se carga la aplicación.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión recarga la página
- **THEN** ve un indicador de carga mientras se valida la sesión y después sigue dentro, sin pasar por la pantalla de inicio de sesión

#### Scenario: Sesión rechazada por el servidor

- **WHEN** se carga la aplicación con una sesión guardada que el servidor ya no reconoce
- **THEN** la persona acaba en la pantalla de inicio de sesión con el aviso «Tu sesión ha caducado. Vuelve a iniciar sesión.», y la sesión guardada se descarta

#### Scenario: Servidor caído al cargar

- **WHEN** se carga la aplicación con una sesión guardada y el servidor no responde
- **THEN** la persona acaba en la pantalla de inicio de sesión con un aviso de que no se pudo conectar, pero la sesión guardada se conserva y, al recargar con el servidor ya disponible, vuelve a estar dentro

### Requirement: Protección de pantallas según la sesión

La aplicación web SHALL mostrar el perfil solo a quien tiene sesión y las pantallas de inicio de sesión y registro solo a quien no la tiene, redirigiendo en cada caso sin que la persona vea la pantalla que no le toca.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** se la lleva a `/login`

#### Scenario: Acceso con sesión

- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** se la lleva a `/profile`

#### Scenario: Ruta desconocida

- **WHEN** alguien abre una dirección que no es `/login`, `/register` ni `/profile`
- **THEN** se le lleva a `/profile`, y desde ahí a `/login` si no tiene sesión

#### Scenario: Sin redirección prematura mientras se valida

- **WHEN** la aplicación aún está validando una sesión guardada
- **THEN** se muestra un indicador de carga en lugar de redirigir

---

## Parte B

### 1. Requisitos escritos y comprobados

- Escritos por el agente: 13 requisitos (43 escenarios).
- Comprobados por mí abriendo el código: Ninguno.

### 2. Incoherencias que aparecieron al escribirla

_Detectadas por el agente al redactar; pendientes de contrastar._

- El cierre de sesión responde `{ message: ... }` sin el envoltorio `{ data: ... }` que usan el registro, el inicio de sesión y el perfil (`POST /api/v1/account/logout`).
- La contraseña se limita a 8–32 caracteres al registrarse, pero al iniciar sesión se acepta cualquier longitud (`POST /api/v1/auth/login` frente a `POST /api/v1/auth/signup`).
- La pantalla de registro no muestra el aviso de sesión perdida que sí muestra la de inicio de sesión (pantallas `/register` frente a `/login`).
- Cualquier 401 se presenta en pantalla como «Tu sesión ha caducado», aunque la causa sea un token revocado o inventado, no caducado; y cualquier 400 se presenta como credenciales incorrectas.
- Los mensajes de error de campo empiezan en minúscula («la contraseña debe tener…») mientras el resto de mensajes empieza en mayúscula (pantalla `/register`).
- El nombre completo se declara opcional en pantalla, pero la API exige que la clave `fullName` venga siempre, aunque sea con `null`.

### 3. Lo que no supe decidir si era bug o contrato

- **Mayúsculas en el email:** `ana@x.com` y `Ana@x.com` pueden registrarse como dos cuentas distintas y el inicio de sesión distingue mayúsculas. Lectura A: el email se trata como un identificador literal y es intencionado. Lectura B: es la misma persona y debería normalizarse. 
- **Iniciales sin nombre:** para `ana@ejemplo.com` salen «AE» (local + dominio). Lectura A: es la regla elegida para cuando no hay nombre. Lectura B: salió así por reutilizar el mismo reparto que con nombre y apellido, y se esperaría «AN».
- **Los tokens no caducan nunca:** un token sigue sirviendo hasta que se cierra sesión con él, y cada inicio de sesión acumula uno más. Lectura A: decisión de simplicidad para el MVP. Lectura B: falta configurar la caducidad; además no se puede confirmar desde fuera sin esperar.
- **Servidor caído al cargar:** la persona ve la pantalla de inicio de sesión aunque su sesión siga guardada. Lectura A: el comportamiento deseado es no echarla del todo. Lectura B: debería poder ver un estado de «sin conexión» en lugar de una pantalla de inicio de sesión que parece decir que no tiene sesión.


