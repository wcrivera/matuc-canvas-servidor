// ============================================================================
// SERVIDOR PRINCIPAL - MATUC LTI EXERCISE COMPOSER
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { config } from 'dotenv';
import { dbConnection } from './config/database';
import { configurarRutas } from './routes';

// Cargar variables de entorno
config();

/**
 * Clase del servidor Express - Compatible con estructura existente
 */
export default class Server {
  public app: express.Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';

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
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate limiting básico (solo para APIs)
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // 100 requests por ventana
      message: {
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
      }
    });
    this.app.use('/api/', limiter);

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  /**
   * Conectar a la base de datos
   */
  private async connectDatabase(): Promise<void> {
    try {
      await dbConnection();
    } catch (error) {
      console.error('❌ Error fatal: No se pudo conectar a la base de datos');
      process.exit(1);
    }
  }

  /**
   * Configurar rutas
   */
  private initializeRoutes(): void {
    // ====================================================
    // ENDPOINTS BÁSICOS DEL SISTEMA
    // ====================================================

    // Health check
    this.app.get('/health', (req: express.Request, res: express.Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'MATUC LTI Exercise Composer Backend',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Info del sistema
    this.app.get('/info', (req: express.Request, res: express.Response) => {
      res.json({
        name: 'MATUC LTI Exercise Composer',
        version: '1.0.0',
        description: 'Backend para Exercise Composer con preguntas anidadas',
        author: 'Wolfgang Rivera',
        endpoints: {
          health: '/health',
          info: '/info',
          api_test: '/api/lti/test',
          exercise_set: '/api/exercise-set',
          nested_question: '/api/nested-question',
          student_attempt: '/api/student-attempt',
          question_response: '/api/question-response'
        },
        database: 'MongoDB',
        features: ['LTI 1.3', 'Exercise Composer', 'Nested Questions'],
        status: 'Phase 5 Complete - Routes Active'
      });
    });

    // ====================================================
    // RUTAS LTI EXERCISE COMPOSER
    // ====================================================

    // Configurar todas las rutas LTI
    configurarRutas(this.app);

    // ====================================================
    // MANEJO DE RUTAS NO ENCONTRADAS
    // ====================================================

    // 404 handler
    this.app.use('*', (req: express.Request, res: express.Response) => {
      res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        available_endpoints: [
          'GET /health',
          'GET /info',
          'GET /api/lti/test',
          'POST /api/exercise-set',
          'POST /api/nested-question',
          'POST /api/student-attempt',
          'POST /api/question-response'
        ]
      });
    });
  }

  /**
   * Configurar manejo de errores
   */
  private initializeErrorHandling(): void {
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      console.error('❌ Error del servidor:', error);

      if (res.headersSent) {
        return next(error);
      }

      res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Método execute() para compatibilidad con estructura existente
   */
  public execute(): void {
    this.listen();
  }

  /**
   * Iniciar el servidor
   */
  public listen(): void {
    this.app.listen(this.port, () => {
      this.showStartupInfo();
    });
  }

  /**
   * Mostrar información de inicio
   */
  private showStartupInfo(): void {
    console.log('\n🚀 ===============================================');
    console.log('   MATUC-LTI EXERCISE COMPOSER INICIADO');
    console.log('===============================================');
    console.log(`📍 Puerto: ${this.port}`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL Local: http://localhost:${this.port}`);
    console.log('\n📋 ENDPOINTS LTI DISPONIBLES:');
    console.log(`   Health Check:      http://localhost:${this.port}/health`);
    console.log(`   Info Sistema:      http://localhost:${this.port}/info`);
    console.log(`   Test LTI:          http://localhost:${this.port}/api/lti/test`);
    console.log(`   Exercise Sets:     http://localhost:${this.port}/api/exercise-set`);
    console.log(`   Nested Questions:  http://localhost:${this.port}/api/nested-question`);
    console.log(`   Student Attempts:  http://localhost:${this.port}/api/student-attempt`);
    console.log(`   Question Response: http://localhost:${this.port}/api/question-response`);
    console.log('\n💡 PRUEBAS RÁPIDAS:');
    console.log('   curl http://localhost:3000/health');
    console.log('   curl http://localhost:3000/api/lti/test');
    console.log('===============================================\n');
  }
}