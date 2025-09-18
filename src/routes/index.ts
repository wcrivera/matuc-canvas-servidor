// ============================================================================
// CONFIGURACIÓN PRINCIPAL DE RUTAS - MATUC LTI EXERCISE COMPOSER
// ============================================================================

import { Application } from 'express';
import exerciseSetRoutes from './exerciseSet';
import nestedQuestionRoutes from './nestedQuestion';
import studentAttemptRoutes from './studentAttempt';
import questionResponseRoutes from './questionResponse';

// ============================================================================
// CONFIGURAR TODAS LAS RUTAS
// ============================================================================

export const configurarRutas = (app: Application): void => {

    // Rutas LTI Exercise Composer
    app.use('/api/exercise-set', exerciseSetRoutes);
    app.use('/api/nested-question', nestedQuestionRoutes);
    app.use('/api/student-attempt', studentAttemptRoutes);
    app.use('/api/question-response', questionResponseRoutes);

    // Ruta de prueba general
    app.get('/api/lti/test', (req, res) => {
        res.json({
            ok: true,
            message: '🎯 MATUC LTI Exercise Composer API',
            version: '1.0.0',
            endpoints: {
                exerciseSet: '/api/exercise-set',
                nestedQuestion: '/api/nested-question',
                studentAttempt: '/api/student-attempt',
                questionResponse: '/api/question-response'
            },
            timestamp: new Date().toISOString()
        });
    });
};