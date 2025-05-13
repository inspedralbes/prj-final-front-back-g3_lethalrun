import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

// Configuración desde .env
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DIALECT
} = process.env;

// Crear conexión sin base de datos para verificar/crear la DB
const rootSequelize = new Sequelize('', DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false
});

// Verifica y crea la base de datos si no existe
const ensureDatabaseExists = async () => {
  try {
    await rootSequelize.authenticate();
    console.log(`✅ Conectado al servidor MySQL`);

    const [results] = await rootSequelize.query(`SHOW DATABASES LIKE '${DB_NAME}'`);

    if (results.length === 0) {
      await rootSequelize.query(`CREATE DATABASE \`${DB_NAME}\`;`);
      console.log(`✅ Base de datos "${DB_NAME}" creada.`);
    } else {
      console.log(`ℹ️ La base de datos "${DB_NAME}" ya existe.`);
    }
  } catch (error) {
    console.error("❌ Error al verificar o crear la base de datos:", error);
    throw error;
  }
};

// Inicializa la base de datos, modelos y tablas
const initializeDatabase = async () => {
  await ensureDatabaseExists();

  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false
  });

  const db = {};

  const modelFiles = fs
    .readdirSync(__dirname)
    .filter(file => file !== basename && file.endsWith('.js'));

  for (const file of modelFiles) {
    const modelPath = path.join(__dirname, file);
    const modelURL = new URL(`file://${modelPath}`);
    const model = (await import(modelURL)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  await sequelize.sync({ alter: true });
  console.log("✅ Tablas sincronizadas correctamente.");

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // Insertar datos de prueba si la tabla User está vacía
  const userCount = await db.User.count();
  if (userCount === 0) {
    const testUser = await db.User.create({
      email: 'admin@example.com',
      username: 'admin',
      password: 'hashedpassword123',
      rol: 'admin'
    });

    await db.Picture.create({
      is_active: true,
      path: 'admin-picture.png',
      user_id: testUser.id
    });

    console.log("✅ Usuario y foto de prueba insertados.");
  }

  return db;
};

export default initializeDatabase;
