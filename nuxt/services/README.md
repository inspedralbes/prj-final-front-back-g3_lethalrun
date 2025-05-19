# 📞 services/

Este directorio contiene los **servicios del frontend**, que son archivos JavaScript diseñados para encapsular la lógica de comunicación con los diferentes **microservicios del backend**. Cada archivo de servicio (`auth.js`, `gashapon.js`, `graffitis.js`) se enfoca en un área específica de la API, facilitando la organización del código y la reutilización.

---

## 🎯 Propósito

Los servicios actúan como una capa de abstracción entre los componentes de la interfaz de usuario y las API del backend. Esto significa que los componentes no necesitan preocuparse por los detalles de las solicitudes HTTP, los encabezados de autenticación o el manejo básico de errores; simplemente llaman a una función del servicio y obtienen una respuesta.

Cada servicio utiliza:
* **`useAppStore`**: Para acceder al estado global de la aplicación (como el token de autenticación y la información del usuario).
* **`useRouter` y `useRoute`**: Para manejar la navegación y acceder a los parámetros de la URL cuando sea necesario.
* **`useRuntimeConfig`**: Para obtener variables de entorno como las URLs base de las APIs, asegurando una configuración flexible.
* **`$fetch`**: La utilidad de Nuxt 3 para realizar solicitudes HTTP de manera eficiente.

---

## 📁 Estructura y Contenido

### 🔐 [auth.js](auth.js)

Este servicio se encarga de todas las operaciones relacionadas con la **autenticación y autorización de usuarios**.

* **`login(email, password)`**: Permite a los usuarios iniciar sesión con su correo electrónico y contraseña.
* **`forgotPassword(email)`**: Envía un correo electrónico para restablecer la contraseña.
* **`processUserFromQuery()`**: Procesa los datos de usuario y el token recibidos a través de parámetros de consulta en la URL (comúnmente usado después de autenticación OAuth o verificación de correo), y los guarda en el store de Pinia.
* **`register(username, email, password)`**: Inicia el proceso de registro de un nuevo usuario, enviando un correo de verificación.
* **`verifyEmailToken(token)`**: Verifica el token recibido para confirmar la dirección de correo electrónico del usuario.
* **`resetPassword(token, newPassword)`**: Permite a los usuarios establecer una nueva contraseña utilizando un token de restablecimiento.

---

### 🎰 [gashapon.js](gashapon.js)

Este servicio interactúa con el **sistema de gachapon y gestión de skins**.

* **`getMySlots()`**: Recupera los "slots" (espacios para skins) que posee el usuario autenticado.
* **`setSlotNumber(slotName, newNumber)`**: Actualiza el número asociado a un slot de skin específico del usuario.
* **`setActiveSkinSlot(slotName)`**: Activa una skin específica para el usuario.
* **`unlockSlot(slotName)`**: Desbloquea un slot de skin para el usuario.

---

### 🖼️ [graffitis.js](graffitis.js)

Este servicio maneja todas las operaciones relacionadas con la **gestión de graffitis de usuario**.

* **`getGraffitis()`**: Obtiene la lista de graffitis cargados por el usuario actual.
* **`uploadGraffiti(formData)`**: Permite subir un nuevo archivo de graffiti al servidor.
* **`setActiveGraffiti(graffitiId, socketId)`**: Establece un graffiti específico como el graffiti activo del usuario. Incluye `socketId` para posibles actualizaciones en tiempo real.
* **`deleteGraffiti(id, socketId, path)`**: Elimina un graffiti existente del usuario. También incluye `socketId` y la `path` del graffiti para notificaciones o limpieza.