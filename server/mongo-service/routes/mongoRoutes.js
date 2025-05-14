import express from 'express';
import { SlotController } from '../controllers/mongoController.js';
import { verifyJWTCliente } from '../middleware/verifyJWT.js';

const router = express.Router();
const controller = new SlotController();

/**
 * @route POST /create
 * @group Slots - Gestión de slots de usuario
 * @description
 * Crea un nuevo usuario con slots predeterminados. No requiere autenticación.
 * 
 * @param {string} email.body.required - Email del usuario
 * @returns {Object} 201 - Usuario creado exitosamente
 * @returns {Object} 400 - Error en la solicitud
 */
router.post('/create', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await controller.createUser(email);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route POST /activate
 * @group Slots - Gestión de slots de usuario
 * @security JWT
 * @description
 * Activa un slot específico para el usuario y desactiva los demás.
 * 
 * @param {string} email.body.required - Email del usuario
 * @param {'slot1'|'slot2'|'slot3'} slotName.body.required - Nombre del slot a activar
 * @returns {Object} 200 - Usuario actualizado
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 403 - Acceso no autorizado
 */
router.post('/activate', verifyJWTCliente, async (req, res) => {
  const { email, slotName } = req.body;
  try {
    const user = await controller.activateSlot(email, slotName);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route POST /unlock
 * @group Slots - Gestión de slots de usuario
 * @security JWT
 * @description
 * Desbloquea un slot específico para el usuario.
 * 
 * @param {string} email.body.required - Email del usuario
 * @param {'slot1'|'slot2'|'slot3'} slotName.body.required - Nombre del slot a desbloquear
 * @returns {Object} 200 - Usuario actualizado
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 403 - Acceso no autorizado
 */
router.post('/unlock', verifyJWTCliente, async (req, res) => {
  const { email, slotName } = req.body;
  try {
    const user = await controller.unlockSlot(email, slotName);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route GET /active-slot-number
 * @group Slots - Gestión de slots de usuario
 * @security JWT
 * @description
 * Obtiene el número del slot actualmente activo para el usuario.
 * 
 * @param {string} email.body.required - Email del usuario
 * @returns {Object} 200 - Número del slot activo
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 403 - Acceso no autorizado
 */
router.get('/active-slot-number', verifyJWTCliente, async (req, res) => {
  const { email } = req.body;
  try {
    const number = await controller.getActiveSlotNumber(email);
    res.json({ activeSlotNumber: number });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route POST /set-slot-number
 * @group Slots - Gestión de slots de usuario
 * @security JWT
 * @description
 * Modifica el número asociado a un slot específico.
 * 
 * @param {string} email.body.required - Email del usuario
 * @param {'slot1'|'slot2'|'slot3'} slotName.body.required - Nombre del slot a modificar
 * @param {number} newNumber.body.required - Nuevo número a asignar
 * @returns {Object} 200 - Usuario actualizado
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 403 - Acceso no autorizado
 */
router.post('/set-slot-number', verifyJWTCliente, async (req, res) => {
  const { email, slotName, newNumber } = req.body;
  try {
    const user = await controller.setSlotNumber(email, slotName, newNumber);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route GET /user
 * @group Slots - Gestión de slots de usuario
 * @security JWT
 * @description
 * Obtiene todos los datos de slots de un usuario.
 * 
 * @param {string} email.body.required - Email del usuario
 * @returns {Object} 200 - Datos completos del usuario
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 403 - Acceso no autorizado
 * @returns {Object} 404 - Usuario no encontrado
 */
router.get('/user', verifyJWTCliente, async (req, res) => {
  const { email } = req.body;
  try {
    const user = await controller.getUser(email);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
