// ============================================================================
// RUTAS EXERCISE SET - IMPORTS CORREGIDOS
// ============================================================================

import { Router } from 'express';

// Importar desde controllers/index para usar exports consistentes
import { exerciseSetController } from '../controllers';

const router = Router();

// Usar el controller consolidado
const {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    togglePublicarExerciseSet,
    obtenerPorInstructor  // Ya disponible como stub en controllers/index
} = exerciseSetController;

// ============================================================================
// RUTAS DE EXERCISE SETS
// ============================================================================

// GET - Listar todos los exercise sets
router.get('/', obtenerTodos);

// GET - Obtener exercise sets por instructor
router.get('/instructor/:uid', obtenerPorInstructor);

// GET - Obtener exercise set por ID
router.get('/:id', obtenerPorId);

// POST - Crear nuevo exercise set
router.post('/', crear);

// PUT - Actualizar exercise set
router.put('/:id', actualizar);

// DELETE - Eliminar exercise set (soft delete)
router.delete('/:id', eliminar);

// PATCH - Toggle publicar/despublicar exercise set
router.patch('/:id/publish', togglePublicarExerciseSet);

export default router;