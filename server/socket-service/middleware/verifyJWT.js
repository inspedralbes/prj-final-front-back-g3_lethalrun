import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const AUTH_API_URL = process.env.AUTH_API_URL;

/**
 * @middleware verifyJWTCliente
 * @group Autenticación - Middlewares de verificación JWT
 * @description
 * Middleware para verificar tokens JWT válidos para usuarios con rol "cliente" o "admin".
 * Realiza una petición al microservicio de autenticación para validar el token.
 * Si el token es válido y el usuario tiene el rol adecuado, agrega los datos del usuario
 * a `req.user` y permite el acceso a la siguiente función de la ruta.
 * 
 * @param {import('express').Request} req - Objeto de la petición Express.
 * @param {import('express').Response} res - Objeto de la respuesta Express.
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

    const data = await response.json();

    if (!response.ok) throw new Error('Error al contactar la API externa');
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
 * @middleware verifyJWTAdmin
 * @group Autenticación - Middlewares de verificación JWT
 * @description
 * Middleware para verificar tokens JWT válidos exclusivamente para usuarios con rol "admin".
 * Realiza una petición al microservicio de autenticación para validar el token.
 * Si el token es válido y el usuario tiene el rol adecuado, agrega los datos del usuario
 * a `req.user` y permite el acceso a la siguiente función de la ruta.
 * 
 * @param {import('express').Request} req - Objeto de la petición Express.
 * @param {import('express').Response} res - Objeto de la respuesta Express.
 * @param {import('express').NextFunction} next - Función next de Express.
 * @returns {void|import('express').Response} 401 si no hay token, 403 si acceso denegado, 500 si error externo.
 */
export async function verifyJWTAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const response = await fetch(`${AUTH_API_URL}/check-admin`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al contactar la API externa');

    const data = await response.json();

    if (data.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido a administradores' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error en la autenticación externa', error: err.message });
  }
}
