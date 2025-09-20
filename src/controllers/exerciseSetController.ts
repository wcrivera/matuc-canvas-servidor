// ============================================================================
// EXERCISE SET CONTROLLER - REAL PARA PRODUCCIÓN
// ============================================================================

import { Request, Response } from 'express';
import {
    ApiResponse,
    ExerciseSetBase,
    CreateExerciseSetRequest,
    PaginatedResponse,
    ESID
} from '../types/shared';

// TODO: Importar modelo Mongoose cuando esté listo
// import { ExerciseSet } from '../models/ExerciseSet';

/**
 * Obtener todos los exercise sets con paginación
 * GET /api/exercise-sets?page=1&limit=10
 */
export const obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;

        // TODO: Reemplazar con consulta real a MongoDB
        // const exerciseSets = await ExerciseSet.find({ activo: true })
        //     .populate('preguntas')
        //     .skip(skip)
        //     .limit(limit)
        //     .sort({ fechaCreacion: -1 });

        // const totalItems = await ExerciseSet.countDocuments({ activo: true });

        // TEMPORAL: Simular respuesta vacía hasta tener MongoDB
        const exerciseSets: ExerciseSetBase[] = [];
        const totalItems = 0;

        const totalPages = Math.ceil(totalItems / limit);

        const response: ApiResponse<PaginatedResponse<ExerciseSetBase>> = {
            ok: true,
            message: 'Exercise sets obtenidos exitosamente',
            data: {
                items: exerciseSets,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en obtenerTodos:', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise sets',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Obtener exercise set por ID
 * GET /api/exercise-sets/:id
 */
export const obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || id.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de exercise set es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con consulta real a MongoDB
        // const exerciseSet = await ExerciseSet.findOne({ 
        //     _id: id, 
        //     activo: true 
        // }).populate('preguntas');

        // if (!exerciseSet) {
        //     const errorResponse: ApiResponse = {
        //         ok: false,
        //         message: 'Exercise set no encontrado'
        //     };
        //     return res.status(404).json(errorResponse);
        // }

        // TEMPORAL: Simular "no encontrado" hasta tener MongoDB
        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Exercise set no encontrado (MongoDB no conectado)'
        };
        return res.status(404).json(errorResponse);

    } catch (error) {
        console.error('Error en obtenerPorId:', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise set',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Crear nuevo exercise set
 * POST /api/exercise-sets
 */
export const crear = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { titulo, descripcion, configuracion, instrucciones } = req.body as CreateExerciseSetRequest;

        // Validaciones
        if (!titulo || titulo.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'El título es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        if (!descripcion || descripcion.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'La descripción es requerida'
            };
            return res.status(400).json(errorResponse);
        }

        if (!configuracion) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'La configuración es requerida'
            };
            return res.status(400).json(errorResponse);
        }

        // Validar configuración
        if (!configuracion.intentos || configuracion.intentos < 1) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'La configuración debe tener al menos 1 intento'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con creación real en MongoDB
        // const nuevoExerciseSet = new ExerciseSet({
        //     titulo: titulo.trim(),
        //     descripcion: descripcion.trim(),
        //     instrucciones: instrucciones?.trim(),
        //     configuracion,
        //     estado: 'draft',
        //     activo: true,
        //     publicado: false,
        //     fechaCreacion: new Date(),
        //     fechaActualizacion: new Date(),
        //     autorId: req.user?.id || 'temp_user_id', // Obtener del contexto LTI
        //     preguntas: []
        // });

        // const ejercicioGuardado = await nuevoExerciseSet.save();

        // TEMPORAL: Simular creación exitosa hasta tener MongoDB
        const errorResponse: ApiResponse = {
            ok: false,
            message: 'MongoDB no conectado - no se puede crear exercise set'
        };
        return res.status(503).json(errorResponse);

    } catch (error) {
        console.error('Error en crear:', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al crear exercise set',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Actualizar exercise set
 * PUT /api/exercise-sets/:id
 */
export const actualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData = req.body as Partial<CreateExerciseSetRequest>;

        if (!id || id.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de exercise set es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con actualización real en MongoDB
        // const exerciseSetActualizado = await ExerciseSet.findOneAndUpdate(
        //     { _id: id, activo: true },
        //     {
        //         ...updateData,
        //         fechaActualizacion: new Date()
        //     },
        //     { new: true, runValidators: true }
        // ).populate('preguntas');

        // if (!exerciseSetActualizado) {
        //     const errorResponse: ApiResponse = {
        //         ok: false,
        //         message: 'Exercise set no encontrado'
        //     };
        //     return res.status(404).json(errorResponse);
        // }

        // TEMPORAL: Simular "no encontrado" hasta tener MongoDB
        const errorResponse: ApiResponse = {
            ok: false,
            message: 'MongoDB no conectado - no se puede actualizar'
        };
        return res.status(503).json(errorResponse);

    } catch (error) {
        console.error('Error en actualizar:', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al actualizar exercise set',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Eliminar exercise set (soft delete)
 * DELETE /api/exercise-sets/:id
 */
export const eliminar = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || id.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de exercise set es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con soft delete real en MongoDB
        // const exerciseSetEliminado = await ExerciseSet.findOneAndUpdate(
        //     { _id: id, activo: true },
        //     { 
        //         activo: false,
        //         fechaActualizacion: new Date()
        //     },
        //     { new: true }
        // );

        // if (!exerciseSetEliminado) {
        //     const errorResponse: ApiResponse = {
        //         ok: false,
        //         message: 'Exercise set no encontrado'
        //     };
        //     return res.status(404).json(errorResponse);
        // }

        // TEMPORAL: Simular "no encontrado" hasta tener MongoDB
        const errorResponse: ApiResponse = {
            ok: false,
            message: 'MongoDB no conectado - no se puede eliminar'
        };
        return res.status(503).json(errorResponse);

    } catch (error) {
        console.error('Error en eliminar:', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al eliminar exercise set',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};