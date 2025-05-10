import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.USER_API_URL;

const createUserController = () => {
  return {

    async createUser(email, username, password) {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error creando usuario: ${err}`);
      }

      const data = await res.json();
      return data.id;
    },

    async getUser(id) {
      const res = await fetch(`${API_URL}/users/${id}`);
      if (!res.ok) throw new Error(`Error obteniendo usuario con id ${id}`);
      return await res.json();
    },

    async getUserByEmail(email) {
      const res = await fetch(`${API_URL}/users/by-email/${encodeURIComponent(email)}`);
      
      if (res.status === 404) {
        return null; // Usuario no encontrado, es válido
      }
    
      if (!res.ok) {
        throw new Error(`Error obteniendo usuario con email ${email}`);
      }
    
      return await res.json();
    }
    ,

    async changeUsername(user, newUsername) {
      const res = await fetch(`${API_URL}/users/${user.id}/username`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername })
      });

      if (!res.ok) throw new Error('Error cambiando nombre de usuario');
      return true;
    },

    async changePassword(user, newPassword) {
      const res = await fetch(`${API_URL}/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }) // sin hash, lo hace la otra API
      });

      if (!res.ok) throw new Error('Error cambiando contraseña');
      return true;
    },

    async deleteUser(id) {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando usuario');
      return true;
    }
  };
};

export default createUserController;
