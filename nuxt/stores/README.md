# 💾 app.js (Pinia Store)

Este archivo (`app.js`) define el **store principal de Pinia** para la aplicación "Lethal Run". Su función principal es gestionar el **estado global** de la aplicación, incluyendo la información del usuario y el estado de autenticación.

---

## 🎯 Propósito

El `useAppStore` es crucial para mantener la **consistencia de los datos** a lo largo de toda la aplicación. Centraliza la información del usuario y el token de autenticación, permitiendo que cualquier componente acceda a estos datos de forma sencilla y reactiva. Además, utiliza el `localStorage` del navegador para **persistir la sesión del usuario** y su información básica, evitando que se pierdan al recargar la página.

---

## 🧩 Contenido del Store

### 1. Estado (`state`)

El estado de la aplicación se inicializa con los siguientes datos:

* **`user`**: Un objeto que contiene la información del usuario autenticado. Se intenta cargar desde el `localStorage` al iniciar la aplicación. Si no hay datos en `localStorage`, se utiliza un objeto `user` con valores predeterminados (ejemplo).
    * `id`: ID del usuario.
    * `email`: Correo electrónico del usuario.
    * `username`: Nombre de usuario.
    * `xp`: Puntos de experiencia.
    * `play_time`: Tiempo de juego.
    * `rol`: Rol del usuario (ej. "admin", "jugador").
    * `createdAt`: Fecha de creación de la cuenta.
    * `updatedAt`: Fecha de la última actualización.
* **`token`**: El token de autenticación del usuario. También se intenta cargar desde el `localStorage`. Si no existe, se inicializa como una cadena vacía.
* **`isAuthenticated`**: Un booleano que indica si el usuario está actualmente autenticado.

### 2. Getters (`getters`)

Los getters son funciones que permiten acceder a los datos del estado de forma calculada.

* **`getUser`**: Devuelve el objeto `user` completo.
* **`getIsAuthenticated`**: Devuelve el valor booleano de `isAuthenticated`.

### 3. Acciones (`actions`)

Las acciones son funciones que modifican el estado de la aplicación y pueden incluir lógica asíncrona.

* **`setUser(userData)`**:
    * Establece el objeto `user` completo en el estado.
    * **Persiste** el objeto `user` en el `localStorage` para recordar la sesión.
* **`setToken(token)`**:
    * Establece el token de autenticación en el estado.
    * **Persiste** el token en el `localStorage`.
* **`setNewUsername(newUsername)`**:
    * Actualiza únicamente el `username` dentro del objeto `user` en el estado.
    * *Nota: Esta acción solo modifica el estado interno; para persistir el objeto `user` actualizado en `localStorage` después de cambiar el nombre de usuario, deberías llamar a `setUser` con el objeto `user` modificado.*
* **`setIsAuthenticated(value)`**:
    * Establece el estado de autenticación a `true` o `false`.

---

## 🛠️ Uso

Para utilizar este store en cualquier componente o página de Nuxt.js, simplemente impórtalo y úsalo de la siguiente manera:

```vue
<script setup>
import { useAppStore } from '@/stores/app';
import { onMounted } from 'vue';

const appStore = useAppStore();

onMounted(() => {
  // Acceder a la información del usuario
  console.log('Usuario:', appStore.getUser);
  console.log('Autenticado:', appStore.getIsAuthenticated);

  // Ejemplo de cómo establecer un usuario (después de un login, por ejemplo)
  // appStore.setUser({ id: 1, username: 'NuevoJugador', ... });

  // Ejemplo de cómo establecer el token
  // appStore.setToken('tu_token_jwt_aqui');

  // Ejemplo de cómo cambiar el nombre de usuario
  // appStore.setNewUsername('LethalGamer');
});
</script>

<template>
  <div>
    <h1>Bienvenido, {{ appStore.user.username }}</h1>
    <p v-if="appStore.isAuthenticated">Estás autenticado.</p>
    <p v-else>No estás autenticado.</p>
  </div>
</template>