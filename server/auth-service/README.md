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

