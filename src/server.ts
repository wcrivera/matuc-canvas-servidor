// ============================================================================
// SERVIDOR PRINCIPAL - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/server.ts
// Propósito: Configuración servidor Express con rutas integradas

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { dbConnection, getDatabaseStatus, healthCheck } from './config/database';
import { userRoutes } from './routes';
import { ApiResponse } from './types/shared';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARES DE SEGURIDAD
// ============================================================================

// Helmet para headers de seguridad básicos
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false // Permitir embeds para LTI
}));

// Rate limiting básico
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana por IP
  message: {
    ok: false,
    message: 'Too many requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// CORS configurado para Canvas y desarrollo
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];

    // Permitir requests sin origin (Postman, apps móviles, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// ============================================================================
// MIDDLEWARES DE APLICACIÓN
// ============================================================================

// Morgan para logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parse JSON con límite de tamaño
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    // Verificación básica de JSON válido para seguridad
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));

// Parse URL-encoded data
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// ============================================================================
// RUTAS DE SALUD Y ESTADO
// ============================================================================

// Health check básico
app.get('/health', async (req, res) => {
  try {
    const dbStatus = getDatabaseStatus();
    const dbHealth = await healthCheck();

    const response: ApiResponse = {
      ok: true,
      message: 'MATUC LTI Exercise Composer - Server running',
      data: {
        server: {
          status: 'running',
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage()
        },
        database: {
          ...dbStatus,
          health: dbHealth
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      ok: false,
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(errorResponse);
  }
});

// Info del servidor
app.get('/info', (req, res) => {
  const response: ApiResponse = {
    ok: true,
    message: 'Server information',
    data: {
      name: 'MATUC LTI Exercise Composer Backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: process.env.DB_CNN ? 'Configured' : 'Not configured',
      features: {
        lti: 'Planned',
        canvas: 'Planned',
        exercises: 'In development'
      },
      endpoints: {
        health: '/health',
        info: '/info',
        database: '/db-status',
        users: '/api/users'
      }
    }
  };
  res.status(200).json(response);
});

// Estado específico de la base de datos
app.get('/db-status', async (req, res) => {
  try {
    const dbStatus = getDatabaseStatus();
    const dbHealth = await healthCheck();

    const response: ApiResponse = {
      ok: dbStatus.connected,
      message: dbStatus.connected ? 'Database connected' : 'Database disconnected',
      data: {
        ...dbStatus,
        health: dbHealth,
        details: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        }
      }
    };

    res.status(dbStatus.connected ? 200 : 503).json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      ok: false,
      message: 'Database status check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(errorResponse);
  }
});

// ============================================================================
// RUTAS DE DESARROLLO Y TESTING
// ============================================================================

// Ruta de prueba para Postman
app.get('/test', (req, res) => {
  const response: ApiResponse = {
    ok: true,
    message: 'Test endpoint working',
    data: {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query
    }
  };
  res.status(200).json(response);
});

// Echo endpoint para testing
app.post('/echo', (req, res) => {
  const response: ApiResponse = {
    ok: true,
    message: 'Echo endpoint',
    data: {
      body: req.body,
      headers: req.headers,
      timestamp: new Date().toISOString()
    }
  };
  res.status(200).json(response);
});

// ============================================================================
// RUTAS DE LA APLICACIÓN
// ============================================================================

// Rutas de usuarios
app.use('/api/users', userRoutes);

// TODO: Agregar más rutas cuando estén listas
// app.use('/api/exercise-sets', exerciseSetRoutes);
// app.use('/api/questions', questionRoutes);
// app.use('/api/attempts', attemptRoutes);

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  const response: ApiResponse = {
    ok: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'NOT_FOUND'
  };
  res.status(404).json(response);
});

// Middleware global de manejo de errores
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);

  const response: ApiResponse = {
    ok: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_ERROR'
  };

  res.status(500).json(response);
});

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

const startServer = async () => {
  try {
    // Conectar a la base de datos primero
    console.log('Starting MATUC LTI Exercise Composer...');
    await dbConnection();

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🚀 MATUC LTI Exercise Composer Server Started');
      console.log('='.repeat(60));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS: ${process.env.CORS_ORIGIN || 'default'}`);
      console.log(`🗄️  Database: Connected`);
      console.log('');
      console.log('📋 Available endpoints:');
      console.log(`   GET  http://localhost:${PORT}/health - Health check`);
      console.log(`   GET  http://localhost:${PORT}/info - Server info`);
      console.log(`   GET  http://localhost:${PORT}/db-status - Database status`);
      console.log(`   GET  http://localhost:${PORT}/test - Test endpoint`);
      console.log(`   POST http://localhost:${PORT}/echo - Echo endpoint`);
      console.log('');
      console.log('📋 User API endpoints:');
      console.log(`   POST http://localhost:${PORT}/api/users - Create user`);
      console.log(`   GET  http://localhost:${PORT}/api/users - List users`);
      console.log(`   GET  http://localhost:${PORT}/api/users/:uid - Get user by UID`);
      console.log(`   PUT  http://localhost:${PORT}/api/users/:uid - Update user`);
      console.log(`   DELETE http://localhost:${PORT}/api/users/:uid - Delete user`);
      console.log(`   POST http://localhost:${PORT}/api/users/init-admin - Create default admin`);
      console.log(`   GET  http://localhost:${PORT}/api/users/stats - User statistics`);
      console.log('');
      console.log('✅ Server ready to accept connections');
      console.log('='.repeat(60));
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Exportar app para testing
export default app;

// Iniciar servidor automáticamente
startServer();