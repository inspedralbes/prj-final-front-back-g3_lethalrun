# 🗃️ Microservicio SQL para Gestión de Usuarios e Imágenes

## 📖 Descripción general

Este microservicio se encarga de gestionar usuarios e imágenes en una base de datos MySQL usando **Sequelize**.  
Incluye funcionalidades para crear, actualizar, eliminar y obtener usuarios, así como para manejar imágenes asociadas a cada usuario, con soporte para activar imágenes específicas.

---

## 🔄 Flujo de funcionamiento

- Al iniciar, el servicio verifica que la base de datos exista y la crea si no está presente.  
- Luego, sincroniza las tablas automáticamente según los modelos definidos.  
- Si la tabla de usuarios está vacía, inserta un usuario y una imagen de prueba por defecto.  
- Expone rutas REST para gestionar usuarios (`/sql/users`) e imágenes (`/sql/pictures`).

---

## 🚪 Rutas disponibles

### Usuarios (`/sql/users`)

| Ruta                 | Método | Descripción                             |
|----------------------|--------|---------------------------------------|
| `/`                  | POST   | Crear un usuario nuevo                 |
| `/:id`               | GET    | Obtener usuario por ID                 |
| `/by-email/:email`   | GET    | Obtener usuario por email              |
| `/:id/username`      | PUT    | Actualizar nombre de usuario           |
| `/:id/password`      | PUT    | Actualizar contraseña (se hashea)      |
| `/:id`               | DELETE | Eliminar usuario y sus datos asociados |

### Imágenes (`/sql/pictures`)

| Ruta                        | Método | Descripción                                  |
|-----------------------------|--------|----------------------------------------------|
| `/create/:userId`            | POST   | Crear imagen personalizada para un usuario  |
| `/set-active/:pictureId/:userId` | PUT    | Establecer imagen como activa para usuario   |
| `/active/:userId`            | GET    | Obtener imagen activa de un usuario          |
| `/delete/:id/:userId`        | DELETE | Eliminar una imagen de usuario                |
| `/all/:userId`               | GET    | Obtener todas las imágenes de un usuario     |

---

## 🧩 Uso y configuración

- El microservicio carga la configuración de la base de datos y otras variables de entorno usando `dotenv`.  
- Usa Sequelize para gestionar la conexión y sincronización con MySQL.  
- Los modelos se cargan dinámicamente desde el directorio de modelos.  
- Al sincronizar, se crean o actualizan las tablas según los modelos definidos.  
- Las contraseñas se almacenan hasheadas con bcrypt para mayor seguridad.  
- Incluye validaciones básicas en las rutas para asegurar que se reciban los campos necesarios.

---

## 📁 Estructura principal del proyecto

- `models/index.js`: Inicializa la base de datos, verifica existencia, carga modelos y sincroniza tablas.  
- `routes/sql/users.js`: Rutas para operaciones CRUD sobre usuarios.  
- `routes/sql/pictures.js`: Rutas para gestión de imágenes de usuarios.  
- `controllers/`: Controladores que implementan la lógica para usuarios e imágenes.

---

## ⚙️ Explicación del archivo `.env.example` para el Microservicio SQL de Gestión de Usuarios e Imágenes

Este apartado describe el propósito de cada variable de entorno necesaria para la correcta configuración y funcionamiento del microservicio SQL, así como recomendaciones de uso seguro con Sequelize y MySQL.

---

### 🗂️ Variables del archivo `.env.example`

| Variable         | Descripción                                                                                                   |
|------------------|---------------------------------------------------------------------------------------------------------------|
| `DB_NAME`        | Nombre de la base de datos MySQL que usará Sequelize. Ejemplo: `usersdb`                                      |
| `DB_USER`        | Usuario de la base de datos MySQL con permisos para crear, leer y modificar tablas y registros.               |
| `DB_PASSWORD`    | Contraseña del usuario de la base de datos.                                                                   |
| `DB_HOST`        | Host o dirección donde corre el servidor MySQL (por ejemplo, `localhost` o la IP del servidor de base de datos). |
| `DB_PORT`        | Puerto en el que escucha MySQL, normalmente `3306`.                                                           |
| `DB_DIALECT`     | Dialecto de la base de datos, debe ser `mysql` para este microservicio.                                       |
| `PORT`           | Puerto en el que se ejecuta el microservicio SQL. Ejemplo: `5000`                                             |
| `IMAGES_API_URL` | URL del microservicio de imágenes para gestionar rutas y metadatos asociados a imágenes de usuario.           |
| `SLOTS_API_URL`  | URL del microservicio de skins/slots (Mongo Service) para integración y consultas cruzadas.                   |

---

### 📝 ¿Cómo configurar cada variable?

- **DB_NAME**:  
  Especifica el nombre de la base de datos MySQL que el microservicio gestionará. Debes crear esta base de datos en tu servidor MySQL antes de iniciar el servicio, o bien permitir que Sequelize la cree automáticamente si tienes los permisos necesarios.

- **DB_USER** y **DB_PASSWORD**:  
  Credenciales del usuario de MySQL con permisos para operar sobre la base de datos definida. Es recomendable usar un usuario dedicado para este microservicio y no el usuario root.

- **DB_HOST** y **DB_PORT**:  
  Dirección y puerto donde está desplegado MySQL. En desarrollo suele ser `localhost:3306`, pero en producción puede ser la IP o dominio de un servidor externo o gestionado.

- **DB_DIALECT**:  
  Define el tipo de base de datos. Para MySQL, debe ser `mysql`. Sequelize utiliza este valor para adaptar las consultas al dialecto correspondiente.

- **PORT**:  
  Puerto en el que el microservicio SQL escuchará peticiones HTTP REST. Puedes elegir el que mejor se adapte a tu entorno, por ejemplo, `5000`.

- **IMAGES_API_URL**:  
  URL del microservicio de imágenes. El servicio SQL lo utiliza para coordinar operaciones relacionadas con imágenes de usuario, como rutas o metadatos.

- **SLOTS_API_URL**:  
  URL del microservicio de slots/skins (Mongo Service), permitiendo la integración y consulta de información adicional de usuario desde otros servicios.

---

### 🔒 Recomendaciones de seguridad y buenas prácticas

- **Nunca subas tu archivo `.env` con credenciales reales a repositorios públicos**. Usa archivos `.env.example` para compartir la estructura de configuración, pero mantén los valores sensibles fuera del control de versiones.
- **Utiliza variables de entorno** para separar la configuración del código fuente, facilitando el despliegue en distintos entornos (desarrollo, test, producción).
- **Concede permisos mínimos** al usuario de base de datos utilizado por el microservicio.
- **Revisa y actualiza las URLs** de los servicios externos si cambias puertos, dominios o despliegas en producción.
- **Gestiona las migraciones y sincronización** de tablas con Sequelize para mantener la integridad del esquema de la base de datos.

---

### 💡 Ejemplo de un archivo `.env` configurado
```bash
DB_NAME=usersdb
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

PORT=5000
IMAGES_API_URL=http://localhost:7000
SLOTS_API_URL=http://localhost:8000
```

---

Con estas variables correctamente configuradas, el microservicio podrá gestionar usuarios e imágenes de forma segura y eficiente, integrándose con el resto de la arquitectura basada en microservicios y siguiendo las mejores prácticas de Node.js y Sequelize[2][5][6][8].



