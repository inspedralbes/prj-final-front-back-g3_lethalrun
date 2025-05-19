#!/usr/bin/env node

import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const childProcesses = new Map();
const DELAY_MS = 3000;
const LOG_DIR = '/var/log/microservices';

// Crear directorio de logs si no existe
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Detección de microservicios
const detectServices = () => {
    try {
        return fs.readdirSync(__dirname, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .filter(name => {
                if (/^(node_modules|\.|_)/.test(name)) return false;
                const servicePath = path.join(__dirname, name);
                return fs.existsSync(path.join(servicePath, 'app.js')) || 
                       fs.existsSync(path.join(servicePath, 'index.js'));
            });
    } catch (error) {
        console.error('❌ Error detecting services:', error);
        return [];
    }
};

// Iniciar servicio (manteniendo su puerto configurado)
const startService = async (serviceName) => {
    const servicePath = path.join(__dirname, serviceName);
    const logFile = path.join(LOG_DIR, `${serviceName}.log`);
    
    try {
        // Determinar archivo principal
        let mainFile = 'app.js';
        if (!fs.existsSync(path.join(servicePath, mainFile))) {
            mainFile = 'index.js';
            if (!fs.existsSync(path.join(servicePath, mainFile))) {
                throw new Error(`No se encontró app.js ni index.js en ${serviceName}`);
            }
        }

        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        const timestamp = new Date().toISOString();
        
        // El servicio usará el puerto definido en su propia configuración
        const child = spawn('node', [mainFile], {
            cwd: servicePath,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
            env: {
                ...process.env,
                NODE_ENV: 'production',
                SERVICE_NAME: serviceName
                // NO asignamos puerto aquí, el servicio usa el suyo propio
            }
        });

        child.stdout.pipe(logStream);
        child.stderr.pipe(logStream);

        childProcesses.set(serviceName, child);

        child.on('error', error => {
            console.error(`❌ ${serviceName} error:`, error);
            logStream.write(`[${timestamp}] ERROR: ${error.message}\n`);
        });

        child.on('exit', (code, signal) => {
            const message = signal ? `signal ${signal}` : `code ${code}`;
            console.log(`⏹️  ${serviceName} stopped (${message})`);
            logStream.write(`[${timestamp}] EXIT: ${message}\n`);
            childProcesses.delete(serviceName);
        });

        console.log(`✅ ${serviceName} deployed! PID: ${child.pid}`);
        logStream.write(`[${timestamp}] START: PID ${child.pid}\n`);

        return new Promise((resolve) => {
            child.on('spawn', resolve);
        });

    } catch (error) {
        console.error(`⚠️  Critical error in ${serviceName}:`, error);
        throw error;
    }
};

// Secuencia de despliegue
const deployServices = async (services) => {
    for (const [index, service] of services.entries()) {
        try {
            console.log(`🚀 Deploying ${service} (${index + 1}/${services.length})`);
            await startService(service);
            
            if (index < services.length - 1) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
        } catch (error) {
            console.error('🛑 Deployment halted due to critical error');
            process.exit(1);
        }
    }
};

// Gestión de señales
const shutdown = async (signal) => {
    console.log(`\n🔽  Received ${signal}, shutting down...`);
    
    const promises = [];
    childProcesses.forEach((child, service) => {
        if (!child.killed) {
            console.log(`⏳ Stopping ${service} (PID: ${child.pid})`);
            promises.push(new Promise(resolve => {
                child.once('exit', resolve);
                child.kill('SIGTERM');
            }));
        }
    });
    
    await Promise.race([
        Promise.all(promises),
        new Promise(resolve => setTimeout(resolve, 5000))
    ]);
    
    console.log('🛑  All services stopped');
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Inicio
app.listen(1000, async () => {
    console.log('🎛️  Orchestrator running on port 1000');
    const services = detectServices();
    
    if (services.length === 0) {
        console.log('⚠️  No services detected! Verifica que:');
        console.log('1. Cada microservicio está en su propio directorio');
        console.log('2. Cada directorio contiene app.js o index.js');
        console.log('3. No son directorios ocultos (que empiezan con .)');
        process.exit(1);
    }

    console.log('📦  Detected services:', services.join(', '));
    
    try {
        await deployServices(services);
        console.log('⚡ All services deployed successfully!');
    } catch (error) {
        console.error('💥 Deployment failed:', error);
        process.exit(1);
    }
});