// ============================================================================
// RUTAS NESTED QUESTION - MINIMALISTAS
// ============================================================================

import { Router } from 'express';
import { NestedQuestionController } from '../controllers/nestedQuestionController';

const router = Router();

// ============================================================================
// RUTAS NESTED QUESTION
// ============================================================================

// Crear pregunta
// POST /api/nested-question
router.post('/', NestedQuestionController.crear);

// Obtener pregunta por ID
// GET /api/nested-question/:nqid
router.get('/:nqid', NestedQuestionController.obtenerPorId);

// Obtener preguntas por Exercise Set
// GET /api/nested-question/exercise/:esid
router.get('/exercise/:esid', NestedQuestionController.obtenerPorEjercicio);

// Actualizar pregunta
// PUT /api/nested-question/:nqid
router.put('/:nqid', NestedQuestionController.actualizar);

// Eliminar pregunta
// DELETE /api/nested-question/:nqid
router.delete('/:nqid', NestedQuestionController.eliminar);

export default router;