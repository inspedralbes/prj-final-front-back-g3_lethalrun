# 🚀 Manual de Instalación: LethalRun Frontend (Nuxt.js)

Este manual te guiará a través de los pasos necesarios para instalar y levantar el proyecto frontend de **LethalRun** en tu entorno local.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js**: Versión 18.x o superior (recomendado LTS).
- **Gestor de Paquetes**: `npm`, `pnpm`, `yarn` o `bun`. Se recomienda usar el mismo gestor de paquetes que se haya utilizado en el proyecto.

---

## 💻 Pasos de Instalación

Sigue estos pasos para poner en marcha el proyecto:

### 1. Clona el Repositorio

Si el proyecto no está en tu máquina local, clónalo desde su repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd lethalrun-frontend # Asegúrate de que el nombre de la carpeta sea correcto
```

---

### 2. Instala las Dependencias

Navega al directorio raíz del proyecto en tu terminal y ejecuta el comando de instalación de dependencias con tu gestor de paquetes preferido:

```bash
# Si usas npm
npm install

# Si usas pnpm
pnpm install

# Si usas yarn
yarn install

# Si usas bun
bun install
```

---

### 3. Configura las Variables de Entorno

El proyecto requiere variables de entorno para conectarse correctamente con los servicios de backend.

**a. Crea el archivo `.env`:**  
En la raíz del proyecto, copia el archivo de ejemplo `.env.copy` y renómbralo a `.env`:

```bash
cp .env.copy .env
```

**b. Edita el archivo `.env`:**  
Abre el archivo `.env` que acabas de crear y configura las siguientes variables con las URLs correctas de tus servicios de backend y el puerto deseado para Nuxt:

```env
# Puerto en el que Nuxt se ejecutará (por defecto es 3000 si no se especifica)
NUXT_PORT=3000

# URL base del servicio de autenticación
AUTH_URL=http://localhost:4000 # <-- Ajusta esto a la URL de tu servicio de Auth

# URL base del servicio de WebSockets (Socket.io)
SOCKET_URL=http://localhost:5000 # <-- Ajusta esto a la URL de tu servicio de Socket

# URL base para el almacenamiento de imágenes (ej. graffitis de usuarios)
IMAGES_URL=http://localhost:4000 # <-- Ajusta esto a la URL donde se sirven las imágenes

# Aunque MONGO_URL se define en nuxt.config.ts, no es directamente usado por el frontend.
# Es más para referencia o para si se necesitara en alguna operación SSR.
MONGO_URL=mongodb://localhost:27017/lethalrun # <-- Ajusta si es necesario, pero generalmente no afectará al frontend
```

> **Importante:**  
> Asegúrate de que las URLs de `AUTH_URL`, `SOCKET_URL` e `IMAGES_URL` correspondan a las direcciones donde tus servicios de backend estén corriendo.  
> Por ejemplo, si tu servicio de autenticación corre en el puerto `4000`, `AUTH_URL` debe ser `http://localhost:4000`.

---

### 4. Levanta el Servidor de Desarrollo de Nuxt

Una vez que las dependencias estén instaladas y el archivo `.env` configurado, puedes iniciar el servidor de desarrollo de Nuxt.js:

```bash
# Si usas npm
npm run dev

# Si usas pnpm
pnpm dev

# Si usas yarn
yarn dev

# Si usas bun
bun run dev
```

Esto iniciará el servidor de desarrollo y la aplicación estará accesible en tu navegador en la dirección:

[http://localhost:3000](http://localhost:3000)  
(o el puerto que hayas especificado en `NUXT_PORT`).
