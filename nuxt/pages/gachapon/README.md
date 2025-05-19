# 🎰 pages/gachapon/

El subdirectorio `gachapon/` contiene las páginas relacionadas con la **funcionalidad del sistema de Gachapon** en la aplicación. Este sistema permite a los usuarios obtener skins y otros objetos cosméticos para personalizar su experiencia en el juego "LethalRun".

---

## 📄 Páginas del Gachapon

Actualmente, este subdirectorio contiene la siguiente página principal:

### 🌟 `index.vue` (Máquina de Gachapon)

Esta es la página central para interactuar con la máquina de gachapon.

* **Propósito**: Proporcionar una interfaz interactiva donde los usuarios pueden "tirar" de la máquina de gachapon para ganar skins aleatorias.
* **Diseño y Elementos Clave**:
    * **Navbar**: La barra de navegación superior, adaptada para la página del gachapon.
    * **Fondo Estrellado**: Efectos visuales de estrellas (`#stars`, `#stars2`, etc.) para mantener la estética de la aplicación.
    * **Título**: "Lethal Run Skins!" indicando el propósito de la página.
    * **Máquina de Gachapon**: Una representación visual de la máquina, dividida en:
        * **`machine-top`**: Incluye una pantalla (`status-display`) que muestra el estado actual (e.g., "Preparat per tirar!").
        * **`machine-body`**: Contiene la sección principal donde se visualiza el resultado de la tirada:
            * `item-display`: Un área donde aparecen las skins.
            * `glow-effect`: Un efecto visual de brillo para resaltar el objeto obtenido.
            * `gacha-orb`: Una esfera que puede representar el objeto a punto de revelarse.
            * `character-image`: Muestra la imagen del personaje o skin obtenida (inicialmente muestra un GIF de "megumin" como placeholder).
        * **`machine-bottom`**: Ubica el botón de "Tirar" (`pull-button`), esencial para interactuar con la máquina.
* **Funcionalidad**:
    * Gestiona el estado de autenticación del usuario (`isLogged`).
    * Define las opciones del menú de navegación (`menuItems`) y del perfil (`profileOptions`).
    * Prepara el enlace de cierre de sesión (`logoutLink`).
    * Aunque el script proporcionado se centra principalmente en la configuración de la UI y la navegación, la interacción principal (la lógica de "tirar" y mostrar las skins) se implementaría mediante JavaScript, actualizando dinámicamente la `character-image` y el `status-display` al obtener un nuevo ítem.

Este componente es el punto de interacción principal para que los usuarios prueben su suerte y expandan su colección de skins en "LethalRun".