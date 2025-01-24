# API Endpoints Documentation

## Base URL:

---

## General

### **Root Route**
- **GET** `/`
  - **Description:** Returns a message confirming the server is running.
  - **Response:**
    ```json
    {
      "message": "RUTA GET CORRECTA"
    }
    ```

---

## Users

### **Create User**
- **POST** `/users`
  - **Description:** Creates a new user and assigns a default picture.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "username": "username",
      "password": "password123",
      "rol": "cliente"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "message": "Usuario creado exitosamente con imagen por defecto"
    }
    ```

### **Get User by ID**
- **GET** `/users/:id`
  - **Description:** Retrieves user details by ID.
  - **Response:**
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "xp": 0,
      "play_time": 0,
      "rol": "cliente"
    }
    ```

### **Update User**
- **PUT** `/users/:id`
  - **Description:** Updates a user's information.
  - **Request Body:**
    ```json
    {
      "email": "new_email@example.com",
      "username": "new_username",
      "xp": 100,
      "playTime": 50,
      "rol": "admin"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Usuario actualizado exitosamente"
    }
    ```

### **Delete User**
- **DELETE** `/users/:id`
  - **Description:** Deletes a user by ID.
  - **Response:**
    ```json
    {
      "message": "Usuario eliminado exitosamente"
    }
    ```

### **Update User Email**
- **PUT** `/users/:id/email`
  - **Description:** Updates a user's email.
  - **Request Body:**
    ```json
    {
      "email": "new_email@example.com"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Email de usuario actualizado exitosamente"
    }
    ```

### **Update User Username**
- **PUT** `/users/:id/username`
  - **Description:** Updates a user's username.
  - **Request Body:**
    ```json
    {
      "username": "new_username"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Nombre de usuario actualizado exitosamente"
    }
    ```

### **Update User Password**
- **PUT** `/users/:id/password`
  - **Description:** Updates a user's password.
  - **Request Body:**
    ```json
    {
      "newPassword": "new_password123"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Contraseña de usuario actualizada exitosamente"
    }
    ```

### **Update User XP**
- **PUT** `/users/:id/xp`
  - **Description:** Updates a user's XP.
  - **Request Body:**
    ```json
    {
      "xp": 500
    }
    ```
  - **Response:**
    ```json
    {
      "message": "XP de usuario actualizado exitosamente"
    }
    ```

### **Update User Play Time**
- **PUT** `/users/:id/playtime`
  - **Description:** Updates a user's play time.
  - **Request Body:**
    ```json
    {
      "playTime": 120
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Tiempo de juego de usuario actualizado exitosamente"
    }
    ```

### **Update User Role**
- **PUT** `/users/:id/rol`
  - **Description:** Updates a user's role.
  - **Request Body:**
    ```json
    {
      "rol": "moderator"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Rol de usuario actualizado exitosamente"
    }
    ```

---

## Pictures

### **Create Picture**
- **POST** `/pictures`
  - **Description:** Creates a new picture.
  - **Request Body:**
    ```json
    {
      "path": "path/to/image.png",
      "userId": 1
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "message": "Imagen creada exitosamente"
    }
    ```

### **Get Picture by ID**
- **GET** `/pictures/:id`
  - **Description:** Retrieves a picture by ID.
  - **Response:**
    ```json
    {
      "id": 1,
      "path": "path/to/image.png",
      "user_id": 1
    }
    ```

### **Update Picture**
- **PUT** `/pictures/:id`
  - **Description:** Updates a picture.
  - **Request Body:**
    ```json
    {
      "path": "new/path/to/image.png",
      "userId": 1
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Imagen actualizada exitosamente"
    }
    ```

### **Delete Picture**
- **DELETE** `/pictures/:id`
  - **Description:** Deletes a picture by ID.
  - **Response:**
    ```json
    {
      "message": "Imagen eliminada exitosamente"
    }
    ```
