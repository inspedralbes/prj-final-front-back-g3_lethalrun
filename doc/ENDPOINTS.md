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

### **Update User XP**
- **PUT** `/users/:id/incrementXp`
  - **Description:** Increments a user's XP.
  - **Request Body:**
    ```json
    {
      "amount": 500
    }
    ```
  - **Response:**
    ```json
    {
      "message": "XP de usuario incrementado exitosamente"
    }
    ```

### **Update User Play Time**
- **PUT** `/users/:id/incrementPlayTime`
  - **Description:** Increments a user's play time.
  - **Request Body:**
    ```json
    {
      "seconds": 120
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Tiempo de juego de usuario incrementado exitosamente"
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

### **Set Active Picture**
- **PUT** `/pictures/:id/setActive`
  - **Description:** Sets a picture as active for a user.
  - **Request Body:**
    ```json
    {
      "userId": 1
    }
    ```
  - **Response:**
    ```json
    {
      "message": "Imagen establecida como activa exitosamente"
    }
    ```

### **Get Active Picture by User**
- **GET** `/users/:userId/activePicture`
  - **Description:** Retrieves the active picture of a user.
  - **Response:**
    ```json
    {
      "id": 1,
      "path": "path/to/active/image.png",
      "user_id": 1
    }
    ```

---

## Testing

### **Database Connection Test**
- **POST** `/api/db-test`
  - **Description:** Verifies that the database connection works by creating a test user and assigning a default picture.
  - **Response:**
    ```json
    {
      "message": "Prueba exitosa: Usuario creado correctamente",
      "userId": 1
    }
    ```

