// ============================================================================
// PUNTO DE ENTRADA - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/index.ts
// Propósito: Inicializar y ejecutar el servidor

import Server from './server';

/**
 * Crear e inicializar el servidor
 */
const server = new Server();

/**
 * Iniciar el servidor
 */
server.listen();

/**
 * Manejo de señales del sistema para cerrado graceful
 */
process.on('SIGTERM', async () => {
    console.log('📡 SIGTERM recibida, cerrando servidor gracefully...');
    await server.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('📡 SIGINT recibida, cerrando servidor gracefully...');
    await server.close();
    process.exit(0);
});