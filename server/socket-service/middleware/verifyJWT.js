// src/middlewares/verifyJWT.js

import fetch from 'node-fetch';

const AUTH_API_URL = process.env.AUTH_API_URL;  // URL de la API externa de autenticación

// ✅ Middleware: permite cliente y admin
export async function verifyJWTCliente(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];  // Extraemos el token del encabezado
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const response = await fetch(`${AUTH_API_URL}/check-cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error('Error al contactar la API externa');

    const data = await response.json();

    if (!data.valid || !['cliente', 'admin'].includes(data.role)) {
      return res.status(403).json({ message: 'Acceso denegado para cliente o admin' });
    }

    req.user = data.user;  // Añadimos el usuario a la solicitud
    next();  // Continuamos al siguiente middleware o controlador
  } catch (err) {
    return res.status(500).json({ message: 'Error en la autenticación externa', error: err.message });
  }
}

// 🔒 Middleware: solo permite admin
export async function verifyJWTAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const response = await fetch(`${AUTH_API_URL}/check-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error('Error al contactar la API externa');

    const data = await response.json();

    if (!data.valid || data.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido a administradores' });
    }

    req.user = data.user;  // Añadimos el usuario a la solicitud
    next();  // Continuamos al siguiente middleware o controlador
  } catch (err) {
    return res.status(500).json({ message: 'Error en la autenticación externa', error: err.message });
  }
}
