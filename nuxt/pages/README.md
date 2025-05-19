# 📄 pages/

El directorio `pages/` en Nuxt.js es donde se definen las **vistas o páginas de la aplicación**, y cada archivo `.vue` dentro de este directorio (o sus subdirectorios) se convierte automáticamente en una ruta. Esto simplifica enormemente la gestión del enrutamiento y la organización del contenido.

---

## 🏠 Páginas Principales

### 🌐 `index.vue` (Página de Inicio)

Esta es la **página de aterrizaje** principal de la aplicación. Su diseño y contenido varían dependiendo de si el usuario está autenticado o no.

* **Propósito**: Actuar como el punto de entrada para todos los usuarios.
* **Contenido para Usuarios No Autenticados**: Muestra un mensaje de bienvenida general a "LethalRun" y ofrece botones prominentes para **registrarse** e **iniciar sesión**, animando a los nuevos usuarios a unirse.
* **Contenido para Usuarios Autenticados**: Saluda al usuario por su `username` y presenta un botón para **entrar al `dashboard`**, dirigiéndolo a la experiencia principal del juego.
* **Componentes Utilizados**:
    * `Navbar`: La barra de navegación superior, que se adapta para mostrar opciones de perfil si el usuario está logueado o enlaces de login/registro si no lo está.
* **Estilo**: Utiliza clases de Tailwind CSS para un diseño centrado y atractivo, con fondos dinámicos de estrellas (`#stars`, `#stars2`, etc.) para un toque visual.

---

### 🎮 `dashboard.vue` (Panel de Control Principal)

El `dashboard.vue` sirve como el **panel de control principal** una vez que el usuario ha iniciado sesión. Ofrece una visión general del juego, sus características y acceso a las funcionalidades clave.

* **Propósito**: Proporcionar a los usuarios autenticados un centro de información y navegación sobre "LethalRun".
* **Secciones Incluidas**:
    * **Introducción a LethalRun**: Describe el juego como una plataforma de trampas inspirada en "Deathruns de Garry's Mod" y destaca su enfoque en la rapidez y precisión.
    * **Call to Action (CTA)**: Un botón destacado para "Jugar ahora", que enlaza directamente con el Google Drive donde se encuentra el juego.
    * **¿Qué es LethalRun?**: Una sección que profundiza en la experiencia de juego, sus desafíos y el aspecto multijugador.
    * **Quiénes somos?**: Presenta a los miembros del equipo de desarrollo, mostrando sus roles.
    * **Personaliza tu experiencia**: Destaca el sistema de graffitis personalizados, explicando cómo los usuarios pueden subir y usar sus propias imágenes en el juego.
    * **Características destacadas**: Enumera las principales características del juego, como niveles dinámicos, multijugador y un sistema de cosméticos.
    * **Novedades y Actualizaciones**: Proporciona información sobre las últimas adiciones al juego, como la personalización total (skins, efectos visuales, emotes) y el desarrollo de un nuevo mapa, incluyendo una imagen representativa.
* **Componentes Utilizados**:
    * `Navbar`: Idéntico al utilizado en `index.vue`, pero con el menú de navegación completo y las opciones de perfil habilitadas para usuarios autenticados.
* **Estilo**: Predominantemente oscuro (`bg-black`) con textos en tonos grises y resaltes en rojo y naranja para los títulos y elementos importantes, utilizando Tailwind CSS para estructurar el contenido y agregar efectos visuales como sombras y gradientes. También incluye los fondos de estrellas dinámicos.

---

## 🗂️ Contenido de las Subcarpetas

El directorio `pages/` se organiza en subcarpetas para agrupar las páginas relacionadas con funcionalidades específicas, lo que mejora la modularidad y la claridad del proyecto.

### 🔐 [`auth/`](./auth/README.md) (Autenticación)

Este subdirectorio contiene todas las páginas y componentes relacionados con el **proceso de autenticación de usuarios**, incluyendo:

* **Inicio de sesión**: Formularios y lógica para que los usuarios accedan a sus cuentas.
* **Registro**: Interfaces para la creación de nuevas cuentas de usuario.
* **Recuperación de contraseña**: Flujos para restablecer contraseñas olvidadas.
* **Verificación de correo electrónico**: Páginas para confirmar la dirección de correo electrónico del usuario.

### 🎰 [`gachapon/`](./gachapon/README.md) (Sistema de Gachapon)

Este subdirectorio alberga las páginas dedicadas a la **funcionalidad del sistema de gachapon**. Aquí, los usuarios pueden interactuar con la máquina de gachapon para intentar obtener diferentes skins o coleccionables dentro del juego.

### 🎨 [`graffiti/`](./graffiti/README.md) (Graffitis)

Contiene las páginas para la **gestión y personalización de graffitis** por parte del usuario. Permite a los jugadores subir sus propias imágenes, previsualizarlas y activarlas para usarlas como graffitis dentro del juego, ofreciendo una capa de personalización única.

### 👤 [`profile/`](./profile/README.md) (Perfil de Usuario)

Este subdirectorio agrupa las páginas relacionadas con la **información y configuración del perfil del usuario**. Los usuarios pueden ver sus estadísticas, información personal, tiempo de juego, experiencia y posiblemente gestionar otras configuraciones de su cuenta.