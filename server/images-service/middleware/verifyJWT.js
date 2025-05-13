// src/middlewares/verifyJWT.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const AUTH_API_URL = process.env.AUTH_API_URL; 

// ✅ Middleware: permite cliente y admin
export async function verifyJWTCliente(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extraemos el token del header
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  try {
    // Ahora pasamos el token en el header Authorization
    const response = await fetch(`${AUTH_API_URL}/check-cliente`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al contactar la API externa');

    const data = await response.json();

    if (data.user.rol !== "cliente" && data.user.rol !== "admin") {
      return res.status(403).json({ message: 'Acceso denegado para cliente o admin' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error en la autenticación externa', error: err.message });
  }
}

// 🔒 Middleware: solo permite admin
export async function verifyJWTAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extraemos el token del header
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    // Ahora pasamos el token en el header Authorization
    const response = await fetch(`${AUTH_API_URL}/check-admin`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`, // Aquí se pasa el token como Bearer en el header
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al contactar la API externa');

    const data = await response.json();

    if (!data.valid || data.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido a administradores' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error en la autenticación externa', error: err.message });
  }
}
