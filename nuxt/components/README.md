# 📦 components/

El directorio `components/` contiene los **componentes Vue reutilizables** que construyen la interfaz de usuario de la aplicación "Lethal Run". Estos componentes están diseñados para ser modulares, lo que permite una mayor flexibilidad, mantenibilidad y escalabilidad en el desarrollo del frontend. Cada componente encapsula su propia lógica, estilo y estructura, facilitando su uso en diferentes páginas o dentro de otros componentes.

---

## 🧩 Contenido del Directorio

### 🎰 [GachaponSlot.vue](GachaponSlot.vue)

Este componente representa un **slot individual dentro del sistema de gachapon**, donde se puede mostrar una "skin" o un indicador de que el slot está vacío.

* **Propósito**: Mostrar visualmente el estado de un espacio de skin del gachapon.
* **Props**:
    * `skin (String | null)`: La URL de la imagen de la skin a mostrar. Si es `null`, se mostrará el texto "Vacío".
* **Emits**:
    * `click`: Emitido cuando el usuario hace clic en el slot, permitiendo la interacción con la skin mostrada o el slot vacío.
* **Estilo**: Utiliza clases de Tailwind CSS para un diseño responsivo y atractivo, incluyendo gradientes y sombras.

---

### 🎲 [GashaponMachine.vue](GashaponMachine.vue)

Este componente simula una **máquina de gachapon completa**, encargándose de la animación, el estado y la visualización de los premios obtenidos.

* **Propósito**: Proporcionar una experiencia interactiva para que los usuarios "giren" la máquina de gachapon y vean el resultado de su intento.
* **Props**:
    * `rolledPrize (Object | null)`: El objeto que representa el premio obtenido en el último giro. Se espera que contenga `name`, `imageUrl` (opcional), `emoji` (opcional) y `message` (en caso de error).
    * `currentAttempts (Number)`: El número actual de intentos disponibles para el usuario.
    * `showAttemptsCounter (Boolean)`: Un booleano que controla la visibilidad del contador de intentos.
* **Emits**:
    * `request-roll`: Emitido cuando el usuario hace clic en el botón de "Girar", solicitando un nuevo intento al padre.
    * `animation-finished (prize)`: Emitido una vez que la animación de revelación del premio ha terminado, pasando el objeto del premio.
* **Estado Interno (`ref`)**:
    * `status`: Controla el estado actual de la máquina (`'idle'`, `'spinning'`, `'dispensing'`, `'revealed'`, `'error'`).
    * `prizeToDisplay`: Almacena el premio que se está mostrando en el área de visualización.
* **Propiedades Computadas (`computed`)**:
    * `isOperating`: Indica si la máquina está en un estado de operación (girando o dispensando).
    * `buttonText`: Cambia el texto del botón de "Girar" según el estado de la máquina y los intentos disponibles.
* **Lógica (`watch`)**:
    * Observa el `rolledPrize` para disparar las animaciones de giro, dispensación y revelación del premio.
* **Estilo y Animaciones**: Incorpora animaciones CSS complejas (`@keyframes`) para simular el giro de la máquina, la dispensación de la cápsula y la aparición del premio, utilizando también Tailwind CSS para el diseño general.

---

### ⏳ [Loader.vue](Loader.vue)

Un componente simple diseñado para **mostrar un indicador de carga** que ocupa toda la pantalla.

* **Propósito**: Informar visualmente al usuario que la aplicación está procesando o cargando datos, mejorando la experiencia al evitar la incertidumbre.
* **Detalles**: Generalmente incluye un icono giratorio o una animación similar para indicar actividad. Suelen superponerse al contenido existente para bloquear la interacción hasta que la carga se complete.

---

### 🧭 [Navbar.vue](Navbar.vue)

Este componente es la **barra de navegación principal** de la aplicación, proporcionando enlaces de navegación, control de acceso y opciones de perfil de usuario.

* **Propósito**: Permitir a los usuarios navegar por las diferentes secciones de la aplicación y acceder a su perfil o cerrar sesión. Se adapta a la visualización móvil y de escritorio.
* **Props**:
    * `logoSrc (String)`: La URL de la imagen del logo de la aplicación.
    * `logoLink (String)`: La ruta a la que redirige el logo al hacer clic (por defecto `/`).
    * `profileImg (String)`: La URL de la imagen del perfil del usuario.
    * `profileOptions (Array)`: Un array de objetos con las opciones del menú desplegable del perfil (cada objeto con `to` y `label`).
    * `logoutLink (String)`: La URL a la que redirige el botón de cerrar sesión.
    * `isLogged (Boolean)`: Indica si el usuario está logueado, para mostrar las opciones correctas (menú de usuario vs. botones de login/registro).
* **Estado Interno (`ref`)**:
    * `navbarMobileMenuIsOpen`: Controla la visibilidad del menú de navegación en dispositivos móviles.
    * `profileOptionsIsOpen`: Controla la visibilidad del menú desplegable de opciones de perfil.
* **Integraciones**:
    * Utiliza `useAppStore` para verificar el estado de autenticación del usuario (`store.isAuthenticated`) y el `useRoute` para determinar la ruta actual y aplicar estilos activos a los enlaces de navegación.
    * Incluye enlaces de `NuxtLink` para una navegación optimizada dentro de la aplicación.
* **Estilo**: Combina un fondo con imagen repetida (`background-navbar.png`) con clases de Tailwind CSS para un diseño responsivo y elementos interactivos como los menús desplegables. También aplica un `backdrop-filter` para un efecto de desenfoque en el menú móvil.