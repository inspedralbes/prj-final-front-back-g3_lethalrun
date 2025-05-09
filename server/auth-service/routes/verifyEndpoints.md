1. Verificar token válido para cliente o admin
GET /check-cliente

No envías body (requiere JWT en headers).

Body de respuesta:

json
{
  "message": "Token válido para cliente o admin",
  "user": { /* datos del usuario */ }
}


2. Verificar token válido solo para admin
GET /check-admin

No envías body (requiere JWT en headers).

Body de respuesta:
json
{
  "message": "Token válido solo para admin",
  "user": { /* datos del usuario */ }
}




Notas adicionales
En todos los endpoints protegidos, el JWT debe enviarse en el header Authorization:

text
Authorization: Bearer TU_JWT
Los errores siempre se devuelven en formato JSON con una clave message o error.