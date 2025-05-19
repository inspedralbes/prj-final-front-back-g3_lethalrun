# 🚦 middleware/redirect.global.js

Este archivo define un **middleware global** en Nuxt.js, llamado `redirect.global.js`. Los middlewares en Nuxt.js son funciones que se ejecutan antes de que se cargue una ruta. En este caso, este middleware se aplica a **todas las rutas** (`.global.js`), y su propósito principal es **gestionar la redirección de usuarios basada en su estado de autenticación**.

---

## 🎯 Propósito

El middleware `redirect.global.js` asegura que los usuarios solo puedan acceder a ciertas partes de la aplicación dependiendo de si han iniciado sesión o no. Esto es fundamental para la **seguridad y la experiencia de usuario**, evitando que usuarios no autenticados accedan a contenido restringido y que usuarios ya logueados intenten acceder a páginas de autenticación.

---

## ⚙️ Funcionamiento

El middleware utiliza el store de Pinia (`useAppStore`) para verificar el estado de autenticación del usuario. La lógica se basa en las siguientes condiciones:

1.  **Si el usuario NO está autenticado (`!store.getIsAuthenticated`)**:
    * **Permite el acceso** a la página de inicio (`/`) y a todas las rutas dentro del directorio `/auth/` (por ejemplo, `/auth/login`, `/auth/register`, `/auth/forgot-password`, etc.). Esto es necesario para que los usuarios puedan registrarse o iniciar sesión.
    * **Redirige** a la página de inicio de sesión (`/auth/login`) si el usuario intenta acceder a *cualquier otra ruta* (es decir, rutas que requieren autenticación).

2.  **Si el usuario SÍ está autenticado (`store.getIsAuthenticated`)**:
    * **Redirige** a la página de inicio (`/`) si el usuario intenta acceder a *cualquier ruta* dentro del directorio `/auth/`. Esto evita que un usuario ya logueado vea las pantallas de login o registro.

---

## 💡 Flujo de Redirección

El flujo de este middleware garantiza que:

* Un usuario **no autenticado** siempre será dirigido a las páginas de autenticación o a la página principal no restringida.
* Un usuario **autenticado** no podrá volver a las páginas de autenticación y será dirigido a la página de inicio o al panel de control si intenta hacerlo.