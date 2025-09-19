// ============================================================================
// ROUTER PRINCIPAL - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/routes/index.ts
// Propósito: Configuración central de todas las rutas
// Compatible con estructura existente del proyecto base

import { Router, Application } from 'express';
import { ApiResponse } from '../types/shared';

// Importar controladores
import * as exerciseSetController from '../controllers/exerciseSetController';
import * as questionController from '../controllers/questionController';

// Importar rutas existentes (cuando estén disponibles)
// import usuarioRoutes from './usuario';
// import ejercicioRoutes from './ejercicio';

/**
 * Configura todas las rutas de la aplicación
 * Compatible con el patrón usado en matuc-3.0-servidor
 */
export const configurarRutas = (app: Application): void => {
    // Router principal
    const router = Router();

    // ============================================================================
    // RUTA DE SALUD - Para verificar que el servidor funciona
    // ============================================================================
    router.get('/health', (req, res) => {
        const response: ApiResponse<{ status: string; timestamp: string }> = {
            ok: true,
            message: 'MATUC LTI Exercise Composer - Servidor funcionando',
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString()
            }
        };
        res.status(200).json(response);
    });

    // ============================================================================
    // RUTA DE INFORMACIÓN - Información básica del servidor
    // ============================================================================
    router.get('/info', (req, res) => {
        const response: ApiResponse<{
            name: string;
            version: string;
            environment: string;
            database: string;
        }> = {
            ok: true,
            message: 'Información del servidor',
            data: {
                name: 'MATUC LTI Exercise Composer Backend',
                version: '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                database: process.env.DB_CNN ? 'MongoDB Conectado' : 'MongoDB No Configurado'
            }
        };
        res.status(200).json(response);
    });

    // ============================================================================
    // RUTAS DE LA API - Prefijo /api para todas las rutas
    // ============================================================================

    // ============================================================================
    // RUTAS EXERCISE SETS - CRUD Completo
    // ============================================================================

    // GET /api/exercise-sets - Listar todos los exercise sets
    router.get('/exercise-sets', exerciseSetController.obtenerExerciseSets);

    // GET /api/exercise-sets/:id - Obtener exercise set específico
    router.get('/exercise-sets/:id', exerciseSetController.obtenerExerciseSetPorId);

    // POST /api/exercise-sets - Crear nuevo exercise set
    router.post('/exercise-sets', exerciseSetController.crearExerciseSet);

    // PUT /api/exercise-sets/:id - Actualizar exercise set
    router.put('/exercise-sets/:id', exerciseSetController.actualizarExerciseSet);

    // DELETE /api/exercise-sets/:id - Eliminar exercise set
    router.delete('/exercise-sets/:id', exerciseSetController.eliminarExerciseSet);

    // PATCH /api/exercise-sets/:id/publish - Publicar/despublicar
    router.patch('/exercise-sets/:id/publish', exerciseSetController.togglePublicarExerciseSet);

    // ============================================================================
    // RUTAS EXERCISE SETS → PREGUNTAS ANIDADAS
    // ============================================================================

    // GET /api/exercise-sets/:exerciseSetId/questions - Listar preguntas de un exercise set
    router.get('/exercise-sets/:exerciseSetId/questions', questionController.obtenerPreguntasDeExerciseSet);

    // POST /api/exercise-sets/:exerciseSetId/questions - Crear pregunta en exercise set
    router.post('/exercise-sets/:exerciseSetId/questions', questionController.crearPregunta);

    // PATCH /api/exercise-sets/:exerciseSetId/questions/reorder - Reordenar preguntas
    router.patch('/exercise-sets/:exerciseSetId/questions/reorder', questionController.reordenarPreguntas);

    // ============================================================================
    // RUTAS PREGUNTAS INDIVIDUALES - CRUD
    // ============================================================================

    // GET /api/questions/:id - Obtener pregunta específica
    router.get('/questions/:id', questionController.obtenerPreguntaPorId);

    // PUT /api/questions/:id - Actualizar pregunta
    router.put('/questions/:id', questionController.actualizarPregunta);

    // DELETE /api/questions/:id - Eliminar pregunta
    router.delete('/questions/:id', questionController.eliminarPregunta);

    // ============================================================================
    // RUTAS FUTURAS - Intentos y respuestas de estudiantes
    // ============================================================================

    // Rutas que agregaremos después:
    // router.post('/exercise-sets/:id/attempts', attemptController.iniciarIntento);
    // router.get('/attempts/:id', attemptController.obtenerIntento);
    // router.post('/questions/:id/responses', responseController.enviarRespuesta);
    // router.get('/attempts/:id/results', responseController.obtenerResultados);

    // ============================================================================
    // RUTAS EXISTENTES DEL SISTEMA BASE (cuando estén disponibles)
    // ============================================================================

    // Descomentar cuando tengamos los archivos:
    // router.use('/usuarios', usuarioRoutes);
    // router.use('/ejercicios', ejercicioRoutes);
    // router.use('/preguntas', preguntaRoutes);
    // router.use('/grupos', grupoRoutes);
    // router.use('/estadisticas', estadisticaRoutes);

    // ============================================================================
    // NUEVAS RUTAS PARA LTI EXERCISE COMPOSER (las iremos agregando)
    // ============================================================================

    // Futuras rutas:
    // router.use('/lti', ltiRoutes);              // Archivo 5
    // router.use('/exercise-sets', exerciseSetRoutes);  // Archivo 6
    // router.use('/questions', questionRoutes);    // Archivo 7
    // router.use('/attempts', attemptRoutes);      // Archivo 8
    // router.use('/grading', gradingRoutes);       // Archivo 9

    // ============================================================================
    // MANEJO DE RUTAS NO ENCONTRADAS - Compatible con estructura existente
    // ============================================================================
    router.all('*', (req, res) => {
        const response: ApiResponse = {
            ok: false,
            message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
            error: 'ROUTE_NOT_FOUND'
        };
        res.status(404).json(response);
    });

    // ============================================================================
    // APLICAR RUTAS A LA APLICACIÓN
    // ============================================================================

    // Todas las rutas van bajo el prefijo /api
    app.use('/api', router);

    // Ruta raíz para verificación
    app.get('/', (req, res) => {
        const response: ApiResponse<{ message: string; endpoints: string[] }> = {
            ok: true,
            message: 'MATUC LTI Exercise Composer API',
            data: {
                message: 'Servidor funcionando correctamente',
                endpoints: [
                    'GET /api/health - Estado del servidor',
                    'GET /api/info - Información del servidor',
                    'GET /api/exercise-sets - Listar exercise sets',
                    'POST /api/exercise-sets - Crear exercise set',
                    'GET /api/exercise-sets/:id - Obtener exercise set',
                    'PUT /api/exercise-sets/:id - Actualizar exercise set',
                    'DELETE /api/exercise-sets/:id - Eliminar exercise set',
                    'PATCH /api/exercise-sets/:id/publish - Publicar/despublicar',
                    'GET /api/exercise-sets/:exerciseSetId/questions - Preguntas del set',
                    'POST /api/exercise-sets/:exerciseSetId/questions - Crear pregunta',
                    'PATCH /api/exercise-sets/:exerciseSetId/questions/reorder - Reordenar',
                    'GET /api/questions/:id - Obtener pregunta',
                    'PUT /api/questions/:id - Actualizar pregunta',
                    'DELETE /api/questions/:id - Eliminar pregunta'
                ]
            }
        };
        res.status(200).json(response);
    });
};

/**
 * Función auxiliar para logging de rutas (para desarrollo)
 */
export const logRoutes = (app: Application): void => {
    if (process.env.NODE_ENV === 'development') {
        console.log('\n🛣️  Rutas configuradas:');
        console.log('   GET  / - Página principal API');
        console.log('   GET  /api/health - Estado del servidor');
        console.log('   GET  /api/info - Información del servidor');
        console.log('\n📝 Exercise Sets CRUD:');
        console.log('   GET    /api/exercise-sets - Listar exercise sets');
        console.log('   GET    /api/exercise-sets/:id - Obtener exercise set');
        console.log('   POST   /api/exercise-sets - Crear exercise set');
        console.log('   PUT    /api/exercise-sets/:id - Actualizar exercise set');
        console.log('   DELETE /api/exercise-sets/:id - Eliminar exercise set');
        console.log('   PATCH  /api/exercise-sets/:id/publish - Publicar/despublicar');
        console.log('\n❓ Preguntas Anidadas CRUD:');
        console.log('   GET    /api/exercise-sets/:exerciseSetId/questions - Preguntas del set');
        console.log('   POST   /api/exercise-sets/:exerciseSetId/questions - Crear pregunta');
        console.log('   PATCH  /api/exercise-sets/:exerciseSetId/questions/reorder - Reordenar');
        console.log('   GET    /api/questions/:id - Obtener pregunta');
        console.log('   PUT    /api/questions/:id - Actualizar pregunta');
        console.log('   DELETE /api/questions/:id - Eliminar pregunta');
        console.log('\n🔮 Próximas rutas: Intentos y respuestas de estudiantes');
        console.log('   ALL    /api/* - Manejo 404\n');
    }
};