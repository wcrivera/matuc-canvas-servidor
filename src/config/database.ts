// ============================================================================
// CONFIGURACIÓN DATABASE - SEGURIDAD BALANCEADA
// ============================================================================
// Archivo: src/config/database.ts
// Propósito: Conexión MongoDB segura pero práctica

import mongoose from 'mongoose';

/**
 * Validación básica de connection string
 */
const validateConnectionString = (connectionString: string): string => {
    if (!connectionString || typeof connectionString !== 'string') {
        throw new Error('Invalid connection string');
    }

    const sanitized = connectionString.trim();

    if (!sanitized.startsWith('mongodb://') && !sanitized.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB connection string format');
    }

    // Verificar longitud razonable
    if (sanitized.length > 500) {
        throw new Error('Connection string too long');
    }

    return sanitized;
};

/**
 * Generar opciones de conexión seguras
 */
const getConnectionOptions = (): mongoose.ConnectOptions => {
    const baseOptions: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 300000,       // 5 minutos
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 10000,
        bufferCommands: false,
        retryWrites: true,
        authSource: 'admin'
    };

    // Configuraciones adicionales para producción
    if (process.env.NODE_ENV === 'production') {
        return {
            ...baseOptions,
            ssl: true,
            // Configuraciones de seguridad adicionales sin opciones problemáticas
        };
    }

    return baseOptions;
};

/**
 * Configurar eventos de conexión
 */
const setupConnectionEvents = (): void => {
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    db.on('disconnected', () => {
        console.warn('MongoDB disconnected');
    });

    db.on('reconnected', () => {
        console.log('MongoDB reconnected');
    });

    // Shutdown limpio
    const shutdown = async (signal: string) => {
        console.log(`Received ${signal}, closing database connection...`);
        try {
            await mongoose.connection.close();
            console.log('Database connection closed');
            process.exit(0);
        } catch (error) {
            console.error('Error closing database:', error);
            process.exit(1);
        }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

/**
 * Conexión principal a MongoDB
 */
export const dbConnection = async (): Promise<void> => {
    try {
        // Validar variables de entorno
        const dbUrl = process.env.DB_CNN;
        if (!dbUrl) {
            throw new Error('DB_CNN environment variable not set');
        }

        // Validar y sanitizar connection string
        const connectionString = validateConnectionString(dbUrl);
        const options = getConnectionOptions();

        console.log('Connecting to MongoDB...');
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

        // Conectar a MongoDB
        const connection = await mongoose.connect(connectionString, options);

        console.log('MongoDB connected successfully');
        console.log(`Database: ${connection.connection.name}`);
        console.log(`Host: ${connection.connection.host}:${connection.connection.port}`);

        // Configurar eventos
        setupConnectionEvents();

    } catch (error) {
        console.error('Failed to connect to MongoDB:');
        console.error(error);

        if (process.env.NODE_ENV === 'development') {
            console.error('Verify that:');
            console.error('- MongoDB is running');
            console.error('- DB_CNN is correct in .env file');
            console.error('- Network connectivity is available');
        }

        process.exit(1);
    }
};

/**
 * Obtener estado de la conexión
 */
export const getDatabaseStatus = (): {
    connected: boolean;
    status: string;
    host?: string;
    name?: string;
} => {
    const readyState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    const result: {
        connected: boolean;
        status: string;
        host?: string;
        name?: string;
    } = {
        connected: readyState === 1,
        status: states[readyState as keyof typeof states] || 'unknown'
    };

    // Agregar información adicional si está conectado
    if (readyState === 1) {
        if (mongoose.connection.host) {
            result.host = mongoose.connection.host;
        }
        if (mongoose.connection.name) {
            result.name = mongoose.connection.name;
        }
    }

    return result;
};

/**
 * Cerrar conexión manualmente
 */
export const closeDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('Database connection closed manually');
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
};

/**
 * Health check de la base de datos
 */
export const healthCheck = async (): Promise<{
    healthy: boolean;
    latency: number;
    timestamp: string;
}> => {
    const startTime = Date.now();

    try {
        // Ping simple a la base de datos
        await mongoose.connection.db?.admin().ping();
        const latency = Date.now() - startTime;

        return {
            healthy: true,
            latency,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            healthy: false,
            latency: Date.now() - startTime,
            timestamp: new Date().toISOString()
        };
    }
};