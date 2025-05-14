// server/images-service/middleware/multer.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    // get the file name from the request
    const fileName = file.originalname;

    // the filename is like 16_1234567890.png
    // get the userId from the filename
    const userId = fileName.split('_')[0];

    // Ruta donde se guardarán las imágenes
    const uploadPath = path.join(__dirname, '..', '..', 'images', 'users', userId.toString());

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath); // Configura la carpeta de destino
  },
  filename: (req, file, cb) => {
    // Asignar un nombre único a la imagen
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}${extname}`; // Nombre basado en la fecha actual
    cb(null, filename);
  }
});

// Filtro de archivo para asegurar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF)'), false); // Rechazar archivo
  }
};

// Inicializar multer con las configuraciones anteriores
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar tamaño de archivo a 10 MB
});

export default upload;
