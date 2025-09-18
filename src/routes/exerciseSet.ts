// ============================================================================
// RUTAS EXERCISE SET - MINIMALISTAS
// ============================================================================

import { Router } from 'express';
import { ExerciseSetController } from '../controllers/exerciseSetController';

const router = Router();

// ============================================================================
// RUTAS EXERCISE SET
// ============================================================================

// Crear Exercise Set
// POST /api/exercise-set
router.post('/', ExerciseSetController.crear);

// Obtener Exercise Set por ID
// GET /api/exercise-set/:esid
router.get('/:esid', ExerciseSetController.obtenerPorId);

// Obtener Exercise Sets por instructor
// GET /api/exercise-set/instructor/:uid
router.get('/instructor/:uid', ExerciseSetController.obtenerPorInstructor);

// Actualizar Exercise Set
// PUT /api/exercise-set/:esid
router.put('/:esid', ExerciseSetController.actualizar);

// Eliminar Exercise Set
// DELETE /api/exercise-set/:esid
router.delete('/:esid', ExerciseSetController.eliminar);

export default router;