1. Login con email y contraseña
POST /login

Body que envías:
json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_contraseña"
}

Body de respuesta (éxito):
json
{
  "message": "Login exitoso",
  "token": "JWT_GENERADO"
}

Body de respuesta (error):
json
{
  "message": "Credenciales incorrectas",
  "details": "Información adicional"
}


2. Login con Google
GET /auth/google
GET /auth/callback

No envías body, es un flujo de redirección OAuth.

Respuesta: Redirección al frontend con el token en la URL:

text
/auth/callback?token=JWT_GENERADO


3. Cerrar sesión
GET /logout

No envías body.

Respuesta: Redirección al frontend.


4. Enviar correo de verificación de registro
POST /send-verification-email

Body que envías:
json
{
  "email": "usuario@ejemplo.com",
  "username": "nombreusuario",
  "password": "tu_contraseña"
}

Body de respuesta (éxito):
json
{
  "message": "Correo de verificación enviado a usuario@ejemplo.com"
}

Body de respuesta (error):
json
{
  "message": "El usuario ya existe."
}


5. Enviar correo para restablecer contraseña
POST /send-password-reset-email

Body que envías:
json
{
  "email": "usuario@ejemplo.com"
}

Body de respuesta (éxito):
json
{
  "message": "Correo de restablecimiento enviado a usuario@ejemplo.com"
}

Body de respuesta (error):
json
{
  "message": "Usuario no encontrado."
}


6. Verificar email y crear usuario
POST /verify-email/:token

Body que envías:
No se envía body, el token va en la URL.

Body de respuesta (éxito):
json
{
  "message": "Usuario registrado correctamente"
}

Body de respuesta (error):
json
{
  "error": "Token inválido o expirado."
}


7. Restablecer contraseña
POST /reset-password/:token

Body que envías:
json
{
  "newPassword": "nueva_contraseña"
}

Body de respuesta (éxito):
json
{
  "message": "Contraseña actualizada con éxito."
}

Body de respuesta (error):
json
{
  "message": "Error al restablecer la contraseña."
}


8. Rutas protegidas
GET /protected
No envías body (requiere JWT en headers).

Body de respuesta:

json
{
  "message": "Ruta protegida accesible por cliente o admin",
  "user": { /* datos del usuario */ }
}

GET /admin-only

No envías body (requiere JWT de admin).

Body de respuesta:
json
{
  "message": "Acceso concedido solo a administradores",
  "user": { /* datos del usuario */ }
}

GET /cliente-area
No envías body (requiere JWT).

Body de respuesta:
json
{
  "message": "Área accesible para clientes y administradores",
  "user": { /* datos del usuario */ }
}