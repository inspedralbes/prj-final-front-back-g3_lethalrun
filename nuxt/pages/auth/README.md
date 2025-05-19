# 🔐 pages/auth/

El subdirectorio `auth/` dentro de `pages/` está dedicado a gestionar todo el **flujo de autenticación de usuarios** en la aplicación. Esto incluye las funcionalidades esenciales para que los usuarios puedan registrarse, iniciar sesión, y gestionar sus credenciales de acceso.

---

## 📄 Páginas de Autenticación

Aquí se encuentran las diferentes vistas que guían al usuario a través del proceso de autenticación:

### 🌐 `login.vue` (Inicio de Sesión)

Esta página es la puerta de entrada para los usuarios registrados.

* **Propósito**: Permite a los usuarios acceder a su cuenta.
* **Funcionalidad**: Ofrece un formulario para ingresar el **correo electrónico** y la **contraseña**. Incluye manejo de estado de carga (`isLoading`) y posibles errores durante el proceso de login. También proporciona un enlace directo a la página de recuperación de contraseña y una opción para registrarse.
* **Integración de Google**: Facilita el inicio de sesión a través de **Google (OAuth)**, redirigiendo al usuario a la URL de autenticación de Google.
* **Redirección**: Tras un inicio de sesión exitoso, el usuario es redirigido a la página principal (`/`).
* **Componentes Clave**: Utiliza el servicio `useAuth` para la lógica de autenticación y `useAppStore` para gestionar el estado de la aplicación (usuario, token, autenticación).

### 📝 `register.vue` (Registro)

La página para nuevos usuarios que desean crear una cuenta.

* **Propósito**: Permite a los usuarios crear una nueva cuenta en la aplicación.
* **Funcionalidad**: Presenta un formulario para que el usuario introduzca un **nombre de usuario**, **correo electrónico** y **contraseña**. Incorpora un botón para mostrar/ocultar la contraseña para mayor usabilidad.
* **Manejo de Mensajes**: Muestra mensajes de éxito o error al usuario después de intentar el registro (por ejemplo, "Revisa tu correo para completar el registro").
* **Componentes Clave**: Se apoya en el servicio `useAuth` para la lógica de registro.

### 🔑 `forgot-password.vue` (Olvidar Contraseña)

Esta página ayuda a los usuarios a iniciar el proceso de recuperación de su contraseña.

* **Propósito**: Facilita el envío de un enlace de restablecimiento de contraseña al correo electrónico del usuario.
* **Funcionalidad**: Solicita el **correo electrónico** del usuario. Al enviarlo, la aplicación se comunica con el backend para enviar un enlace único al correo electrónico proporcionado, permitiendo al usuario restablecer su contraseña de forma segura.
* **Estados de UI**: Gestiona los estados de carga, mensajes de éxito y mensajes de error durante el proceso.
* **Componentes Clave**: Utiliza el servicio `useAuth` para la funcionalidad de recuperación de contraseña.

### 🔄 `reset-password.vue` (Restablecer Contraseña)

La página a la que los usuarios son redirigidos desde el enlace de restablecimiento de contraseña.

* **Propósito**: Permite al usuario establecer una **nueva contraseña** después de haber solicitado un restablecimiento.
* **Funcionalidad**: Recupera el **token** de restablecimiento de contraseña de los parámetros de la URL. Si el token es válido, presenta un campo para que el usuario introduzca su nueva contraseña.
* **Validación y Estados**: Muestra mensajes de éxito o error en función de la validez del token y el resultado del restablecimiento.
* **Componentes Clave**: Interacciona con `useAuth` para la lógica de restablecimiento y `useRoute` para acceder a los parámetros de la URL.

### ✅ `verify-register.vue` (Verificar Registro)

Esta página se encarga de la verificación del correo electrónico después del registro.

* **Propósito**: Confirma la cuenta del usuario a través de un token enviado por correo electrónico.
* **Funcionalidad**: Al cargar, extrae un **token** de los parámetros de la URL. Este token se envía al backend para verificar la cuenta del usuario.
* **Redirección Automática**: Una vez que la verificación es exitosa, el usuario es automáticamente redirigido a la página de login.
* **Manejo de Errores**: Muestra mensajes claros si la verificación falla o si el token es inválido.
* **Componentes Clave**: Emplea `useAuth` para la verificación del token y `useRoute` y `useRouter` para la gestión de la URL y las redirecciones.

### ↩️ `callback.vue` (Callback de Autenticación)

Esta página es crucial para el procesamiento de la información de autenticación tras una redirección, especialmente útil para autenticación externa (como Google OAuth).

* **Propósito**: Procesa los datos devueltos por el proveedor de autenticación (por ejemplo, Google) a través de la URL.
* **Funcionalidad**: Al montarse, esta página utiliza el servicio de autenticación para extraer y procesar la información del usuario y el token de la URL. Está diseñada para ser una página de "carga" visualmente sencilla (`Loader`) mientras se gestiona la autenticación.
* **Componentes Clave**: Utiliza `Loader` para una experiencia visual de carga y `useAuth` para ejecutar `processUserFromQuery()`, lo que probablemente implica decodificar y almacenar la información del usuario en el estado de la aplicación.