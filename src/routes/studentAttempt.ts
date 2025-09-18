// ============================================================================
// RUTAS STUDENT ATTEMPT - MINIMALISTAS
// ============================================================================

import { Router } from 'express';
import { StudentAttemptController } from '../controllers/studentAttemptController';

const router = Router();

// ============================================================================
// RUTAS STUDENT ATTEMPT
// ============================================================================

// Iniciar nuevo intento
// POST /api/student-attempt
router.post('/', StudentAttemptController.iniciarIntento);

// Obtener intento actual
// GET /api/student-attempt/current/:uid/:esid
router.get('/current/:uid/:esid', StudentAttemptController.obtenerIntentoActual);

// Obtener intentos por estudiante
// GET /api/student-attempt/student/:uid
router.get('/student/:uid', StudentAttemptController.obtenerPorEstudiante);

// Completar intento
// PUT /api/student-attempt/complete/:said
router.put('/complete/:said', StudentAttemptController.completarIntento);

// Actualizar calificación
// PUT /api/student-attempt/grade/:said
router.put('/grade/:said', StudentAttemptController.actualizarCalificacion);

export default router;