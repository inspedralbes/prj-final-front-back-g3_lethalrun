
# 🎮 Lethal Run

**Lethal Run** es un juego multijugador 3D de plataformas en el que un jugador intenta eliminar a los demás mediante trampas, mientras los otros intentan llegar al final del recorrido. El juego permite la personalización de cosméticos y fomenta la interacción entre jugadores.

Este repositorio contiene la implementación del backend para el juego **"Lethal Run"** desarrollado en Unity. El backend está compuesto por una arquitectura de microservicios que gestiona la autenticación de usuarios, almacenamiento de imágenes, gestión de datos y comunicación en tiempo real.

## 👥 Integrantes

- David Salvador Sosa  
- Marc Rojano González  
- Brian Orozco Poyato  
- Izan De La Cruz Espejo

## 🕹️ Nombre

**Lethal Run**

## 📝 Descripción

Juego multijugador 3D de plataformas donde un jugador intenta eliminar a los demás con las trampas colocadas en el mapa y los otros intentan llegar al final del recorrido. Además, podrás personalizar algunos de tus cosméticos para interactuar con otros jugadores.

## 🔗 URLs

- 🌲 **TAIGA:** [https://tree.taiga.io/project/a23izadelesp-lethal-run](https://tree.taiga.io/project/a23izadelesp-lethal-run)  
- 🎨 **PENPOT:** *[Pendiente de actualización]*

## 🚧 Estado

Estamos creando las bases de nuestro proyecto con buenas prácticas.

---

## 🏗️ Arquitectura General

El backend está diseñado utilizando una arquitectura de microservicios, donde cada servicio es responsable de un conjunto específico de funcionalidades. Esta arquitectura proporciona:

- 🔁 **Escalabilidad:** Cada servicio puede escalar de forma independiente según sus necesidades.  
- 🧩 **Mantenibilidad:** La separación de responsabilidades facilita el mantenimiento y la evolución del código.  
- 🛡️ **Resistencia a fallos:** La independencia entre servicios evita que el fallo de uno afecte a todo el sistema.

## 📁 Estructura del Proyecto

backend/
├── auth-service/ # Servicio de autenticación y manejo de tokens
├── images-service/ # Servicio de almacenamiento y gestión de graffitis
├── mongo-service/ # Servicio de gestión de datos en MongoDB (skins y gashapon)
├── socket-service/ # Servicio de comunicación en tiempo real
└── sql-service/ # Servicio de gestión de datos en SQL (usuarios e imágenes)


---

## 🧩 Descripción de los Microservicios

### 🔐 [Auth Service](auth-service/README.md)

*Gestiona la autenticación y autorización de usuarios en el sistema:*

- Registro y login de usuarios con verificación por email  
- Integración con autenticación de Google  
- Generación y validación de tokens JWT  
- Verificación de sesiones para otros microservicios  

---

### 🖼️ [Images Service](images-service/README.md)

*Maneja el almacenamiento y gestión de los graffitis creados por los usuarios:*

- Almacenamiento físico de archivos de imagen en el servidor  
- Comunicación con SQL Service para registrar las rutas de las imágenes  
- Optimización y procesamiento de imágenes subidas  

---

### 🎨 [Mongo Service](mongo-service/README.md)

*Administra la información relacionada con las skins y el sistema de gashapon:*

- Registro de skins obtenidas por los usuarios  
- Gestión del desbloqueo de slots en el sistema gashapon  
- Persistencia de datos en MongoDB para acceso rápido  

---

### 📡 [Socket Service](socket-service/README.md)

*Implementa la comunicación en tiempo real para diferentes funcionalidades del juego:*

- Enrutamiento de mensajes a socket IDs específicos  
- Notificaciones en tiempo real  
- Comunicación bidireccional entre el cliente y el servidor  

---

### 🗃️ [SQL Service](sql-service/README.md)

*Gestiona la persistencia de datos relacionados con usuarios e imágenes:*

- Almacenamiento de información de usuarios  
- Asociación entre usuarios y sus imágenes (graffitis)  
- Consultas y operaciones CRUD sobre la base de datos SQL  

---

## 🔄 Flujo de Comunicación

Los microservicios se comunican entre sí principalmente mediante peticiones HTTP y en algunos casos mediante mensajería. El flujo típico de comunicación es:

1. 🧍 El cliente (juego o web) envía una petición al servicio correspondiente.  
2. 🛡️ El servicio consulta con el Auth Service para validar el token del usuario.  
3. ⚙️ Si la validación es exitosa, el servicio procesa la petición, comunicándose con otros servicios si es necesario.  
4. 📬 El servicio devuelve la respuesta al cliente.

---

## 🧰 Requisitos del Sistema

- 🟢 Node.js (v14 o superior)  
- 🍃 MongoDB  
- 🐘 MySQL/PostgreSQL  
- 🧠 Redis *(opcional, para caché)*  
- 🚦 Nginx *(para producción)*

---

## ⚙️ Configuración e Instalación

Cada microservicio contiene su propio archivo de configuración e instrucciones de instalación. Consulta la documentación específica de cada servicio para más detalles.

### 🛠️ Configuración General

Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/lethal-run-backend.git
cd lethal-run-backend
