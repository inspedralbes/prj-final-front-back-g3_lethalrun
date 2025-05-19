# 🧩 Microservicio de Gestión de Slots de Usuario

## 📖 Descripción general

Este microservicio administra la configuración de **slots** para usuarios, permitiendo la creación de usuarios con slots predeterminados, la activación y desbloqueo de slots específicos, así como la consulta y modificación de sus estados.

Los datos se almacenan en **MongoDB Atlas** y el microservicio cuenta con autenticación basada en **tokens JWT** para garantizar la seguridad en las operaciones de usuario.

---

## 🔄 Flujo de funcionamiento

1. **Creación de usuario con slots iniciales**:  
   - Se crea un usuario con tres slots configurados, donde el primer slot está activo y desbloqueado por defecto.

2. **Activar un slot específico**:  
   - Permite activar un slot entre los tres disponibles, desactivando los demás.  
   - Sólo se puede activar un slot si está desbloqueado.

3. **Desbloquear un slot**:  
   - Permite cambiar el estado de un slot para hacerlo accesible y activable por el usuario.

4. **Modificar número asociado a un slot**:  
   - Se puede cambiar el número identificador del slot activo o desbloqueado.

5. **Consulta de estado de slots**:  
   - Obtener el estado actual (activo, desbloqueado, número) de los slots de un usuario.

---

## 🌐 Integración con otros servicios

- Utiliza **MongoDB Atlas** para almacenamiento y consulta de datos.  
- Se autentica mediante **JWT**, integrándose con sistemas de autenticación externos.  
- Puede ser consumido por otros microservicios o aplicaciones frontend que requieran información o gestión de slots.

---

## 🚪 Rutas disponibles

| Ruta                            | Método | Descripción                                         | Seguridad     |
|--------------------------------|--------|----------------------------------------------------|---------------|
| `/slots/create-user`            | POST   | Crear usuario con tres slots iniciales             | JWT requerido |
| `/slots/get-user-slots/:userId`| GET    | Obtener información de los slots de un usuario     | JWT requerido |
| `/slots/activate-slot`          | PUT    | Activar un slot específico (si está desbloqueado) | JWT requerido |
| `/slots/unlock-slot`            | PUT    | Desbloquear un slot                                 | JWT requerido |
| `/slots/update-slot-number`    | PUT    | Modificar número de un slot                          | JWT requerido |

---

## 🔐 Seguridad y configuración

- Protección de rutas mediante middleware JWT.  
- Variables de entorno para conexión a MongoDB Atlas, puerto y secretos JWT.  
- Validaciones internas para asegurar que sólo slots desbloqueados puedan activarse.

---

## 📁 Estructura de datos (MongoDB)

Ejemplo de documento de usuario con slots:

```json
{
  "_id": "userId123",
  "slots": {
    "slot1": {
      "activo": true,
      "desbloqueado": true,
      "numero": 1
    },
    "slot2": {
      "activo": false,
      "desbloqueado": false,
      "numero": 0
    },
    "slot3": {
      "activo": false,
      "desbloqueado": false,
      "numero": 0
    }
  }
}
```

---

## ⚙️ Explicación del archivo `.env.example` para el Microservicio de Gestión de Slots de Usuario

Este apartado describe el propósito de cada variable de entorno que utiliza el microservicio de slots y cómo debes configurarlas para un despliegue seguro y funcional.

---

### 🗂️ Variables del archivo `.env.example`

| Variable       | Descripción                                                                                                              |
|----------------|--------------------------------------------------------------------------------------------------------------------------|
| `PORT`         | Puerto en el que se ejecuta el microservicio de slots. Ejemplo: `8000`                                                   |
| `MONGODB_URI`  | URI de conexión a la base de datos MongoDB Atlas donde se almacenan los datos de los usuarios y sus slots.               |
| `AUTH_API_URL` | URL del microservicio de autenticación encargado de validar los tokens JWT de los usuarios. Ejemplo: `http://auth:3000`  |

---

### 📝 ¿Cómo configurar cada variable?

- **PORT**:  
  Define el puerto en el que el servicio escuchará peticiones HTTP. Si no hay conflicto, puedes usar el valor por defecto (`8000`) o cualquier otro según tu entorno.

- **MONGODB_URI**:  
  Es la URI de conexión a tu instancia de MongoDB Atlas. Debe incluir el usuario, contraseña, dirección del clúster y el nombre de la base de datos. Ejemplo de formato:
```bash
mongodb+srv://usuario:contraseña@cluster0.ejemplo.mongodb.net/nombreBaseDatos?retryWrites=true&w=majority
```

Asegúrate de no exponer esta URI en repositorios públicos, ya que contiene credenciales sensibles.

- **AUTH_API_URL**:  
Es la URL del microservicio de autenticación. Todas las rutas protegidas validarán el JWT del usuario haciendo una petición a este servicio. Así, solo usuarios autenticados pueden consultar o modificar slots.

---

### 🔒 Recomendaciones de seguridad y buenas prácticas

- **Nunca subas tu archivo `.env` con credenciales reales a repositorios públicos**. Usa archivos `.env.example` sin datos sensibles para compartir la estructura de configuración[5].
- **Utiliza variables de entorno para separar la lógica del código de la configuración**. Esto facilita el despliegue en diferentes entornos y protege información crítica[5].
- **Revisa y actualiza las URLs** si cambias puertos, dominios o despliegas en producción.
- **Asegura tu base de datos MongoDB Atlas** restringiendo el acceso solo a IPs autorizadas y usando usuarios con permisos mínimos necesarios.

---

### 💡 Ejemplo de un archivo `.env` configurado
```bash
PORT=8000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/slotsDB?retryWrites=true&w=majority
AUTH_API_URL=http://localhost:3000
```


---

Con estas variables correctamente configuradas, el microservicio podrá gestionar los slots de usuario de forma segura, escalable y desacoplada del resto de la arquitectura, siguiendo las mejores prácticas de microservicios.



