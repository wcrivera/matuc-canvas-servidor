// ============================================================================
// QUESTION RESPONSE CONTROLLER - CON GUARDS DIRECTOS
// ============================================================================

import { Request, Response } from 'express';
import { QuestionResponseService } from '../services/QuestionResponseService';

// ============================================================================
// TIPOS EXPLÍCITOS PARA CONTROLADORES
// ============================================================================

type ControllerResponse = Promise<Response<any, Record<string, any>>>;

// ============================================================================
// CONTROLADOR QUESTION RESPONSE
// ============================================================================

export class QuestionResponseController {

    /**
     * Crear respuesta
     */
    static async crear(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos
            if (!req.body) {
                return res.status(400).json({
                    ok: false,
                    message: 'Body requerido'
                });
            }

            const { nqid, said, uid, respuestaEstudiante } = req.body;

            if (!nqid) {
                return res.status(400).json({
                    ok: false,
                    message: 'nqid (Question ID) es requerido'
                });
            }

            if (!said) {
                return res.status(400).json({
                    ok: false,
                    message: 'said (Student Attempt ID) es requerido'
                });
            }

            if (!uid) {
                return res.status(400).json({
                    ok: false,
                    message: 'uid (Student ID) es requerido'
                });
            }

            if (respuestaEstudiante === undefined || respuestaEstudiante === null) {
                return res.status(400).json({
                    ok: false,
                    message: 'respuestaEstudiante es requerida'
                });
            }

            const resultado = await QuestionResponseService.crear(req.body);

            if (resultado.ok) {
                return res.status(201).json({
                    ok: true,
                    message: 'Respuesta creada exitosamente',
                    data: resultado.data
                });
            }

            return res.status(400).json({
                ok: false,
                message: 'Error al crear respuesta',
                error: resultado.error
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
                error: (error as Error).message
            });
        }
    }

    /**
     * Validar respuesta
     */
    static async validarRespuesta(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const nqid = req.params.nqid;

            if (!nqid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Question ID es requerido'
                });
            }

            if (nqid.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Question ID debe tener 24 caracteres'
                });
            }

            // Guards para body
            if (!req.body) {
                return res.status(400).json({
                    ok: false,
                    message: 'Body requerido'
                });
            }

            const respuestaEstudiante = req.body.respuestaEstudiante;

            if (respuestaEstudiante === undefined || respuestaEstudiante === null) {
                return res.status(400).json({
                    ok: false,
                    message: 'respuestaEstudiante es requerida'
                });
            }

            const resultado = await QuestionResponseService.validarRespuesta(nqid, respuestaEstudiante);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Respuesta validada exitosamente',
                    data: resultado.data
                });
            }

            return res.status(400).json({
                ok: false,
                error: resultado.error
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
                error: (error as Error).message
            });
        }
    }

    /**
     * Obtener respuestas por intento
     */
    static async obtenerPorIntento(req: Request, res: Response): ControllerResponse {
        try {
            // Guard directo para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const said = req.params.said;

            if (!said) {
                return res.status(400).json({
                    ok: false,
                    message: 'Student Attempt ID es requerido'
                });
            }

            if (said.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Student Attempt ID debe tener 24 caracteres'
                });
            }

            const resultado = await QuestionResponseService.obtenerPorIntento(said);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    data: resultado.data || []
                });
            }

            return res.status(400).json({
                ok: false,
                error: resultado.error
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
                error: (error as Error).message
            });
        }
    }

    /**
     * Actualizar respuesta
     */
    static async actualizar(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const qrid = req.params.qrid;

            if (!qrid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Question Response ID es requerido'
                });
            }

            if (qrid.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Question Response ID debe tener 24 caracteres'
                });
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const resultado = await QuestionResponseService.actualizar(qrid, req.body);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Respuesta actualizada exitosamente',
                    data: resultado.data
                });
            }

            return res.status(400).json({
                ok: false,
                error: resultado.error
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
                error: (error as Error).message
            });
        }
    }

    /**
     * Responder pregunta con validación automática
     */
    static async responderPregunta(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const nqid = req.params.nqid;
            const said = req.params.said;
            const uid = req.params.uid;

            if (!nqid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Question ID es requerido'
                });
            }

            if (nqid.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Question ID debe tener 24 caracteres'
                });
            }

            if (!said) {
                return res.status(400).json({
                    ok: false,
                    message: 'Student Attempt ID es requerido'
                });
            }

            if (said.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Student Attempt ID debe tener 24 caracteres'
                });
            }

            if (!uid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Student ID es requerido'
                });
            }

            if (uid.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Student ID debe tener 24 caracteres'
                });
            }

            // Guards para body
            if (!req.body) {
                return res.status(400).json({
                    ok: false,
                    message: 'Body requerido'
                });
            }

            const respuestaEstudiante = req.body.respuestaEstudiante;
            const tiempoGastado = req.body.tiempoGastado;

            if (respuestaEstudiante === undefined || respuestaEstudiante === null) {
                return res.status(400).json({
                    ok: false,
                    message: 'respuestaEstudiante es requerida'
                });
            }

            // Primero validar la respuesta
            const validacion = await QuestionResponseService.validarRespuesta(nqid, respuestaEstudiante);

            if (!validacion.ok) {
                return res.status(400).json({
                    ok: false,
                    error: validacion.error
                });
            }

            // Crear la respuesta con validación
            const respuestaData = {
                nqid,
                said,
                uid,
                respuestaEstudiante,
                tiempoGastado: tiempoGastado || 0,
                validacion: validacion.data,
                estado: 'calificada'
            };

            const resultado = await QuestionResponseService.crear(respuestaData);

            if (resultado.ok) {
                return res.status(201).json({
                    ok: true,
                    message: 'Respuesta procesada exitosamente',
                    data: {
                        respuesta: resultado.data,
                        validacion: validacion.data
                    }
                });
            }

            return res.status(400).json({
                ok: false,
                error: resultado.error
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error interno del servidor',
                error: (error as Error).message
            });
        }
    }
}