# 🛠️ Manual de Instalación - Backend

Este documento detalla los pasos necesarios para poner en marcha el backend del proyecto **lethal-run** en entornos **Windows** y **Linux**.

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) instalado (versión recomendada: 18.x o superior)
- `npm` instalado (incluido con Node.js)
- Base de datos MySQL o XAMPP en funcionamiento
- Archivos `.env` configurados correctamente (ver ejemplo `.env.example` en cada microservicio)

---

## 📦 Instalación de dependencias

Abre una terminal en la raíz del proyecto backend y ejecuta:

```bash
npm install
```

---

## 🚀 Despliegue del backend

# 🔵 En Windows

```bash
node deploy-windows.mjs
```

# 🟢 En Linux

```bash
node deploy-linux.js
```

---

## ❗ Notas importantes

- Asegúrate de que el servicio de MySQL esté corriendo antes de ejecutar el despliegue.

- El script de despliegue creará la base de datos, aplicará las migraciones y arrancará los servicios necesarios.

- Si ocurre algún error, revisa los mensajes en consola y asegúrate de que los archivos .env estén correctamente configurados.
