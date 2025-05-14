import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuración de almacenamiento para Multer usando diskStorage.
 * Define la carpeta de destino y el nombre de archivo para cada imagen subida.
 */
const storage = multer.diskStorage({
  /**
   * Determina la carpeta de destino para el archivo subido.
   * Crea una carpeta por usuario usando el userId extraído del nombre de archivo.
   *
   * @param {Object} req - Objeto de la petición Express.
   * @param {Object} file - Objeto de archivo Multer.
   * @param {Function} cb - Callback estándar de Multer.
   */
  destination: (req, file, cb) => {
    // Extrae el userId del nombre del archivo (formato esperado: userId_timestamp.ext)
    const fileName = file.originalname;
    const userId = fileName.split('_')[0];

    // Define la ruta de destino para las imágenes del usuario
    const uploadPath = path.join(__dirname, '..', '..', 'images', 'users', userId.toString());

    // Crea la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  /**
   * Asigna un nombre único al archivo subido basado en la fecha actual.
   *
   * @param {Object} req - Objeto de la petición Express.
   * @param {Object} file - Objeto de archivo Multer.
   * @param {Function} cb - Callback estándar de Multer.
   */
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}${extname}`;
    cb(null, filename);
  }
});

/**
 * Filtro de archivos para Multer.
 * Permite solo imágenes con formatos JPEG, PNG o GIF.
 *
 * @param {Object} req - Objeto de la petición Express.
 * @param {Object} file - Objeto de archivo Multer.
 * @param {Function} cb - Callback estándar de Multer.
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF)'), false); // Rechazar archivo
  }
};

/**
 * Middleware Multer configurado para:
 * - Almacenar archivos en disco por usuario.
 * - Limitar el tamaño máximo a 10 MB.
 * - Filtrar solo imágenes válidas.
 *
 * @type {import('multer').Multer}
 * @see <https://expressjs.com/en/resources/middleware/multer.html>[1]
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default upload;
