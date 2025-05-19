# Visió general de l'estructura del projecte 📂

Aquest document proporciona una visió general de l'estructura de directoris del projecte, basada en la sortida de les comandes `ls`. Esbossa els components principals i la seva organització dins del projecte `nuxt`.

## Estructura del directori

Aquí teniu un resum dels directoris i fitxers:

### Directori arrel (`./`)

* **`components/`**: Conté components de Vue.js. ⚛️
    * [Veure detalls](#components)
* **`middleware/`**: Conté fitxers de middleware. ⚙️
    * [Veure detalls](#middleware)
* **`pages/`**: Conté pàgines de Vue.js (rutes). 📄
    * [Veure detalls](#pages)
* **`plugins/`**: Conté complements de Nuxt.js. 🔌
    * [Veure detalls](#plugins)
* **`services/`**: Conté mòduls de servei de JavaScript. 🛠️
    * [Veure detalls](#services)
* **`stores/`**: Conté la gestió de l'estat de l'aplicació. 🗄️
    * [Veure detalls](#stores)

## Detalls dels directoris

### `components/` <a name="components"></a>

* `GachaponSlot.vue`: Relacionat amb la funció Gachapon.
* `GashaponMachine.vue`: Relacionat amb la funció Gashapon.
* `Loader.vue`: Un component indicador de càrrega.
* `Navbar.vue`: El component de la barra de navegació.

### `middleware/` <a name="middleware"></a>

* `redirect.global.js`: Un middleware de ruta global, probablement per gestionar redireccions.

### `pages/` <a name="pages"></a>

* `auth/`: Conté pàgines relacionades amb l'autenticació.
* `dashboard.vue`: La pàgina principal del tauler de control.
* `gachapon/`: Conté pàgines relacionades amb la funció Gachapon.
* `graffiti/`: Conté pàgines relacionades amb la funció graffiti.
* `index.vue`: La pàgina d'aterratge principal.
* `profile/`: Conté pàgines relacionades amb els perfils d'usuari.

### `pages/auth/`

* `callback.vue`: Gestiona els retorns de trucada d'autenticació (per exemple, d'un proveïdor d'OAuth).
* `forgot-password.vue`: Gestiona la funcionalitat d'haver oblidat la contrasenya.
* `login.vue`: La pàgina d'inici de sessió.
* `register.vue`: La pàgina de registre.
* `reset-password.vue`: Gestiona el restabliment de la contrasenya de l'usuari.
* `verify-register.vue`: Gestiona la verificació del correu electrònic després del registre.

### `pages/gachapon/`

* `index.vue`: Pàgina principal de la funció Gachapon.

### `pages/graffiti/`

* `settings.vue`: Pàgina de configuració de la funció graffiti.

### `pages/profile/`

* `my-info.vue`: Pàgina per mostrar la informació personal de l'usuari.

### `plugins/` <a name="plugins"></a>

* `socket.client.ts`: Un complement de Nuxt.js per a la integració del costat del client de Socket.IO.
* `vue-cropper.js`: Un complement de Nuxt.js per a la biblioteca Vue Cropper (retall d'imatge).

### `services/` <a name="services"></a>

* `auth.js`: Gestiona la lògica relacionada amb l'autenticació.
* `gashapon.js`: Gestiona la lògica de la funció gashapon.
* `graffitis.js`: Gestiona la lògica de la funció graffiti.

### `stores/` <a name="stores"></a>

* `app.js`: Un magatzem Pinia (o similar) per gestionar l'estat de l'aplicació.

## Resum

Aquest projecte és una aplicació web construïda amb Nuxt.js, que inclou autenticació d'usuari, un tauler de control, un sistema "Gachapon" i una secció de "Graffiti". També inclou gestió de perfils d'usuari, comunicació en temps real (Socket.IO) i funcionalitat de retall d'imatge. S'utilitza Pinia per a la gestió de l'estat.
