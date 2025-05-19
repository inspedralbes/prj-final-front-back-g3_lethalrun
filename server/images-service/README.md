# 🖼️ Microservicio de Gestión de Imágenes de Usuario

## 📖 Descripción general

Este microservicio permite la gestión completa de imágenes de usuario, incluyendo la **subida**, **eliminación**, **consulta**, y **configuración de imagen activa**. Además, soporta la **copia de una imagen por defecto** para nuevos usuarios, y comunica cambios a otros servicios mediante **notificaciones vía sockets**.

Las imágenes se almacenan físicamente en el servidor, y la información de las imágenes se sincroniza con un servicio SQL externo.

---

## 🔄 Flujo de funcionamiento

1. **Subida de imagen personalizada**:  
   - El usuario envía una imagen que se guarda localmente y se registra en la base de datos SQL.  
   - Se notifica el cambio a través de sockets para actualizar la vista del usuario en tiempo real.

2. **Copia de imagen por defecto**:  
   - Para nuevos usuarios o cuando no tienen imagen personalizada, se copia una imagen default a su carpeta.  
   - La copia se registra en el servicio SQL.

3. **Consulta de imágenes**:  
   - Se puede obtener el listado de imágenes asociadas a un usuario.  
   - También se puede consultar cuál es la imagen activa para mostrarla como avatar o portada.

4. **Cambio de imagen activa**:  
   - El usuario puede establecer una imagen como activa.  
   - Esto actualiza el registro en la base de datos y dispara notificación por socket.

5. **Eliminación de imágenes**:  
   - Se puede eliminar una imagen, tanto en almacenamiento local como en base de datos.  
   - Se notifica el cambio para que otros servicios o interfaces puedan actualizarse.

6. **Eliminación total del directorio de imágenes de un usuario**:  
   - Permite borrar todas las imágenes y la carpeta del usuario, para limpiezas o bajas de cuenta.

---

## 🌐 Integración con otros servicios

- Se comunica con un **servicio SQL externo** para mantener la información sincronizada.  
- Las notificaciones de cambio se envían vía **socket.io** u otro servicio de websockets para actualizaciones en tiempo real.  
- La autenticación se realiza con **tokens JWT**, integrándose con sistemas de autenticación externos.

---

## 🚪 Rutas disponibles

| Ruta                                             | Método | Descripción                                              | Seguridad      |
|--------------------------------------------------|--------|----------------------------------------------------------|----------------|
| `/pictures/create-picture`                        | POST   | Subir imagen personalizada y notificar cambio           | JWT requerido  |
| `/pictures/create-default-picture/:userId`       | POST   | Copiar imagen default a usuario                           | Pública        |
| `/pictures/get-user-pictures/:userId`             | GET    | Obtener todas las imágenes de un usuario                  | JWT requerido  |
| `/pictures/get-active-picture/:userId`            | GET    | Obtener la imagen activa de un usuario                     | JWT requerido  |
| `/pictures/set-active-picture/:pictureId/:userId` | PUT    | Establecer una imagen como activa y notificar             | JWT requerido  |
| `/pictures/delete-picture/:id/:fileName/:userId`  | DELETE | Eliminar imagen y notificar cambio                         | JWT requerido  |
| `/pictures/delete-user/:userId`                    | DELETE | Eliminar todas las imágenes y carpeta de un usuario       | JWT requerido  |

---

## 🔐 Seguridad y configuración

- Validación y autorización mediante **middleware JWT** para proteger rutas sensibles.  
- Variables de entorno para configurar URLs de servicios externos (SQL, sockets), puerto y secretos JWT.  
- Manejo de almacenamiento seguro de imágenes en el servidor con cuidado en nombres y rutas para evitar colisiones y accesos no autorizados.

---

## 📁 Estructura de almacenamiento

- Las imágenes se guardan en carpetas separadas por usuario: `/images/users/{userId}/`  
- Imagen default ubicada en `/images/default/default.png`  
- El sistema mantiene la consistencia entre el almacenamiento físico y la base de datos externa.

---

## 📨 Notificaciones en tiempo real

- Cada cambio en imágenes (subida, eliminación, cambio activo) genera una notificación vía socket para que los clientes puedan actualizarse dinámicamente.

---

## ⚙️ Explicación del archivo `.env.example` para el Microservicio de Gestión de Imágenes de Usuario

Este apartado describe cada variable de entorno necesaria para el correcto funcionamiento del microservicio de imágenes, su propósito y cómo configurarlas según tu entorno.

---

### 🗂️ Variables del archivo `.env.example`

| Variable         | Descripción                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------|
| `API_SQL_URL`    | URL del microservicio SQL externo encargado de almacenar y gestionar la información de imágenes (por ejemplo, rutas, nombres, estado activo, etc.). Debe apuntar al endpoint REST del servicio SQL. Ejemplo: `http://sql-service:5000` |
| `SOCKET_API_URL` | URL del servidor de sockets (por ejemplo, usando **socket.io**) para enviar notificaciones en tiempo real a otros servicios o clientes cuando hay cambios en las imágenes. Ejemplo: `http://localhost:6000` |
| `AUTH_API_URL`   | URL del microservicio de autenticación encargado de validar los tokens JWT de los usuarios. Este endpoint se usa para proteger las rutas sensibles del microservicio de imágenes. Ejemplo: `http://auth-service:3000` |
| `PORT`           | Puerto en el que se ejecutará este microservicio de imágenes. Ejemplo: `7000`                 |

---

### 📝 ¿Cómo configurar cada variable?

- **API_SQL_URL**:  
  Debe ser la URL base del microservicio SQL que gestiona la base de datos de imágenes. Si ejecutas todo en local con Docker, probablemente sea algo como `http://sql-service:5000`. Si usas servicios en la nube, pon la URL pública o privada correspondiente.

- **SOCKET_API_URL**:  
  Es la URL del servidor de sockets (websockets/socket.io) que permite la comunicación en tiempo real. El microservicio de imágenes lo usará para emitir eventos cuando un usuario sube, elimina o cambia su imagen activa, permitiendo que otras partes del sistema (por ejemplo, el frontend) se actualicen automáticamente.

- **AUTH_API_URL**:  
  Es la URL del microservicio de autenticación. Todas las rutas protegidas (subida, eliminación, consulta de imágenes) validarán el JWT del usuario haciendo una petición a este servicio. Así, solo los usuarios autenticados pueden modificar imágenes.

- **PORT**:  
  Puerto en el que se levantará el microservicio de imágenes. Si no tienes conflictos, puedes usar el valor por defecto (por ejemplo, `7000`), o cambiarlo según tus necesidades.

---

### 🔒 Recomendaciones de seguridad y buenas prácticas

- **No expongas el microservicio de imágenes directamente a Internet**. Usa un API Gateway o proxy para controlar el acceso.
- **Protege las rutas sensibles** usando JWT y validando siempre con el microservicio de autenticación.
- **Mantén las URLs actualizadas** si cambias puertos, dominios o despliegas en producción.
- **No almacenes archivos confidenciales en el mismo directorio de imágenes**; separa el almacenamiento de imágenes de otros recursos sensibles.

---

### 💡 Ejemplo de un archivo `.env` configurado


