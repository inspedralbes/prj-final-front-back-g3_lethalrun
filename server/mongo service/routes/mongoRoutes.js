import express from 'express';
import cors from 'cors';
import { SlotController } from '../controllers/mongoController.js';
import { verifyJWTCliente } from '../middleware/verifyJWT.js'; // Importamos los middlewares

const router = express.Router();
const controller = new SlotController();

// Habilitamos CORS para todas las rutas
router.use(cors());

// Crear usuario (publico, sin necesidad de autenticación)
router.post('/create', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await controller.createUser(email);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Activar un slot (requiere autenticación de cliente o admin)
router.post('/activate', verifyJWTCliente, async (req, res) => { // Usamos el middleware de cliente
  const { email, slotName } = req.body;
  try {
    const user = await controller.activateSlot(email, slotName);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Desbloquear un slot (requiere autenticación de admin)
router.post('/unlock', verifyJWTCliente, async (req, res) => { // Usamos el middleware de admin
  const { email, slotName } = req.body;
  try {
    const user = await controller.unlockSlot(email, slotName);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener número del slot activo (requiere autenticación de cliente o admin)
router.get('/active-slot-number', verifyJWTCliente, async (req, res) => { // Usamos el middleware de cliente
  const { email } = req.body;
  try {
    const number = await controller.getActiveSlotNumber(email);
    res.json({ activeSlotNumber: number });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cambiar el número de un slot (requiere autenticación de admin)
router.post('/set-slot-number', verifyJWTCliente, async (req, res) => { // Usamos el middleware de admin
  const { email, slotName, newNumber } = req.body;
  try {
    const user = await controller.setSlotNumber(email, slotName, newNumber);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener datos completos del usuario (requiere autenticación de cliente o admin)
router.get('/user', verifyJWTCliente, async (req, res) => { // Usamos el middleware de cliente
  const { email } = req.body;
  try {
    console.log(email);
    const user = await controller.getUser(email);
    console.log(user);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
