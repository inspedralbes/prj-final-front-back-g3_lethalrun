import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const AUTH_API_URL = process.env.AUTH_API_URL;

/**
 * Middleware para verificar JWT de clientes y administradores.
 *
 * Este middleware extrae el token JWT del header Authorization y lo valida
 * consultando el endpoint externo `/check-cliente` del microservicio de autenticación.
 * Si el token es válido y el usuario tiene rol "cliente" o "admin", permite el acceso
 * y adjunta los datos decodificados en `req.user`.
 *
 * @param {import('express').Request} req - Objeto request de Express.
 * @param {import('express').Response} res - Objeto response de Express.
 * @param {import('express').NextFunction} next - Función next de Express.
 * @returns {void|import('express').Response} 401 si no hay token, 403 si acceso denegado, 500 si error externo.
 */
export async function verifyJWTCliente(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  try {
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

/**
 * Middleware para verificar JWT exclusivamente de administradores.
 *
 * Este middleware extrae el token JWT del header Authorization y lo valida
 * consultando el endpoint externo `/check-admin` del microservicio de autenticación.
 * Solo permite el acceso si el token es válido y el usuario tiene rol "admin".
 * Adjunta los datos decodificados en `req.user`.
 *
 * @param {import('express').Request} req - Objeto request de Express.
 * @param {import('express').Response} res - Objeto response de Express.
 * @param {import('express').NextFunction} next - Función next de Express.
 * @returns {void|import('express').Response} 401 si no hay token, 403 si acceso denegado, 500 si error externo.
 */
export async function verifyJWTAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const response = await fetch(`${AUTH_API_URL}/check-admin`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
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
