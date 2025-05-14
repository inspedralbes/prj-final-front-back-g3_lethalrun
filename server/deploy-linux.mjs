#!/usr/bin/env node

import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración mejorada para Linux
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const childProcesses = new Map();
const DELAY_MS = 3000;  // Tiempo entre despliegues reducido
const LOG_DIR = '/var/log/microservices';  // Directorio estándar para logs

// Crear directorio de logs si no existe
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Detección de microservicios con validación adicional
const detectServices = () => {
    try {
        return fs.readdirSync(__dirname, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .filter(name => 
                !/^(node_modules|\.|_)/.test(name) &&  // Excluir directorios ocultos
                fs.existsSync(path.join(__dirname, name, 'app.js'))
            );
    } catch (error) {
        console.error('❌ Error detecting services:', error);
        process.exit(1);
    }
};

// Gestión de procesos con logging
const startService = async (serviceName) => {
    const servicePath = path.join(__dirname, serviceName);
    const logFile = path.join(LOG_DIR, `${serviceName}.log`);
    
    try {
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        const timestamp = new Date().toISOString();
        
        const child = spawn('node', ['app.js'], {
            cwd: servicePath,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,  // Mejor seguridad sin shell
            env: {
                ...process.env,
                NODE_ENV: 'production',
                SERVICE_NAME: serviceName
            }
        });

        child.stdout.pipe(logStream);
        child.stderr.pipe(logStream);

        childProcesses.set(serviceName, child);

        child.on('error', error => {
            console.error(`❌ ${serviceName} error:`, error);
            logStream.write(`[${timestamp}] ERROR: ${error.message}\n`);
        });

        child.on('exit', code => {
            console.log(`⏹️  ${serviceName} stopped (code ${code})`);
            logStream.write(`[${timestamp}] EXIT: Code ${code}\n`);
            logStream.end();
        });

        console.log(`✅ ${serviceName} deployed! PID: ${child.pid}`);
        logStream.write(`[${timestamp}] START: PID ${child.pid}\n`);

    } catch (error) {
        console.error(`⚠️  Critical error in ${serviceName}:`, error);
        throw error;
    }
};

// Secuencia de despliegue optimizada
const deployServices = async (services) => {
    for (const service of services) {
        try {
            await startService(service);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        } catch (error) {
            console.error('🛑 Deployment halted due to critical error');
            process.exit(1);
        }
    }
};

// Gestión de señales del sistema
const shutdown = (signal) => {
    console.log(`\n🔽  Received ${signal}, shutting down...`);
    childProcesses.forEach((child, service) => {
        if (!child.killed) {
            console.log(`⏳ Stopping ${service} (PID: ${child.pid})`);
            child.kill('SIGTERM');
        }
    });
    
    setTimeout(() => {
        console.log('🛑  All services stopped');
        process.exit(0);
    }, 5000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Inicio del sistema
app.listen(1000, async () => {
    console.log('🎛️  Orchestrator running on port 1000');
    const services = detectServices();
    
    if (services.length === 0) {
        console.log('⚠️  No services detected!');
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
