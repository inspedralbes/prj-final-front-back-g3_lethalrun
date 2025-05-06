import jwt from 'jsonwebtoken';

// Función para generar un JWT
export function generateJWT(user) {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token válido por 1 hora
}

// Middleware para verificar si el usuario está autenticado
export default function verifyJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Espera "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregamos el payload del token al request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}
