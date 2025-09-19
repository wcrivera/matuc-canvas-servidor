// ============================================================================
// RUTAS EXERCISE SET - MINIMALISTAS CORREGIDAS
// ============================================================================
// Archivo: src/routes/exerciseSet.ts
// Propósito: Rutas específicas para Exercise Sets usando funciones individuales
// Compatible con controlador corregido

import { Router } from 'express';
import {
    crear,
    obtenerPorId,
    obtenerPorInstructor,
    actualizar,
    eliminar
} from '../controllers/exerciseSetController';

const router = Router();

// ============================================================================
// RUTAS EXERCISE SET - Usando funciones individuales
// ============================================================================

// Crear Exercise Set
// POST /api/exercise-set
router.post('/', crear);

// Obtener Exercise Set por ID
// GET /api/exercise-set/:esid
router.get('/:esid', obtenerPorId);

// Obtener Exercise Sets por instructor
// GET /api/exercise-set/instructor/:uid
router.get('/instructor/:uid', obtenerPorInstructor);

// Actualizar Exercise Set
// PUT /api/exercise-set/:esid
router.put('/:esid', actualizar);

// Eliminar Exercise Set
// DELETE /api/exercise-set/:esid
router.delete('/:esid', eliminar);

export default router;