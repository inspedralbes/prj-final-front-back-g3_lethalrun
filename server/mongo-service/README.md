# 🧩 Microservicio de Gestión de Slots de Usuario

## 📖 Descripción general

Este microservicio administra la configuración de **slots** para usuarios, permitiendo la creación de usuarios con slots predeterminados, la activación y desbloqueo de slots específicos, así como la consulta y modificación de sus estados.

Los datos se almacenan en **MongoDB Atlas** y el microservicio cuenta con autenticación basada en **tokens JWT** para garantizar la seguridad en las operaciones de usuario.

---

## 🔄 Flujo de funcionamiento

1. **Creación de usuario con slots iniciales**:  
   - Se crea un usuario con tres slots configurados, donde el primer slot está activo y desbloqueado por defecto.

2. **Activar un slot específico**:  
   - Permite activar un slot entre los tres disponibles, desactivando los demás.  
   - Sólo se puede activar un slot si está desbloqueado.

3. **Desbloquear un slot**:  
   - Permite cambiar el estado de un slot para hacerlo accesible y activable por el usuario.

4. **Modificar número asociado a un slot**:  
   - Se puede cambiar el número identificador del slot activo o desbloqueado.

5. **Consulta de estado de slots**:  
   - Obtener el estado actual (activo, desbloqueado, número) de los slots de un usuario.

---

## 🌐 Integración con otros servicios

- Utiliza **MongoDB Atlas** para almacenamiento y consulta de datos.  
- Se autentica mediante **JWT**, integrándose con sistemas de autenticación externos.  
- Puede ser consumido por otros microservicios o aplicaciones frontend que requieran información o gestión de slots.

---

## 🚪 Rutas disponibles

| Ruta                            | Método | Descripción                                         | Seguridad     |
|--------------------------------|--------|----------------------------------------------------|---------------|
| `/slots/create-user`            | POST   | Crear usuario con tres slots iniciales             | JWT requerido |
| `/slots/get-user-slots/:userId`| GET    | Obtener información de los slots de un usuario     | JWT requerido |
| `/slots/activate-slot`          | PUT    | Activar un slot específico (si está desbloqueado) | JWT requerido |
| `/slots/unlock-slot`            | PUT    | Desbloquear un slot                                 | JWT requerido |
| `/slots/update-slot-number`    | PUT    | Modificar número de un slot                          | JWT requerido |

---

## 🔐 Seguridad y configuración

- Protección de rutas mediante middleware JWT.  
- Variables de entorno para conexión a MongoDB Atlas, puerto y secretos JWT.  
- Validaciones internas para asegurar que sólo slots desbloqueados puedan activarse.

---

## 📁 Estructura de datos (MongoDB)

Ejemplo de documento de usuario con slots:

```json
{
  "_id": "userId123",
  "slots": {
    "slot1": {
      "activo": true,
      "desbloqueado": true,
      "numero": 1
    },
    "slot2": {
      "activo": false,
      "desbloqueado": false,
      "numero": 0
    },
    "slot3": {
      "activo": false,
      "desbloqueado": false,
      "numero": 0
    }
  }
}
