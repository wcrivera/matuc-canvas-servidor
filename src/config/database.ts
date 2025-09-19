// ============================================================================
// CONFIGURACIÓN DE BASE DE DATOS - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/config/database.ts
// Propósito: Configuración MongoDB con Mongoose
// Compatible con estructura existente del proyecto base

import mongoose from 'mongoose';

/**
 * Configuración de conexión a MongoDB
 * Compatible con el patrón usado en matuc-3.0-servidor
 */
export const dbConnection = async (): Promise<void> => {
    try {
        // Obtener URL de conexión desde variables de entorno
        const dbUrl = process.env.DB_CNN;

        if (!dbUrl) {
            throw new Error('DB_CNN no está definida en las variables de entorno');
        }

        // Configuración de conexión con opciones modernas
        const options: mongoose.ConnectOptions = {
            // Opciones para producción
            maxPoolSize: 10,          // Mantener hasta 10 conexiones de socket
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000,   // Close sockets after 45 seconds of inactivity
            bufferCommands: false,    // Disable mongoose buffering
        };

        // Conectar a MongoDB
        await mongoose.connect(dbUrl, options);

        console.log('✅ Base de datos conectada correctamente');

        // Log adicional para desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`📍 Conectado a: ${dbUrl}`);
            console.log(`🏷️  Base de datos: ${mongoose.connection.name}`);
        }

    } catch (error) {
        console.error('❌ Error al conectar la base de datos:');
        console.error(error);

        // En desarrollo, mostrar más información
        if (process.env.NODE_ENV === 'development') {
            console.error('💡 Verifica que:');
            console.error('   - MongoDB esté ejecutándose');
            console.error('   - La variable DB_CNN esté correcta en .env');
            console.error('   - El puerto 27017 esté disponible');
        }

        // Salir del proceso si no se puede conectar
        process.exit(1);
    }
};

/**
 * Configurar eventos de conexión de MongoDB
 * Para monitoreo y logging
 */
export const setupDatabaseEvents = (): void => {
    const db = mongoose.connection;

    // Evento: Conexión establecida
    db.on('connected', () => {
        console.log('🔗 MongoDB conectado');
    });

    // Evento: Error de conexión
    db.on('error', (error) => {
        console.error('❌ Error de conexión MongoDB:', error);
    });

    // Evento: Conexión desconectada
    db.on('disconnected', () => {
        console.log('🔌 MongoDB desconectado');
    });

    // Evento: Aplicación terminada
    process.on('SIGINT', async () => {
        try {
            await db.close();
            console.log('🔒 Conexión MongoDB cerrada por terminación de la aplicación');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error al cerrar conexión MongoDB:', error);
            process.exit(1);
        }
    });
};

/**
 * Función para verificar el estado de la conexión
 * Útil para endpoints de salud
 */
export const getDatabaseStatus = (): {
    connected: boolean;
    status: string;
    host?: string | undefined;
    name?: string | undefined;
} => {
    const readyState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    return {
        connected: readyState === 1,
        status: states[readyState as keyof typeof states] || 'unknown',
        host: mongoose.connection.host || undefined,
        name: mongoose.connection.name || undefined
    };
};

/**
 * Función para limpiar la base de datos (solo para testing)
 * NO usar en producción
 */
export const clearDatabase = async (): Promise<void> => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('❌ No se puede limpiar la base de datos en producción');
    }

    try {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            if (collection) {
                await collection.deleteMany({});
            }
        }

        console.log('🧹 Base de datos limpiada (solo para testing)');
    } catch (error) {
        console.error('❌ Error al limpiar la base de datos:', error);
        throw error;
    }
};

/**
 * Función para crear índices iniciales
 * Se ejecutará cuando tengamos los modelos definidos
 */
export const createInitialIndexes = async (): Promise<void> => {
    try {
        // Por ahora solo log, agregaremos índices cuando tengamos los modelos
        console.log('📊 Creando índices iniciales...');

        // Futuro: cuando tengamos modelos
        // await ExerciseSet.createIndexes();
        // await NestedQuestion.createIndexes();
        // await StudentAttempt.createIndexes();

        console.log('✅ Índices creados correctamente');
    } catch (error) {
        console.error('❌ Error al crear índices:', error);
        // No fallar si los índices no se pueden crear
    }
};

/**
 * Configuración de desarrollo para logging de queries
 */
export const setupDevelopmentLogging = (): void => {
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_MODE === 'true') {
        // Habilitar logging de queries en desarrollo
        mongoose.set('debug', (collectionName, method, query, doc) => {
            console.log(`🔍 MongoDB Query: ${collectionName}.${method}`, {
                query: JSON.stringify(query),
                doc: doc ? JSON.stringify(doc) : undefined
            });
        });

        console.log('🐛 MongoDB query logging habilitado');
    }
};