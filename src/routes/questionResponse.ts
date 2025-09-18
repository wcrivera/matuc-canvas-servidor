// ============================================================================
// RUTAS QUESTION RESPONSE - MINIMALISTAS
// ============================================================================

import { Router } from 'express';
import { QuestionResponseController } from '../controllers/questionResponseController';

const router = Router();

// ============================================================================
// RUTAS QUESTION RESPONSE
// ============================================================================

// Crear respuesta
// POST /api/question-response
router.post('/', QuestionResponseController.crear);

// Validar respuesta
// POST /api/question-response/validate/:nqid
router.post('/validate/:nqid', QuestionResponseController.validarRespuesta);

// Responder pregunta (crear + validar)
// POST /api/question-response/answer/:nqid/:said/:uid
router.post('/answer/:nqid/:said/:uid', QuestionResponseController.responderPregunta);

// Obtener respuestas por intento
// GET /api/question-response/attempt/:said
router.get('/attempt/:said', QuestionResponseController.obtenerPorIntento);

// Actualizar respuesta
// PUT /api/question-response/:qrid
router.put('/:qrid', QuestionResponseController.actualizar);

export default router;