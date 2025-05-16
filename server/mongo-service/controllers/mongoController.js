import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Establece conexión con MongoDB Atlas. Si ya existe una conexión activa,
 * no realiza una nueva conexión.
 * @throws {Error} Si falla la conexión a la base de datos.
 */
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('🟢 Conectado a MongoDB Atlas');
    console.log('\n');
  }).catch(err => {
    console.error('🔴 Error de conexión a MongoDB:', err);
    console.log('\n');
    throw new Error('Error de conexión a la base de datos');
  });
}

/**
 * Esquema de Mongoose para representar un slot individual.
 * @typedef {Object} Slot
 * @property {boolean} isActive - Indica si el slot está actualmente activo
 * @property {number} number - Número identificador del slot
 * @property {boolean} isUnlocked - Indica si el slot está desbloqueado
 */
const slotSchema = new mongoose.Schema({
  isActive: { type: Boolean, required: true },
  number: { type: Number, required: true },
  isUnlocked: { type: Boolean, required: true },
}, { _id: false });

/**
 * Esquema principal de usuario que contiene la configuración de slots.
 * @typedef {Object} User
 * @property {string} email - Email único del usuario
 * @property {Object} slots - Contenedor de los slots del usuario
 * @property {Slot} slots.slot1 - Configuración del primer slot
 * @property {Slot} slots.slot2 - Configuración del segundo slot
 * @property {Slot} slots.slot3 - Configuración del tercer slot
 */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  slots: {
    slot1: { type: slotSchema, required: true },
    slot2: { type: slotSchema, required: true },
    slot3: { type: slotSchema, required: true }
  }
});

const UserModel = mongoose.model('Slot', userSchema, 'slots');

/**
 * Controlador para gestionar operaciones relacionadas con los slots de usuario.
 * Proporciona métodos para crear usuarios, activar/desbloquear slots y consultar estados.
 */
export class SlotController {
  constructor() {}

  /**
   * Crea un nuevo usuario con configuración inicial de slots.
   * @param {string} email - Email único del usuario
   * @returns {Promise<User>} Usuario recién creado
   * @throws {Error} Si el email ya existe o hay error de validación
   */
  async createUser(email) {
    const newUser = new UserModel({
      email,
      slots: {
        slot1: { isActive: true, number: 0, isUnlocked: true },
        slot2: { isActive: false, number: 0, isUnlocked: false },
        slot3: { isActive: false, number: 0, isUnlocked: false }
      }
    });

    return await newUser.save();
  }

  /**
   * Activa un slot específico y desactiva los demás.
   * @param {string} email - Email del usuario
   * @param {'slot1'|'slot2'|'slot3'} slotName - Nombre del slot a activar
   * @returns {Promise<User>} Usuario actualizado
   * @throws {Error} Si el slot no existe, está bloqueado o el usuario no se encuentra
   */
  async activateSlot(email, slotName) {
    if (!['slot1', 'slot2', 'slot3'].includes(slotName)) {
      throw new Error('Slot inválido');
    }

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    const slot = user.slots[slotName];
    if (!slot.isUnlocked) {
      throw new Error('No puedes activar un slot bloqueado');
    }

    for (const key in user.slots) {
      user.slots[key].isActive = false;
    }

    user.slots[slotName].isActive = true;

    return await user.save();
  }

  /**
   * Desbloquea un slot específico para un usuario.
   * @param {string} email - Email del usuario
   * @param {'slot1'|'slot2'|'slot3'} slotName - Nombre del slot a desbloquear
   * @returns {Promise<User>} Usuario actualizado
   * @throws {Error} Si el slot no existe o el usuario no se encuentra
   */
  async unlockSlot(email, slotName) {
    if (!['slot1', 'slot2', 'slot3'].includes(slotName)) {
      throw new Error('Slot inválido');
    }

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    user.slots[slotName].isUnlocked = true;

    return await user.save();
  }

  /**
   * Obtiene el número del slot activo actualmente para un usuario.
   * @param {string} email - Email del usuario
   * @returns {Promise<number|null>} Número del slot activo o null si no hay activo
   * @throws {Error} Si el usuario no se encuentra
   */
  async getActiveSlotNumber(email) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    for (const key in user.slots) {
      if (user.slots[key].isActive) {
        return user.slots[key].number;
      }
    }

    return null;
  }

  /**
   * Actualiza el número asociado a un slot específico.
   * @param {string} email - Email del usuario
   * @param {'slot1'|'slot2'|'slot3'} slotName - Nombre del slot a modificar
   * @param {number} newNumber - Nuevo número a asignar
   * @returns {Promise<User>} Usuario actualizado
   * @throws {Error} Si el slot no existe, el número es inválido o el usuario no se encuentra
   */
  async setSlotNumber(email, slotName, newNumber) {
    if (!['slot1', 'slot2', 'slot3'].includes(slotName)) {
      throw new Error('Slot inválido');
    }

    if (typeof newNumber !== 'number') {
      throw new Error('El nuevo número debe ser un número');
    }

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    user.slots[slotName].number = newNumber;

    return await user.save();
  }

  /**
   * Obtiene todos los datos de un usuario.
   * @param {string} email - Email del usuario a buscar
   * @returns {Promise<User|null>} Objeto usuario o null si no existe
   */
  async getUser(email) {
    return await UserModel.findOne({ email });
  }
}
