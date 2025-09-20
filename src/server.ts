// ============================================================================
// SERVIDOR PRINCIPAL - MATUC LTI EXERCISE COMPOSER
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar configuración de rutas
import { configurarRutas } from './routes';

// Importar configuración de base de datos existente
import { dbConnection } from './config/database';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARES DE SEGURIDAD
// ============================================================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configurado para Canvas
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ============================================================================
// MIDDLEWARES DE APLICACIÓN
// ============================================================================

// Morgan para logging de requests
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON con límite de tamaño
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================================
// CONFIGURAR RUTAS
// ============================================================================

configurarRutas(app);

// ============================================================================
// MANEJO DE ERRORES GLOBAL
// ============================================================================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    ok: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    error: 'Not Found'
  });
});

// Middleware para manejo de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no manejado:', error);

  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const iniciarServidor = async () => {
  try {
    // Conectar a base de datos usando configuración existente
    await dbConnection();
    console.log('✅ Base de datos conectada');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor MATUC LTI Exercise Composer iniciado');
      console.log(`📍 Puerto: ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS habilitado para: ${corsOptions.origin}`);

      // Log de rutas disponibles
      console.log('\n📋 Rutas disponibles:');
      console.log('   GET  /api/health - Verificar estado del servidor');
      console.log('   GET  /api/info - Información del servidor');
      console.log('   GET  /api/test - Test de rutas');
      console.log('   GET  /api/exercise-sets - Listar exercise sets');
      console.log('   POST /api/exercise-sets - Crear exercise set');
      console.log('   GET  /api/exercise-sets/:id - Obtener exercise set');
      console.log('   PUT  /api/exercise-sets/:id - Actualizar exercise set');
      console.log('   DELETE /api/exercise-sets/:id - Eliminar exercise set');
      console.log('\n✅ Servidor listo para recibir requests');
    });

  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
iniciarServidor();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});