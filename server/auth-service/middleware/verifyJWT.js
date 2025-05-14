import jwt from 'jsonwebtoken';

/**
 * Genera un JSON Web Token (JWT) con diferentes claves secretas según el rol del usuario.
 * 
 * El token incluye información básica del usuario y expira en 1 hora. Para administradores
 * usa una clave secreta específica, permitiendo mayor control de acceso en endpoints sensibles.
 * 
 * @param {Object} user - Objeto usuario con propiedades requeridas
 * @param {string} user.id - ID único del usuario
 * @param {string} user.email - Correo electrónico del usuario
 * @param {string} user.username - Nombre de usuario
 * @param {'admin'|'cliente'} user.rol - Rol del usuario (determina la clave secreta)
 * @returns {string} Token JWT firmado
 * @throws {Error} Si no están definidas las variables de entorno JWT_SECRET_ADMIN o JWT_SECRET_CLIENTE
 */
export function generateJWT(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
    rol: user.rol, // importante que esté en el modelo
  };

  const secret = user.rol === 'admin'
    ? process.env.JWT_SECRET_ADMIN
    : process.env.JWT_SECRET_CLIENTE;

  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

/**
 * Middleware de autenticación para endpoints accesibles por clientes y administradores.
 * 
 * Verifica el token JWT en el header Authorization, intentando validar primero con la clave
 * de administrador y luego con la de cliente. Si es válido, adjunta los datos decodificados
 * al objeto `req.user`.
 * 
 * @param {import('express').Request} req - Objeto request de Express
 * @param {import('express').Response} res - Objeto response de Express
 * @param {import('express').NextFunction} next - Función next de Express
 * @returns {void|import('express').Response} 401 si no hay token | 403 si token inválido
 */
export function verifyJWTCliente(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    let decoded;
    try {
      // Estrategia de doble verificación: primero intenta con clave admin
      decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    } catch (e) {
      // Si falla, intenta con clave cliente (flujo para usuarios normales)
      decoded = jwt.verify(token, process.env.JWT_SECRET_CLIENTE);
    }

    // Verificación de roles permitidos (admin o cliente)
    if (decoded.rol === 'admin' || decoded.rol === 'cliente') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Acceso restringido' });
    }
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

/**
 * Middleware de autenticación estricto para endpoints de administrador.
 * 
 * Verifica el token JWT usando EXCLUSIVAMENTE la clave secreta de administrador.
 * Si la verificación es exitosa, adjunta los datos decodificados al objeto `req.user`.
 * 
 * @param {import('express').Request} req - Objeto request de Express
 * @param {import('express').Response} res - Objeto response de Express
 * @param {import('express').NextFunction} next - Función next de Express
 * @returns {void|import('express').Response} 401 si no hay token | 403 si token inválido o rol incorrecto
 */
export function verifyJWTAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    // Verificación estricta del rol administrador
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido a administradores' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      message: 'Token inválido o expirado o no es de admin',
      errorDetails: err.message 
    });
  }
}
