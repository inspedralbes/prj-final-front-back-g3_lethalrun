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
```

---

## ⚙️ Explicación del archivo `.env.example` para el Microservicio de Comunicación en Tiempo Real con Socket.IO

Este apartado describe el propósito de cada variable de entorno utilizada por el microservicio de sockets y cómo debes configurarlas para asegurar una integración segura y funcional con el resto de tu arquitectura.

---

### 🗂️ Variables del archivo `.env.example`

| Variable       | Descripción                                                                                                    |
|----------------|----------------------------------------------------------------------------------------------------------------|
| `PORT`         | Puerto en el que se ejecuta el microservicio de sockets. Ejemplo: `4000`                                       |
| `AUTH_API_URL` | URL del microservicio de autenticación encargado de validar los tokens JWT de los usuarios. Ejemplo: `http://auth-service:3000` |

---

### 📝 ¿Cómo configurar cada variable?

- **PORT**:  
  Define el puerto en el que el servicio escuchará conexiones HTTP y de Socket.IO. Puedes usar el valor por defecto (`4000`) o cualquier otro según tu entorno y disponibilidad de puertos.

- **AUTH_API_URL**:  
  Es la URL del microservicio de autenticación que se usará para validar los tokens JWT de los usuarios que intenten emitir mensajes privados o acceder a funcionalidades protegidas. Este endpoint se consulta desde los middlewares de autenticación en el microservicio de sockets para comprobar la validez y el rol del usuario antes de permitir ciertas acciones.

---

### 🔒 Recomendaciones de seguridad y buenas prácticas

- **Protege las rutas privadas** usando JWT y valida siempre el token con el microservicio de autenticación antes de permitir la emisión de mensajes privados o sensibles[1][2][5].
- **No expongas el microservicio directamente a Internet** sin un proxy o firewall, especialmente en producción.
- **Mantén las URLs actualizadas** si cambias puertos, dominios o despliegas en producción.
- **Configura correctamente CORS** en Socket.IO para limitar los orígenes permitidos según tus necesidades de seguridad.

---

### 💡 Ejemplo de un archivo `.env` configurado

```bash
PORT=4000
AUTH_API_URL=http://localhost:3000
```


---

Con estas variables correctamente configuradas, el microservicio podrá gestionar la comunicación en tiempo real de forma segura, permitiendo la integración con sistemas de autenticación externos y asegurando que sólo usuarios autorizados puedan acceder a las funcionalidades protegidas.



