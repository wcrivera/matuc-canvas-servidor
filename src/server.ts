// ============================================================================
// SERVIDOR PRINCIPAL - MATUC LTI EXERCISE COMPOSER
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { config } from 'dotenv';
import { dbConnection, setupDatabaseEvents, setupDevelopmentLogging } from './config/database';
import { configurarRutas, logRoutes } from './routes';

// Cargar variables de entorno
config();

/**
 * Clase del servidor Express - Compatible con estructura existente
 * Ahora integrada con los nuevos archivos de configuración
 */
export default class Server {
  public app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';

    // Inicializar en el orden correcto
    this.initializeMiddlewares();
    this.connectDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Configurar middlewares básicos
   */
  private initializeMiddlewares(): void {
    // Security headers (configurado para Canvas LTI)
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          frameAncestors: ["'self'", "https://*.instructure.com"]
        }
      },
      xFrameOptions: false // Permitir embedding en Canvas
    }));

    // CORS configurado para Canvas
    const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
    this.app.use(cors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // límite de 100 requests por ventana por IP
      message: {
        ok: false,
        error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Logger de requests
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Parseo de JSON y URL encoded
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy (para Heroku, Railway, etc.)
    this.app.set('trust proxy', 1);

    console.log('✅ Middlewares configurados');
  }

  /**
   * Conectar a la base de datos
   */
  private async connectDatabase(): Promise<void> {
    try {
      // Configurar eventos de la base de datos
      setupDatabaseEvents();

      // Configurar logging de desarrollo si está habilitado
      setupDevelopmentLogging();

      // Conectar a MongoDB
      await dbConnection();

      console.log('✅ Base de datos inicializada');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
      process.exit(1);
    }
  }

  /**
   * Configurar rutas
   */
  private initializeRoutes(): void {
    // Configurar todas las rutas usando el archivo routes/index.ts
    configurarRutas(this.app);

    // Log de rutas en desarrollo
    if (process.env.NODE_ENV === 'development') {
      logRoutes(this.app);
    }

    console.log('✅ Rutas configuradas');
  }

  /**
   * Configurar manejo global de errores
   */
  private initializeErrorHandling(): void {
    // Middleware para manejo de errores no capturados
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('❌ Error no capturado:', error);

      // En desarrollo, mostrar stack trace
      const response = {
        ok: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      };

      res.status(500).json(response);
    });

    // Manejo de promesas rechazadas no capturadas
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.error('❌ Promesa rechazada no capturada:', promise, 'razón:', reason);
      // En producción, podríamos querer cerrar el servidor gracefully
      // process.exit(1);
    });

    // Manejo de excepciones no capturadas
    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Excepción no capturada:', error);
      process.exit(1);
    });

    console.log('✅ Manejo de errores configurado');
  }

  /**
   * Iniciar el servidor
   */
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log('\n🚀 ===============================================');
      console.log('🎯 MATUC LTI EXERCISE COMPOSER - SERVIDOR ACTIVO');
      console.log('🚀 ===============================================');
      console.log(`📍 Puerto: ${this.port}`);
      console.log(`🌐 URL: http://localhost:${this.port}`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Endpoints disponibles:`);
      console.log(`   🏠 http://localhost:${this.port}/`);
      console.log(`   ❤️  http://localhost:${this.port}/api/health`);
      console.log(`   ℹ️  http://localhost:${this.port}/api/info`);
      console.log(`   📝 http://localhost:${this.port}/api/exercise-sets`);
      console.log(`   ❓ http://localhost:${this.port}/api/questions`);
      console.log('🚀 ===============================================\n');
    });
  }

  /**
   * Cerrar servidor gracefully
   */
  public async close(): Promise<void> {
    console.log('🔄 Cerrando servidor...');
    // Aquí podríamos cerrar conexiones, limpiar recursos, etc.
    console.log('✅ Servidor cerrado');
  }
}

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

// Solo inicializar si este archivo es ejecutado directamente
if (require.main === module) {
  const server = new Server();
  server.listen();
}