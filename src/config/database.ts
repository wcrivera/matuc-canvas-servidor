// ============================================================================
// CONFIGURACIÓN DE BASE DE DATOS - MONGODB
// Compatible con estructura existente del proyecto
// ============================================================================

import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

/**
 * Configuración de opciones para MongoDB
 */
export const databaseOptions: mongoose.ConnectOptions = {
    // Configuraciones modernas de Mongoose 7+
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true
};

/**
 * Obtener URL de base de datos desde variables de entorno
 * Compatible con la variable DB_CNN del proyecto existente
 */
export const getDatabaseURL = (): string => {
    // Usar la misma variable que el proyecto existente
    const url = process.env.DB_CNN || process.env.DB_CNN_STRING;

    if (!url) {
        throw new Error('❌ Variable de entorno DB_CNN o DB_CNN_STRING no configurada');
    }

    return url;
};

/**
 * Conectar a la base de datos
 * Compatible con la función dbConnection existente
 */
export const dbConnection = async (): Promise<void> => {
    try {
        const url = getDatabaseURL();

        console.log('🔄 Conectando a MongoDB...');

        const db = await mongoose.connect(url, databaseOptions);

        console.log('✅ Base de datos conectada exitosamente');
        console.log(`📊 Base de datos conectada a: ${db.connection.name}`);

        // Event listeners para monitoreo
        mongoose.connection.on('error', (error: Error) => {
            console.error('❌ Error de conexión MongoDB:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB desconectado');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconectado');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('💤 Conexión MongoDB cerrada correctamente');
                process.exit(0);
            } catch (error) {
                console.error('❌ Error cerrando conexión MongoDB:', error);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error);
        throw new Error('Error en la base de datos - vea logs');
    }
};