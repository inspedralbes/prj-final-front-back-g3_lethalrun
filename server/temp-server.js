import express from 'express';
import passport from './passport-config.js';
import session from 'express-session';
import cors from 'cors'; // Importar CORS
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configurar CORS
app.use(
    cors({
        origin: `${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}`, // Origen permitido (tu frontend)
        credentials: true, // Permitir cookies y encabezados de autorización
    })
);

// Configuración de sesiones con express-session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'clave-secreta',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 horas
    })
);

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'No autorizado' });
}

// Ruta protegida
app.get('/api/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'Ruta protegida' });
});

// Rutas para autenticación con Google
app.get(
    '/api/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

app.get(
    '/api/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect(`${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}/dashboard?user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
);

// Ruta para cerrar sesión
app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect(`${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}`);
    });
});

// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${process.env.DOMAIN_URL}:${PORT}`);
});
