# 📡 Microservicio de Comunicación en Tiempo Real con Socket.IO

## 📖 Descripción general

Este microservicio implementa comunicación en tiempo real utilizando **Socket.IO** integrado con un servidor HTTP Express. Permite emitir eventos globales, privados y a grupos de clientes conectados, facilitando la interacción instantánea entre cliente y servidor.

Incluye middleware para la verificación de tokens JWT con roles específicos y provee rutas para emisión de mensajes a través de sockets.

---

## 🔄 Flujo de funcionamiento

- El servidor Socket.IO se inicializa y configura con CORS abierto para aceptar conexiones desde cualquier origen.  
- Los clientes se conectan y pueden recibir eventos en tiempo real.  
- El microservicio expone rutas HTTP para emitir mensajes globales, privados (a un socket específico), o a todos menos al emisor.  
- Los middlewares de autenticación JWT aseguran que sólo usuarios autorizados puedan emitir eventos privados.

---

## 🚪 Rutas disponibles

| Ruta                         | Método | Descripción                                   | Seguridad     |
|------------------------------|--------|-----------------------------------------------|---------------|
| `/socket/broadcast`           | POST   | Envía un mensaje a todos los clientes         | Pública       |
| `/socket/private/:socketId`  | POST   | Envía un mensaje privado a un socket específico | JWT requerido |
| `/socket/broadcast-others`    | POST   | Envía un mensaje a todos menos al emisor      | Pública       |

---

## 🔐 Seguridad y autenticación

- Se usa middleware personalizado `verifyJWTCliente` para validar tokens JWT y verificar que el usuario tenga rol `cliente` o `admin` antes de permitir mensajes privados.  
- El microservicio consulta un API externa para validar tokens y obtener datos del usuario.  
- Rutas públicas permiten enviar mensajes globales y broadcast a todos menos al emisor sin autenticación.

---

## 📁 Estructura del proyecto (resumen)

- `controllers/socketController.js`: Inicializa y configura el servidor Socket.IO.  
- `middleware/verifyJWT.js`: Contiene middlewares para verificar roles de usuarios vía JWT.  
- `routes/socketRoutes.js`: Define rutas para emitir mensajes mediante sockets con seguridad integrada.  
- `app.js`: Configura Express, HTTP Server y Socket.IO, y levanta el servicio.

---

## 🧩 Uso y configuración

1. Define la URL del servicio de autenticación en `.env` con la variable `AUTH_API_URL`.  
2. Inicia el servidor, que quedará escuchando en el puerto definido por `PORT` (por defecto 4000).  
3. Los clientes pueden conectarse a Socket.IO para recibir eventos en tiempo real.  
4. Desde otro servicio o frontend, usa las rutas `/socket/*` para emitir mensajes globales o privados.

---

## 📬 Ejemplo de emisión de mensaje privado (requiere JWT válido)

```bash
POST /socket/private/abcd1234
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Actualización de imágenes disponible"
}
