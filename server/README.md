# 🧠 Backend - Lethal Run

Este repositorio contiene la implementación del backend para el juego **Lethal Run**, desarrollado con una arquitectura basada en microservicios. Cada servicio es responsable de una funcionalidad específica, lo que permite escalabilidad, mantenibilidad y resistencia ante fallos.

---

## 🏗️ Arquitectura General

El sistema está dividido en múltiples microservicios que se comunican principalmente mediante HTTP y, en ciertos casos, mediante sockets o mensajería.

- 🔁 **Escalabilidad:** Cada microservicio puede escalar de forma independiente.  
- 🧩 **Mantenibilidad:** Separación clara de responsabilidades.  
- 🛡️ **Resiliencia:** Los fallos en un servicio no afectan al sistema completo.

---

## 📁 Estructura del Proyecto

backend/
- ├── auth-service/ # Servicio de autenticación y manejo de tokens
- ├── images-service/ # Servicio de almacenamiento y gestión de graffitis
- ├── mongo-service/ # Servicio de gestión de datos en MongoDB (skins y gashapon)
- ├── socket-service/ # Servicio de comunicación en tiempo real
- └── sql-service/ # Servicio de gestión de datos en SQL (usuarios e imágenes)


---

## 🧩 Microservicios

### 🔐 [Auth Service](auth-service/README.md)

Gestión de autenticación y autorización:

- Registro y login de usuarios con verificación por email  
- Integración con autenticación de Google  
- JWT: generación, validación y verificación de sesiones  

---

### 🖼️ [Images Service](images-service/README.md)

Gestión de graffitis de usuario:

- Almacenamiento físico de archivos en el servidor  
- Registro de rutas en SQL  
- Procesamiento y optimización de imágenes  

---

### 🎨 [Mongo Service](mongo-service/README.md)

Sistema de cosméticos y gashapon:

- Registro y gestión de skins  
- Desbloqueo de slots  
- Persistencia en MongoDB  

---

### 📡 [Socket Service](socket-service/README.md)

Comunicación en tiempo real:

- Enrutamiento de mensajes por socket ID  
- Notificaciones  
- Canal bidireccional entre cliente y servidor  

---

### 🗃️ [SQL Service](sql-service/README.md)

Gestión de datos relacionales:

- Almacenamiento de usuarios  
- Asociación de usuarios con imágenes  
- Operaciones CRUD sobre base de datos SQL  

---

## 🔄 Flujo de Comunicación

1. El cliente envía una petición al microservicio correspondiente.  
2. El microservicio valida el token con Auth Service.  
3. Si es válido, se procesa la petición y se comunica con otros servicios si es necesario.  
4. El resultado se devuelve al cliente.

---

## 🧰 Requisitos del Sistema

- 🟢 Node.js (v14 o superior)  
- 🍃 MongoDB o MongoDB Atlas
- 🐘 MySQL  
- 🚦 Nginx *(para entorno de producción)*

---

## ⚙️ Instalación y Configuración

Consulta la guía completa de instalación en 📄 [MANUAL_INSTALACIÓN.md](./MANUAL_INSTALACIÓN.md)
