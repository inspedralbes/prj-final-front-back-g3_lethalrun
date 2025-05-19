Markdown

# 🚀 Frontend - Lethal Run

Este repositorio contiene la implementación del frontend para el juego **Lethal Run**, desarrollado con Nuxt.js. Proporciona la interfaz de usuario y la lógica del lado del cliente para interactuar con los microservicios del backend.

---

## 🏗️ Arquitectura General

El frontend está estructurado en componentes reutilizables, páginas con rutas definidas, plugins para funcionalidades específicas, servicios para la comunicación con la API y un store global para el manejo del estado.

- ⚡ **Nuxt.js:** Framework intuitivo y potente para el desarrollo de aplicaciones Vue.js.
- 🎨 **Componentes:** Modularización de la interfaz de usuario para reutilización.
- 🔄 **Pinia:** Gestión de estado eficiente y sencilla.

---

## 📁 Estructura del Proyecto

nuxt/
- ├── components/     # Componentes Vue reutilizables
- ├── middleware/     # Middlewares para la navegación
- ├── pages/          # Páginas y rutas de la aplicación
- ├── plugins/        # Plugins de Vue para funcionalidad global
- ├── services/       # Lógica para interactuar con los servicios del backend
- └── stores/         # Stores de Pinia para la gestión del estado global


---

## 🧩 Directorios Principales

### 📦 [components/](components/)

Contiene los componentes Vue reutilizables de la aplicación. Aquí encontrarás elementos de UI como `GachaponSlot.vue`, `GashaponMachine.vue`, `Loader.vue` y `Navbar.vue`.

---

### 🌐 [middleware/](middleware/)

Define los middlewares de la aplicación. Actualmente, solo se encuentra `redirect.global.js`, que probablemente maneja redirecciones a nivel global antes de cargar una ruta.

---

### 📄 [pages/](pages/)

Aquí se organizan todas las páginas de la aplicación, que a su vez definen las rutas.

- **[auth/](pages/auth/)**: Páginas relacionadas con la autenticación, como `login.vue`, `register.vue`, `forgot-password.vue`, `reset-password.vue`, `verify-register.vue` y `callback.vue` (posiblemente para autenticación OAuth).
- **[gachapon/](pages/gachapon/)**: Contiene la página principal del sistema de gachapon, `index.vue`.
- **[graffiti/](pages/graffiti/)**: Incluye la página de configuración de grafitis, `settings.vue`.
- **[profile/](pages/profile/)**: Contiene las páginas relacionadas con el perfil del usuario, como `my-info.vue`.
- **`dashboard.vue`**: La página principal del panel de control.
- **`index.vue`**: La página de inicio de la aplicación.

---

### 🔌 [plugins/](plugins/)

Alberga los plugins de Vue que extienden las funcionalidades de la aplicación globalmente.
- **`socket.client.ts`**: Probablemente maneja la conexión y lógica de WebSockets del lado del cliente.
- **`vue-cropper.js`**: Un plugin para recortar imágenes.

---

### 📞 [services/](services/)

Contiene la lógica para la comunicación con los diferentes microservicios del backend.
- **`auth.js`**: Servicio para las llamadas a la API de autenticación.
- **`gashapon.js`**: Servicio para interactuar con la API del gachapon.
- **`graffitis.js`**: Servicio para gestionar las operaciones relacionadas con los grafitis.

---

### 💾 [stores/](stores/)

Define los stores de Pinia para la gestión del estado global de la aplicación.
- **`app.js`**: El store principal de la aplicación, que probablemente contiene el estado global y las acciones que afectan a toda la aplicación.

---

## 🧰 Requisitos del Sistema

- 🟢 Node.js (v14 o superior)
- 📦 npm o yarn

---

## ⚙️ Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd nuxt
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```
3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y configura las variables necesarias, como la URL del backend.
    ```
    NUXT_PUBLIC_API_BASE=http://localhost:3000/api
    ```
    *(Asegúrate de que esta URL apunte a tu backend en funcionamiento)*
4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    # o
    yarn dev
    ```
    La aplicación estará disponible en `http://localhost:3000` (o el puerto que Nuxt.js asigne).

---

## ⚙️ Instalación y Configuración

Consulta la guía completa de instalación en 📄 [MANUAL_INSTALACIÓN.md](./MANUAL_INSTALACIÓN.md)