# 🎨 pages/graffiti/

El subdirectorio `graffiti/` dentro de `pages/` gestiona la funcionalidad de **personalización de graffitis** para los usuarios. Esta sección permite a los jugadores subir sus propias imágenes, recortarlas y activarlas para que aparezcan como graffitis en el juego "LethalRun", ofreciendo una capa única de expresión y personalización.

---

## 📄 Páginas de Graffiti

Actualmente, este subdirectorio contiene la siguiente página principal:

### 🖼️ `index.vue` (Gestión de Graffitis)

Esta página es el centro para que los usuarios gestionen su colección de graffitis personalizados.

* **Propósito**: Mostrar los graffitis que el usuario ha subido, permitirle añadir nuevos y gestionar los existentes (activar/desactivar, borrar).
* **Diseño y Elementos Clave**:
    * **Navbar**: La barra de navegación superior, con opciones de menú y perfil adaptadas para usuarios autenticados.
    * **Fondo Estrellado**: Efectos visuales de estrellas (`#stars`, `#stars2`, etc.) para mantener la estética de la aplicación.
    * **"Tus Graffitis"**: Un título principal que indica la sección.
    * **Paginación**: Navegación para visualizar grandes colecciones de graffitis en varias páginas (`currentPage`, `totalPages`, `paginatedGraffitis`).
    * **Botón "Añadir Graffiti"**: Desencadena la apertura de un modal para subir nuevas imágenes.
    * **Galería de Graffitis**: Un `grid` que muestra las imágenes de los graffitis del usuario, cada una con opciones para:
        * **Activar/Desactivar**: Un botón para hacer que un graffiti sea el "activo" en el juego (si ya está activo, muestra un estado `Activa`). Si está activa, no se puede eliminar.
        * **Eliminar**: Un botón para borrar un graffiti de la colección del usuario.
    * **Mensaje de No Graffitis**: Si el usuario no tiene graffitis, se muestra un mensaje invitándole a subir el primero.
    * **Modal de Carga/Recorte**: Un modal que aparece al hacer clic en "Añadir Graffiti", el cual incluye:
        * **Selector de Archivos**: Un botón para que el usuario seleccione una imagen (`.jpeg`, `.png`) de su dispositivo.
        * **Previsualización y Recorte (`VueCropper`)**: Una herramienta de recorte interactiva que permite al usuario ajustar la imagen a un formato cuadrado (ratio 1:1) antes de subirla.
        * **Botones de Acción**: "Recortar imagen", "Cancelar", "Subir graffiti".
* **Funcionalidad**:
    * **`WorkspaceGraffitis`**: Obtiene la lista de graffitis del usuario desde la API al cargar la página y la actualiza en tiempo real mediante WebSockets (`socket.io`).
    * **`getPath`**: Construye la URL completa de la imagen del graffiti para su visualización.
    * **Gestión del Modal**:
        * `openModal`, `closeModal`: Controlan la visibilidad del modal y resetean sus estados.
        * `showFileChooser`, `onFileChange`: Manejan la selección de archivos de imagen por parte del usuario.
        * `cropImage`: Utiliza `vue-cropperjs` para recortar la imagen seleccionada y generar una previsualización.
        * `uploadImage`: Envía la imagen recortada al backend para su almacenamiento y asociación con el usuario. Se envía el `userId` y `socketId` para actualizaciones en tiempo real.
    * **Gestión de Graffitis (CRUD)**:
        * `deleteGraffitiHandler`: Envía una solicitud para eliminar un graffiti específico. No permite borrar graffitis activos.
        * `setActiveGraffitiHandler`: Envía una solicitud para establecer un graffiti como el activo del usuario.
    * **Actualizaciones en Tiempo Real**: Utiliza un listener de Socket.io (`update-pictures`) para reflejar los cambios en la lista de graffitis (subidas, eliminaciones, activaciones) de forma instantánea sin necesidad de recargar la página.
    * **Manejo de Errores**: Captura y gestiona errores en las operaciones de API.
* **Tecnologías Clave**: Vue 3 Composition API (`ref`, `onMounted`, `computed`), Nuxt.js (`useAppStore`, `useGraffitis`, `useRuntimeConfig`, `$socket`), `vue-cropperjs` para el recorte de imágenes, Tailwind CSS para el estilado.