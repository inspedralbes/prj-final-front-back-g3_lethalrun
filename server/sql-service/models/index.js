import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Cargar .env

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

const ensureDatabaseExists = async () => {
  try {
    // Primero intentamos conectarnos a la base de datos
    await rootSequelize.authenticate();
    console.log(`✅ Conectado al servidor MySQL`);

    // Verificamos si la base de datos existe
    const [results] = await rootSequelize.query(`SHOW DATABASES LIKE '${DB_NAME}'`);

    if (results.length === 0) {
      // Si la base de datos no existe, la creamos
      await rootSequelize.query(`CREATE DATABASE \`${DB_NAME}\`;`);
      console.log(`✅ Base de datos "${DB_NAME}" creada.`);
    } else {
      console.log(`ℹ️ La base de datos "${DB_NAME}" ya existe.`);
    }
  } catch (error) {
    console.error("Error al verificar o crear la base de datos:", error);
    throw error;
  }
};

const initializeDatabase = async () => {
  // Verificar si la base de datos existe o crearla
  await ensureDatabaseExists();

  // Ahora que la base de datos está confirmada (ya sea creada o existente), nos conectamos a ella
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false
  });

  const db = {};

  // Cargar los modelos dinámicamente desde el directorio
  const modelFiles = fs.readdirSync(__dirname).filter(file => file !== basename && file.endsWith('.js'));

  for (const file of modelFiles) {
    const modelPath = path.join(__dirname, file);
    // Cambiar aquí para asegurarse de usar file://
    const modelURL = new URL(`file://${modelPath}`);
    const model = (await import(modelURL)).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  // Asociaciones
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};

export default initializeDatabase;
