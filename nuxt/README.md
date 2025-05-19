# Project Structure Overview

This document provides an overview of the project's directory structure, based on the output of `ls` commands. It outlines the main components and their organization within the `nuxt` project.

## Directory Structure

Here's a breakdown of the directories and files:

### Root Directory (`./`)

* **`components/`**: Contains Vue.js components.
* **`middleware/`**: Contains middleware files.
* **`pages/`**: Contains Vue.js pages (routing).
* **`plugins/`**: Contains Nuxt.js plugins.
* **`services/`**: Contains JavaScript service modules.
* **`stores/`**: Contains the application's state management.

### `components/`

* `GachaponSlot.vue`:  Related to the Gachapon feature.
* `GashaponMachine.vue`: Related to the Gashapon feature.
* `Loader.vue`:  A loading indicator component.
* `Navbar.vue`:  The navigation bar component.

### `middleware/`

* `redirect.global.js`: A global route middleware, likely for handling redirects.

### `pages/`

* `auth/`: Contains authentication-related pages.
* `dashboard.vue`: The main dashboard page.
* `gachapon/`: Contains pages related to the Gachapon feature.
* `graffiti/`: Contains pages related to the graffiti feature.
* `index.vue`: The main landing page.
* `profile/`: Contains pages related to user profiles.

### `pages/auth/`

* `callback.vue`:  Handles authentication callbacks (e.g., from an OAuth provider).
* `forgot-password.vue`:  Handles the forgot password functionality.
* `login.vue`:  The login page.
* `register.vue`:  The registration page.
* `reset-password.vue`: Handles resetting the user's password.
* `verify-register.vue`: Handles the email verification after registration.

### `pages/gachapon/`

* `index.vue`: Main page for the Gachapon feature.

### `pages/graffiti/`

* `settings.vue`: Settings page for the graffiti feature.

### `pages/profile/`

* `my-info.vue`: Page to display user's personal information.

### `plugins/`

* `socket.client.ts`:  A Nuxt.js plugin for Socket.IO client-side integration.
* `vue-cropper.js`: A Nuxt.js plugin for the Vue Cropper library (image cropping).

### `services/`

* `auth.js`:  Handles authentication-related logic.
* `gashapon.js`: Handles gashapon feature logic.
* `graffitis.js`: Handles graffiti feature logic.

### `stores/`

* `app.js`:  A Vuex store (or similar) for managing application-wide state.

## Summary

This project appears to be a web application built with Nuxt.js, featuring user authentication, a dashboard, a "Gachapon" system, and a "Graffiti" section.  It also includes user profile management, real-time communication (Socket.IO), and image cropping functionality.
