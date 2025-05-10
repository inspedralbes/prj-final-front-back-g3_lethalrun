import jwt from 'jsonwebtoken';

// 🔐 Generar JWT con clave distinta según rol
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

// ✅ Middleware: permite cliente y admin
export function verifyJWTCliente(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    let decoded;
    try {
      // Intenta verificar primero con la clave admin
      decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    } catch (e) {
      // Si no es admin, intenta con la clave de cliente
      decoded = jwt.verify(token, process.env.JWT_SECRET_CLIENTE);
    }

    // Si el rol es admin o cliente, permite el acceso
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

// 🔒 Middleware: solo permite admin
export function verifyJWTAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    // Verifica que el rol sea admin
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso restringido a administradores' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado o no es de admin' });
  }
}
