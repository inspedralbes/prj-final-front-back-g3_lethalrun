# 👤 pages/profile/

El subdirectorio `profile/` dentro de `pages/` está dedicado a la **gestión de la información personal del usuario**. Actualmente, se enfoca en mostrar los detalles básicos del perfil.

---

## 📄 Páginas de Perfil

Actualmente, este subdirectorio contiene la siguiente página:

### ℹ️ `my-info.vue` (Mi Información)

Esta página presenta la información esencial del perfil del usuario.

* **Propósito**: Mostrar al usuario sus datos clave, como su correo electrónico.
* **Diseño y Elementos Clave**:
    * **Navbar**: La barra de navegación superior, que se adapta al estado de autenticación del usuario y proporciona opciones de perfil.
    * **Fondo Degradado**: Un fondo con un degradado sutil (`linear-gradient`) para mantener la estética visual de la aplicación.
    * **"El Meu Perfil"**: Un título claro que identifica la sección.
    * **Información del Usuario**: Muestra el correo electrónico del usuario en un campo de solo lectura, con un estilo que lo integra visualmente en la interfaz.
* **Funcionalidad**:
    * **Acceso a Datos del Usuario**: Obtiene la información del usuario (`user`) directamente del `useAppStore`, asegurando que los datos mostrados son los del usuario autenticado actualmente.
    * **Opciones de Navegación**: Configura las `profileOptions` para el menú del usuario (actualmente solo "El meu perfil") y el `logoutLink` para cerrar la sesión.
    * **Estado de Autenticación**: Determina y utiliza el estado de autenticación (`isLogged`) para la lógica de la Navbar.
* **Tecnologías Clave**: Vue 3 Composition API, Nuxt.js (`useAppStore`, `useRuntimeConfig`), Tailwind CSS para el estilado.