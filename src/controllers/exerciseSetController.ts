// ============================================================================
// EXERCISE SET CONTROLLER - CON GUARDS DIRECTOS
// ============================================================================

import { Request, Response } from 'express';
import { ExerciseSetService } from '../services/ExerciseSetService';

// ============================================================================
// TIPOS EXPLÍCITOS PARA CONTROLADORES
// ============================================================================

type ControllerResponse = Promise<Response<any, Record<string, any>>>;

// ============================================================================
// CONTROLADOR EXERCISE SET
// ============================================================================

export class ExerciseSetController {

    /**
     * Crear Exercise Set
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

            const { cid, uid, titulo, descripcion } = req.body;

            if (!cid) {
                return res.status(400).json({
                    ok: false,
                    message: 'cid (Curso ID) es requerido'
                });
            }

            if (!uid) {
                return res.status(400).json({
                    ok: false,
                    message: 'uid (Instructor ID) es requerido'
                });
            }

            if (!titulo) {
                return res.status(400).json({
                    ok: false,
                    message: 'titulo es requerido'
                });
            }

            if (!descripcion) {
                return res.status(400).json({
                    ok: false,
                    message: 'descripcion es requerida'
                });
            }

            const resultado = await ExerciseSetService.crear(req.body);

            console.log(resultado)

            if (resultado.ok) {
                return res.status(201).json({
                    ok: true,
                    message: 'Exercise Set creado exitosamente',
                    data: resultado.data
                });
            }

            return res.status(400).json({
                ok: false,
                message: 'Error al crear Exercise Set',
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
     * Obtener Exercise Set por ID
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

            const esid = req.params.esid;

            // Guard directo para el ID
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

            const resultado = await ExerciseSetService.obtenerPorId(esid);

            if (resultado.ok && resultado.data) {
                return res.json({
                    ok: true,
                    data: resultado.data
                });
            }

            return res.status(404).json({
                ok: false,
                message: 'Exercise Set no encontrado'
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
     * Obtener Exercise Sets por instructor
     */
    static async obtenerPorInstructor(req: Request, res: Response): ControllerResponse {
        try {
            // Guard directo para params
            if (!req.params) {
                return res.status(400).json({
                    ok: false,
                    message: 'Parámetros requeridos'
                });
            }

            const uid = req.params.uid;

            // Guard directo para el ID
            if (!uid) {
                return res.status(400).json({
                    ok: false,
                    message: 'Instructor ID es requerido'
                });
            }

            if (uid.length !== 24) {
                return res.status(400).json({
                    ok: false,
                    message: 'Instructor ID debe tener 24 caracteres'
                });
            }

            const resultado = await ExerciseSetService.obtenerPorInstructor(uid);

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
     * Actualizar Exercise Set
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

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se proporcionaron datos para actualizar'
                });
            }

            const resultado = await ExerciseSetService.actualizar(esid, req.body);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Exercise Set actualizado exitosamente',
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
     * Eliminar Exercise Set
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

            const resultado = await ExerciseSetService.eliminar(esid);

            if (resultado.ok) {
                return res.json({
                    ok: true,
                    message: 'Exercise Set eliminado exitosamente'
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