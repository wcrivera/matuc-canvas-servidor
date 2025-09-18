// ============================================================================
// STUDENT ATTEMPT CONTROLLER - CON GUARDS DIRECTOS
// ============================================================================

import { Request, Response } from 'express';
import { StudentAttemptService } from '../services/StudentAttemptService';

// ============================================================================
// TIPOS EXPLÍCITOS PARA CONTROLADORES
// ============================================================================

type ControllerResponse = Promise<Response<any, Record<string, any>>>;

// ============================================================================
// CONTROLADOR STUDENT ATTEMPT
// ============================================================================

export class StudentAttemptController {

    /**
     * Iniciar nuevo intento
     */
    static async iniciarIntento(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos
            if (!req.body) {
                return res.status(400).json({
                    ok: false,
                    message: 'Body requerido'
                });
            }

            const { esid, uid, numeroIntento, lti } = req.body;

            if (!esid) {
                return res.status(400).json({
                    ok: false,
                    message: 'esid (Exercise Set ID) es requerido'
                });
            }

            if (!uid) {
                return res.status(400).json({
                    ok: false,
                    message: 'uid (Student ID) es requerido'
                });
            }

            if (!numeroIntento) {
                return res.status(400).json({
                    ok: false,
                    message: 'numeroIntento es requerido'
                });
            }

            if (!lti) {
                return res.status(400).json({
                    ok: false,
                    message: 'lti context es requerido'
                });
            }

            const resultado = await StudentAttemptService.iniciarIntento(req.body);

            if (resultado.ok) {
                return res.status(201).json({
                    ok: true,
                    message: 'Intento iniciado exitosamente',
                    data: resultado.data
                });
            }

            return res.status(400).json({
                ok: false,
                message: 'Error al iniciar intento',
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
     * Obtener intento actual
     */
    static async obtenerIntentoActual(req: Request, res: Response): ControllerResponse {
        try {
            // Guard directo para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const uid = req.params.uid;
            const esid = req.params.esid;

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

            if (!esid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Exercise Set ID es requerido'
                });
            }

            if (esid.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Exercise Set ID debe tener 24 caracteres'
                });
            }

            const resultado = await StudentAttemptService.obtenerIntentoActual(uid, esid);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    data: resultado.data
                });
            }

            return res.status(404).json({
                ok: false,
                message: 'No hay intento en progreso'
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
     * Obtener intentos por estudiante
     */
    static async obtenerPorEstudiante(req: Request, res: Response): ControllerResponse {
        try {
            // Guard directo para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const uid = req.params.uid;

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

            // Query param opcional
            const esid = req.query?.esid as string | undefined;

            const resultado = await StudentAttemptService.obtenerPorEstudiante(uid, esid);

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
     * Completar intento
     */
    static async completarIntento(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos
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

            const resultado = await StudentAttemptService.completarIntento(said);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Intento completado exitosamente',
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
     * Actualizar calificación
     */
    static async actualizarCalificacion(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos
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

            if (!req.body) {
                return res.status(400).json({
                    ok: false,
                    message: 'Body con calificación requerido'
                });
            }

            const calificacion = req.body.calificacion;

            if (!calificacion) {
                return res.status(400).json({
                    ok: false,
                    message: 'calificacion es requerida'
                });
            }

            const resultado = await StudentAttemptService.actualizarCalificacion(said, calificacion);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Calificación actualizada exitosamente',
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
}