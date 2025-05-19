# 🔐 Microservicio de Autenticación y Verificación de Usuarios

## 📖 Descripción general

Este microservicio gestiona la **autenticación de usuarios**, tanto por **login local** como con **Google OAuth2**, junto con la **verificación de emails** y el **restablecimiento de contraseñas** mediante enlaces enviados por correo electrónico.

Además, expone endpoints para que otros servicios validen los tokens JWT y confirmen permisos de usuarios cliente o admin, facilitando la integración en arquitecturas de microservicios.

---

## 🔄 Flujo de funcionamiento

1. **Login local o con Google**:  
   - El usuario puede autenticarse con email y contraseña o con Google.  
   - En el login local, se valida la contraseña y se genera un token JWT.  
   - En el login con Google, tras el OAuth2, se genera el token JWT y se redirige al frontend con el token y datos del usuario.

2. **Registro y verificación de cuenta**:  
   - Cuando un usuario se registra, se envía un correo con un enlace de verificación que contiene un token temporal.  
   - El usuario hace clic en el enlace para activar su cuenta, lo que valida el token y crea el usuario en la base de datos.

3. **Restablecimiento de contraseña**:  
   - El usuario solicita restablecer su contraseña enviando su email.  
   - Se envía un correo con un enlace que contiene un token temporal para restablecer la contraseña.  
   - El usuario cambia su contraseña usando ese enlace, validando el token antes de actualizar la contraseña.

4. **Validación de tokens por otros servicios**:  
   - Otros microservicios pueden llamar a los endpoints `/check-cliente` y `/check-admin` para verificar la validez y permisos de un token JWT.

---

## 🌐 Integración con otros servicios

- El microservicio provee **endpoints REST seguros** para autenticación y verificación, que pueden ser usados por frontends y otros microservicios.  
- Los tokens JWT permiten la **autorización distribuida** en toda la arquitectura.  
- Las funciones de envío de correo están desacopladas para facilitar el envío de emails de verificación y restablecimiento desde diferentes puntos del sistema.

---

## 🚪 Rutas disponibles

| Ruta                         | Método | Descripción                                              | Seguridad     |
|------------------------------|--------|----------------------------------------------------------|---------------|
| `/login`                     | POST   | Login local con email y contraseña, retorna JWT y usuario | Pública       |
| `/google`                    | GET    | Inicia autenticación con Google OAuth2                    | Pública       |
| `/callback`                  | GET    | Callback de Google OAuth2, redirige con token y usuario  | Pública       |
| `/logout`                    | GET    | Cierra sesión (requiere token válido)                     | JWT Cliente   |
| `/send-verification-email`  | POST   | Envía correo con enlace para verificar cuenta            | Pública       |
| `/send-password-reset-email`| POST   | Envía correo con enlace para restablecer contraseña      | Pública       |
| `/verify-email/:token`      | POST   | Verifica token y registra usuario                         | Pública       |
| `/reset-password/:token`    | POST   | Verifica token y actualiza contraseña                      | Pública       |
| `/check-cliente`            | GET    | Valida token JWT para cliente o admin                     | JWT Cliente/Admin |
| `/check-admin`              | GET    | Valida token JWT exclusivamente para admin                | JWT Admin     |

---

## 🔐 Seguridad y configuración

- Tokens JWT firmados y verificados con secretos configurados vía variables de entorno.  
- Uso de middleware para proteger rutas y verificar permisos según rol (`cliente` o `admin`).  
- Las sesiones se manejan con cookies y Passport.js para la autenticación local y OAuth2.  
- Tokens temporales para verificar emails y restablecer contraseñas, almacenados y verificados en controlador de tokens.

---

## 📨 Emails

- Los emails se envían con enlaces personalizados para verificar cuentas y restablecer contraseñas.  
- El contenido HTML está diseñado para ser responsivo y claro, facilitando la acción del usuario.

---

## ⚙️ Configuración del archivo `.env.example` y credenciales de Google

Este apartado explica el significado de cada variable del archivo `.env.example` y proporciona una guía paso a paso para obtener y configurar correctamente las credenciales de Google OAuth 2.0 necesarias para el funcionamiento del microservicio.

---

### 🗂️ Variables del archivo `.env.example`

| Variable                   | Descripción                                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------|
| `PORT`                     | Puerto donde se ejecuta el servicio de autenticación (por ejemplo, 3000).                             |
| `DOMAIN_URL`               | URL base del Auth Service (por ejemplo, http://localhost).                                            |
| `WEB_PORT`                 | Puerto donde se ejecuta el frontend (por ejemplo, http://localhost:4000).                             |
| `USER_API_URL`             | URL del microservicio de usuarios para login/registro.                                                |
| `GOOGLE_CLIENT_ID`         | ID de cliente OAuth 2.0 obtenido en Google Cloud Console.                                             |
| `GOOGLE_CLIENT_SECRET`     | Secreto del cliente OAuth 2.0 obtenido en Google Cloud Console.                                       |
| `GOOGLE_REDIRECT_URI`      | URI de redirección autorizada registrada en Google Cloud Console.                                     |
| `GOOGLE_REFRESH_TOKEN`     | Token de actualización generado con permisos "offline" (ver pasos abajo).                             |
| `EMAIL`                    | Correo electrónico autorizado (normalmente el propietario del proyecto o cuenta de servicio).         |
| `SESSION_SECRET`           | Clave para firmar sesiones (usada por Express).                                                       |
| `JWT_SECRET_ADMIN`         | Clave secreta para tokens JWT del rol admin.                                                          |
| `JWT_SECRET_CLIENTE`       | Clave secreta para tokens JWT del rol cliente.                                                        |

---

### 🔐 Guía para obtener credenciales de Google OAuth 2.0

#### 1. Crear un proyecto en Google Cloud

- Accede a [Google Cloud Console](https://console.cloud.google.com/).
- Crea un nuevo proyecto o selecciona uno existente.

#### 2. Configurar la pantalla de consentimiento OAuth

- Ve a **APIs y servicios > Pantalla de consentimiento OAuth**.
- Selecciona tipo "Externo" para desarrollo.
- Completa los campos obligatorios: nombre de la aplicación, correo de soporte, dominios autorizados (ej: `localhost`).
- Añade los siguientes ámbitos:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`

#### 3. Crear credenciales OAuth 2.0

- Ve a **APIs y servicios > Credenciales**.
- Haz clic en **Crear credenciales > ID de cliente de OAuth**.
- Elige "Aplicación web".
- Configura los orígenes y redirecciones autorizadas:
  - **Orígenes JavaScript autorizados:**  
    - Ejemplo: `http://localhost`
  - **URIs de redirección autorizadas:**  
    - Ejemplo: `http://localhost:3000/callback` (ajusta el puerto según tu configuración)
- Guarda y copia los valores generados:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

#### 4. Obtener el `GOOGLE_REFRESH_TOKEN`

- Accede a [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
- En el panel de la izquierda, selecciona los ámbitos:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Haz clic en **Authorize APIs** y sigue el flujo de autenticación.
- Intercambia el código por tokens y copia el **refresh token** generado.
  - Pega el valor en la variable `GOOGLE_REFRESH_TOKEN` de tu `.env`.

#### 5. Configurar el correo autorizado

- Usa el mismo correo con el que creaste las credenciales o uno verificado en el proyecto de Google Cloud.
- Asigna ese correo a la variable `EMAIL`.

#### 6. Configurar claves de seguridad

- Genera valores aleatorios largos para:
  - `SESSION_SECRET`
  - `JWT_SECRET_ADMIN`
  - `JWT_SECRET_CLIENTE`
- Puedes usar el siguiente comando en Node.js para generar una clave segura:
```bash
require('crypto').randomBytes(64).toString('hex')
```


---

### 📝 Notas y recomendaciones

- **No compartas nunca tus claves secretas ni tokens en repositorios públicos.**
- Si cambias el dominio o los puertos, actualiza las URIs autorizadas en Google Cloud Console.
- Para entornos de producción, utiliza dominios HTTPS y considera la rotación periódica de tokens y secretos.
- Si ves errores de tipo `redirect_uri_mismatch`, revisa que la URI de redirección en Google Cloud coincida exactamente con la de tu `.env`.

---




