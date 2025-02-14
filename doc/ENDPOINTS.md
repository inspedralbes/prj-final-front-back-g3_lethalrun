# Documentación del Servidor de Autenticación y Gestión de Usuarios

Servidor Node.js/Express para autenticación local y con Google, gestión de usuarios, imágenes y envío de emails.

## Características Principales
- ✅ Autenticación con email/contraseña
- 🔑 Login con Google OAuth
- ✉️ Envío de emails de verificación y recuperación
- 👥 CRUD de usuarios
- 🖼️ Gestión de imágenes de perfil
- 🔒 Middlewares de autenticación y permisos
- 🔄 WebSockets para actualizaciones en tiempo real

## Tabla de Contenidos
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Endpoints](#endpoints)
  - [Autenticación](#autenticación)
  - [Usuarios](#usuarios)
  - [Imágenes](#imágenes)
  - [Emails](#emails)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

---

## Tecnologías Utilizadas
- Node.js
- Express
- Passport.js
- MongoDB
- JSON Web Tokens
- Nodemailer
- Socket.io
- Bcrypt
- Multer

---

## Instalación
```bash
git clone [tu-repositorio]
cd tu-proyecto
npm install
```

## Documentación de la API

## Autenticación

### 1. **Login con Email y Contraseña**
- **Método**: `POST`
- **Ruta**: `/api/auth/login`
- **Descripción**: Permite al usuario autenticarse usando su email y contraseña. Si las credenciales son correctas, se redirige al callback con la información del usuario.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "redirectUrl": "http://yourdomain.com/auth/callback?user=encodedUserData"
    }
    ```

### 2. **Login con Google**
- **Método**: `GET`
- **Ruta**: `/api/auth/google`
- **Descripción**: Redirige al usuario a la página de autenticación de Google.
- **Respuesta de éxito**: Redirige a Google para autenticar.

### 3. **Callback de Google**
- **Método**: `GET`
- **Ruta**: `/api/auth/callback`
- **Descripción**: Esta ruta es llamada por Google después de que el usuario se autentique exitosamente.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Redirección** a la URL del callback.

### 4. **Logout**
- **Método**: `GET`
- **Ruta**: `/api/auth/logout`
- **Descripción**: Cierra la sesión del usuario autenticado.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Redirección a la página principal.

---

## Usuarios

### 1. **Crear Usuario**
- **Método**: `POST`
- **Ruta**: `/users`
- **Descripción**: Crea un nuevo usuario (requiere privilegios de administrador).
- **Parámetros**:
  - `email`: Email del nuevo usuario.
  - `username`: Nombre de usuario.
  - `password`: Contraseña.
- **Respuesta de éxito**:
  - **Código**: `201 Created`
  - **Cuerpo**:
    ```json
    {
      "id": "newUserId",
      "message": "Usuario creado exitosamente"
    }
    ```

### 2. **Obtener Usuario por ID**
- **Método**: `GET`
- **Ruta**: `/users/:id`
- **Descripción**: Obtiene los detalles de un usuario por su ID (requiere privilegios de administrador).
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Información del usuario.

### 3. **Actualizar Nombre de Usuario**
- **Método**: `PUT`
- **Ruta**: `/users/:id/username`
- **Descripción**: Actualiza el nombre de usuario del usuario autenticado.
- **Parámetros**:
  - `username`: Nuevo nombre de usuario.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Mensaje de éxito.

### 4. **Eliminar Usuario**
- **Método**: `DELETE`
- **Ruta**: `/users/:id`
- **Descripción**: Elimina un usuario (requiere privilegios de administrador).
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Mensaje de éxito.

---

## Imágenes

### 1. **Subir Nueva Imagen**
- **Método**: `POST`
- **Ruta**: `/pictures`
- **Descripción**: Permite al usuario subir una nueva imagen.
- **Parámetros**: `file` (Archivo de imagen).
- **Respuesta de éxito**:
  - **Código**: `201 Created`
  - **Cuerpo**:
    ```json
    {
      "id": "newPictureId",
      "message": "Imagen creada exitosamente"
    }
    ```

### 2. **Establecer Imagen Activa**
- **Método**: `PUT`
- **Ruta**: `/pictures/:id/setActive`
- **Descripción**: Establece una imagen como activa.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Mensaje de éxito.

### 3. **Eliminar Imagen**
- **Método**: `DELETE`
- **Ruta**: `/pictures/:id`
- **Descripción**: Elimina una imagen.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Mensaje de éxito.

### 4. **Obtener Imágenes de Usuario**
- **Método**: `GET`
- **Ruta**: `/users/:userId/pictures`
- **Descripción**: Obtiene todas las imágenes asociadas a un usuario.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Array de imágenes.

---

## Emails

### 1. **Enviar Correo de Verificación**
- **Método**: `POST`
- **Ruta**: `/send-verification-email`
- **Descripción**: Envía un correo de verificación de registro al usuario.
- **Parámetros**:
  - `email`: Email del usuario.
  - `username`: Nombre de usuario.
  - `password`: Contraseña.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Correo de verificación enviado a user@example.com"
    }
    ```

### 2. **Enviar Correo de Restablecimiento de Contraseña**
- **Método**: `POST`
- **Ruta**: `/send-password-reset-email`
- **Descripción**: Envía un correo para restablecer la contraseña.
- **Parámetros**:
  - `email`: Email del usuario.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Correo para restablecer contraseña enviado a user@example.com"
    }
    ```

---

## Tokens

### 1. **Verificar Token de Registro**
- **Método**: `POST`
- **Ruta**: `/verify-email/:token`
- **Descripción**: Verifica el token de registro para crear un usuario.
- **Parámetros**:
  - `token`: Token de verificación.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Mensaje de éxito.

### 2. **Restablecer Contraseña**
- **Método**: `POST`
- **Ruta**: `/reset-password/:token`
- **Descripción**: Permite restablecer la contraseña del usuario utilizando un token de restablecimiento.
- **Parámetros**:
  - `token`: Token de restablecimiento.
  - `newPassword`: Nueva contraseña.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Mensaje de éxito.

---

## Rutas Protegidas

### 1. **Ruta Protegida**
- **Método**: `GET`
- **Ruta**: `/api/protected`
- **Descripción**: Ruta protegida que requiere que el usuario esté autenticado.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Ruta protegida"
    }
    ```

### 2. **Ruta No Protegida**
- **Método**: `GET`
- **Ruta**: `/api/not-protected`
- **Descripción**: Ruta pública que no requiere autenticación.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Ruta NO protegida"
    }
    ```

---

**Nota**: Asegúrate de agregar más detalles de cada endpoint según sea necesario (por ejemplo, descripciones adicionales, ejemplos de errores, etc.).
