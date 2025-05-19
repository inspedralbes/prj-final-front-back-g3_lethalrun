import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const childProcesses = [];
const DELAY_MS = 5000; // 5 segundos entre microservicios (ajustable)
const scriptName = path.basename(__filename);

// Detección de microservicios
const directories = fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .filter(name => name !== 'node_modules' && name !== scriptName.replace('.mjs', ''));

// Función de despliegue escalonado
async function startMicroservices() {
  for (const dir of directories) {
    const microservicePath = path.join(__dirname, dir);
    const appFile = 'app.js';
    const appFilePath = path.join(microservicePath, appFile);

    if (!fs.existsSync(appFilePath)) {
      console.log(`⏭️  Omitting ${dir} (${appFile} not found)`);
      continue;
    }

    try {
      const child = spawn('node', [appFile], {
        cwd: microservicePath,
        stdio: 'inherit',
        shell: true
      });

      child.on('error', error => console.error(`❌ ${dir} error:`, error));
      child.on('exit', code => console.log(`⏹️  ${dir} stopped (code ${code})`));

      childProcesses.push(child);
      console.log('\n')
      console.log(`✅ ${dir} deployed! PID: ${child.pid}`);

      // Espera entre despliegues
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      console.error(`⚠️  Critical error in ${dir}:`, error);
    }
  }
}

// Gestión de cierre
process.on('SIGINT', () => {
  console.log('\n🔽  Shutting down services...');
  childProcesses.forEach(child => child.killed || child.kill());
  setTimeout(() => {
    console.log('🛑  All services stopped');
    process.exit(0);
  }, 2000);
});

// Inicio del orquestador
app.listen(1000, () => {
  console.log('🎛️  Orchestrator running on port 1000');
  console.log('📦  Detected services:', directories.join(', '));
  startMicroservices()
    .then(() => console.log('⚡ All services deployed!'))
    .catch(err => console.error('💥 Deployment failed:', err));
});
