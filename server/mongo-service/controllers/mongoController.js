import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables desde .env

const MONGODB_URI = process.env.MONGODB_URI;

// Conexión a MongoDB Atlas (solo una vez)
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('🟢 Conectado a MongoDB Atlas');
  }).catch(err => {
    console.error('🔴 Error de conexión a MongoDB:', err);
  });
}

// Esquema individual del slot
const slotSchema = new mongoose.Schema({
  isActive: { type: Boolean, required: true },
  number: { type: Number, required: true },
  isUnlocked: { type: Boolean, required: true },
}, { _id: false });

// Esquema del usuario
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  slots: {
    slot1: { type: slotSchema, required: true },
    slot2: { type: slotSchema, required: true },
    slot3: { type: slotSchema, required: true }
  }
});

const UserModel = mongoose.model('Slot', userSchema, 'slots');

export class SlotController {
  constructor() {}

  async createUser(email) {
    const newUser = new UserModel({
      email,
      slots: {
        slot1: { isActive: true, number: 1, isUnlocked: true },
        slot2: { isActive: false, number: 2, isUnlocked: false },
        slot3: { isActive: false, number: 3, isUnlocked: false }
      }
    });

    return await newUser.save();
  }

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

  async unlockSlot(email, slotName) {
    if (!['slot1', 'slot2', 'slot3'].includes(slotName)) {
      throw new Error('Slot inválido');
    }

    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    user.slots[slotName].isUnlocked = true;

    return await user.save();
  }

  async getActiveSlotNumber(email) {
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) throw new Error('Usuario no encontrado');

    for (const key in user.slots) {
      if (user.slots[key].isActive) {
        return user.slots[key].number;
      }
    }

    return null;
  }

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

  async getUser(email) {
    return await UserModel.findOne({ email });
  }
}
