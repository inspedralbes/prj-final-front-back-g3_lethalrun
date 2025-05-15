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


