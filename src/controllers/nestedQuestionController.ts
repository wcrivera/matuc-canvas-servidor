// ============================================================================
// NESTED QUESTION CONTROLLER - CON GUARDS DIRECTOS
// ============================================================================

import { Request, Response } from 'express';
import { NestedQuestionService } from '../services/NestedQuestionService';

// ============================================================================
// TIPOS EXPLÍCITOS PARA CONTROLADORES
// ============================================================================

type ControllerResponse = Promise<Response<any, Record<string, any>>>;

// ============================================================================
// CONTROLADOR NESTED QUESTION
// ============================================================================

export class NestedQuestionController {

    /**
     * Crear pregunta
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

            const { esid, titulo, enunciado, tipo, orden } = req.body;

            if (!esid) {
                return res.status(400).json({
                    ok: false,
                    message: 'esid (Exercise Set ID) es requerido'
                });
            }

            if (!titulo) {
                return res.status(400).json({
                    ok: false,
                    message: 'titulo es requerido'
                });
            }

            if (!enunciado) {
                return res.status(400).json({
                    ok: false,
                    message: 'enunciado es requerido'
                });
            }

            if (!tipo) {
                return res.status(400).json({
                    ok: false,
                    message: 'tipo es requerido'
                });
            }

            if (!orden) {
                return res.status(400).json({
                    ok: false,
                    message: 'orden es requerido'
                });
            }

            const resultado = await NestedQuestionService.crear(req.body);

            if (resultado.ok) {
                return res.status(201).json({
                    ok: true,
                    message: 'Pregunta creada exitosamente',
                    data: resultado.data
                });
            }

            return res.status(400).json({
                ok: false,
                message: 'Error al crear pregunta',
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
     * Obtener preguntas por Exercise Set
     */
    static async obtenerPorEjercicio(req: Request, res: Response): ControllerResponse {
        try {
            // Guard directo para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const esid = req.params.esid;

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

            const resultado = await NestedQuestionService.obtenerPorEjercicio(esid);

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
     * Obtener pregunta por ID
     */
    static async obtenerPorId(req: Request, res: Response): ControllerResponse {
        try {
            // Guard directo para params
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

            const resultado = await NestedQuestionService.obtenerPorId(nqid);

            if (resultado.ok && resultado.data) {
                return res.json({
                    ok: true,
                    data: resultado.data
                });
            }

            return res.status(404).json({
                ok: false,
                message: 'Pregunta no encontrada'
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
     * Actualizar pregunta
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

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const resultado = await NestedQuestionService.actualizar(nqid, req.body);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Pregunta actualizada exitosamente',
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
     * Eliminar pregunta
     */
    static async eliminar(req: Request, res: Response): ControllerResponse {
        try {
            // Guards directos
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

            const resultado = await NestedQuestionService.eliminar(nqid);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Pregunta eliminada exitosamente'
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