import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM: obtener __dirname y __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const childProcesses = [];

const scriptName = path.basename(__filename);

// Detectar carpetas de microservicios (excluyendo node_modules y la carpeta del script)
const directories = fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => name !== 'node_modules' && name !== scriptName.replace('.mjs', ''));

function startMicroservices() {
  directories.forEach(dir => {
    const microservicePath = path.join(__dirname, dir);
    const appFile = 'app.js';
    const appFilePath = path.join(microservicePath, appFile);

    if (!fs.existsSync(appFilePath)) {
      console.log(`No se encontró ${appFile} en ${dir}, se omite.`);
      return;
    }

    // En Linux, basta con 'node app.js'
    const child = spawn('node', [appFile], {
      cwd: microservicePath,
      stdio: 'inherit',
      shell: true // seguro y compatible en Linux
    });

    child.on('error', error => {
      console.error(`Error al iniciar ${dir}:`, error);
    });
    child.on('exit', code => {
      console.log(`Microservicio ${dir} finalizado con código ${code}`);
    });

    childProcesses.push(child);
    console.log(`Microservicio ${dir} iniciado con node app.js`);
  });
}

process.on('SIGINT', () => {
  console.log('\nCerrando todos los microservicios...');
  childProcesses.forEach(child => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });
  setTimeout(() => {
    console.log('Servidor Express y microservicios detenidos');
    process.exit(0);
  }, 2000);
});

// No necesitas rutas, solo el orquestador
app.listen(1000, () => {
  console.log('Servidor Express ejecutándose en puerto 1000 (orquestador Linux)');
  console.log('Microservicios detectados:', directories);
  startMicroservices();
});
