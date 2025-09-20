// ============================================================================
// ROUTER PRINCIPAL - IMPORTS CORREGIDOS
// ============================================================================

import { Router, Application } from 'express';
import { ApiResponse } from '../types/shared';

// Importar desde controllers/index para usar los exports consistentes
import { exerciseSetController } from '../controllers';

// TODO: Importar question controller cuando esté listo
// import { questionController } from '../controllers';

/**
 * Configura todas las rutas de la aplicación
 */
export const configurarRutas = (app: Application): void => {
    const router = Router();

    // ============================================================================
    // RUTA DE SALUD
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
    // RUTA DE INFORMACIÓN
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
                database: process.env.DB_CNN ? 'MongoDB conectado' : 'MongoDB no configurado'
            }
        };
        res.status(200).json(response);
    });

    // ============================================================================
    // RUTAS DE EXERCISE SETS - USANDO CONTROLLER CORREGIDO
    // ============================================================================

    // GET - Listar todos los exercise sets
    router.get('/exercise-sets', exerciseSetController.obtenerTodos);

    // GET - Obtener exercise set por ID
    router.get('/exercise-sets/:id', exerciseSetController.obtenerPorId);

    // POST - Crear nuevo exercise set
    router.post('/exercise-sets', exerciseSetController.crear);

    // PUT - Actualizar exercise set
    router.put('/exercise-sets/:id', exerciseSetController.actualizar);

    // DELETE - Eliminar exercise set (soft delete)
    router.delete('/exercise-sets/:id', exerciseSetController.eliminar);

    // PATCH - Toggle publicar/despublicar exercise set
    router.patch('/exercise-sets/:id/publish', exerciseSetController.togglePublicarExerciseSet);

    // GET - Obtener exercise sets por instructor
    router.get('/exercise-sets/instructor/:uid', exerciseSetController.obtenerPorInstructor);

    // ============================================================================
    // RUTAS DE PREGUNTAS - COMENTADAS HASTA ARREGLAR QUESTIONCONTROLLER
    // ============================================================================

    // TODO: Descomentar cuando questionController esté corregido
    // router.get('/exercise-sets/:id/questions', questionController.obtenerTodos);
    // router.post('/exercise-sets/:id/questions', questionController.crear);
    // router.get('/questions/:id', questionController.obtenerPorId);
    // router.put('/questions/:id', questionController.actualizar);
    // router.delete('/questions/:id', questionController.eliminar);

    // ============================================================================
    // IMPORTAR OTRAS RUTAS - COMENTADAS TEMPORALMENTE
    // ============================================================================

    // TODO: Descomentar cuando estén corregidas
    // app.use('/api/nested-questions', require('./nestedQuestion').default);
    // app.use('/api/question-responses', require('./questionResponse').default);

    // ============================================================================
    // RUTAS TEMPORALES PARA TESTING
    // ============================================================================

    // Ruta temporal para verificar que las rutas funcionan
    router.get('/test', (req, res) => {
        const response: ApiResponse<{ message: string }> = {
            ok: true,
            message: 'Rutas funcionando correctamente',
            data: { message: 'Test exitoso' }
        };
        res.status(200).json(response);
    });

    // ============================================================================
    // APLICAR RUTAS AL APP
    // ============================================================================
    app.use('/api', router);
};