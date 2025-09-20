// ============================================================================
// QUESTION CONTROLLER - REAL PARA PRODUCCIÓN
// ============================================================================

import { Request, Response } from 'express';
import {
    ApiResponse,
    QuestionBase,
    CreateQuestionRequest,
    PaginatedResponse,
    ValidationError,
    NQID,
    ESID
} from '../types/shared';

// TODO: Importar modelo Mongoose cuando esté listo
// import { NestedQuestion } from '../models/NestedQuestion';

/**
 * Obtener todas las preguntas de un exercise set
 * GET /api/exercise-sets/:exerciseSetId/questions?page=1&limit=10
 */
export const obtenerTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { exerciseSetId } = req.params;
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));
        const skip = (page - 1) * limit;

        if (!exerciseSetId || exerciseSetId.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de exercise set es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con consulta real a MongoDB
        // const preguntas = await NestedQuestion.find({ 
        //     exerciseSetId: exerciseSetId,
        //     activo: true 
        // })
        // .skip(skip)
        // .limit(limit)
        // .sort({ orden: 1 });

        // const totalItems = await NestedQuestion.countDocuments({ 
        //     exerciseSetId: exerciseSetId,
        //     activo: true 
        // });

        // TEMPORAL: Simular respuesta vacía hasta tener MongoDB
        const preguntas: QuestionBase[] = [];
        const totalItems = 0;

        const totalPages = Math.ceil(totalItems / limit);

        const response: ApiResponse<PaginatedResponse<QuestionBase>> = {
            ok: true,
            message: 'Preguntas obtenidas exitosamente',
            data: {
                items: preguntas,
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
        console.error('Error en obtenerTodos (preguntas):', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al obtener preguntas',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Obtener pregunta por ID
 * GET /api/questions/:id
 */
export const obtenerPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || id.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de pregunta es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con consulta real a MongoDB
        // const pregunta = await NestedQuestion.findOne({ 
        //     _id: id, 
        //     activo: true 
        // });

        // if (!pregunta) {
        //     const errorResponse: ApiResponse = {
        //         ok: false,
        //         message: 'Pregunta no encontrada'
        //     };
        //     return res.status(404).json(errorResponse);
        // }

        // TEMPORAL: Simular "no encontrado" hasta tener MongoDB
        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Pregunta no encontrada (MongoDB no conectado)'
        };
        return res.status(404).json(errorResponse);

    } catch (error) {
        console.error('Error en obtenerPorId (pregunta):', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al obtener pregunta',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Crear nueva pregunta
 * POST /api/exercise-sets/:exerciseSetId/questions
 */
export const crear = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { exerciseSetId } = req.params;
        const questionData = req.body as CreateQuestionRequest;

        // Validaciones
        const validationErrors: ValidationError[] = [];

        if (!exerciseSetId || exerciseSetId.trim().length === 0) {
            validationErrors.push({
                field: 'exerciseSetId',
                message: 'ID de exercise set es requerido'
            });
        }

        if (!questionData.titulo || questionData.titulo.trim().length === 0) {
            validationErrors.push({
                field: 'titulo',
                message: 'El título es requerido'
            });
        }

        if (!questionData.enunciado || questionData.enunciado.trim().length === 0) {
            validationErrors.push({
                field: 'enunciado',
                message: 'El enunciado es requerido'
            });
        }

        if (!questionData.tipo) {
            validationErrors.push({
                field: 'tipo',
                message: 'El tipo de pregunta es requerido'
            });
        }

        if (!questionData.config) {
            validationErrors.push({
                field: 'config',
                message: 'La configuración de pregunta es requerida'
            });
        }

        if (!questionData.feedback || !questionData.feedback.correcto) {
            validationErrors.push({
                field: 'feedback.correcto',
                message: 'El feedback para respuesta correcta es requerido'
            });
        }

        if (validationErrors.length > 0) {
            const errorResponse: ApiResponse<ValidationError[]> = {
                ok: false,
                message: 'Errores de validación',
                data: validationErrors
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con creación real en MongoDB
        // const nuevaPregunta = new NestedQuestion({
        //     exerciseSetId: exerciseSetId as ESID,
        //     titulo: questionData.titulo.trim(),
        //     enunciado: questionData.enunciado.trim(),
        //     tipo: questionData.tipo,
        //     orden: questionData.orden || 1,
        //     config: questionData.config,
        //     respuestaCorrecta: questionData.respuestaCorrecta,
        //     feedback: questionData.feedback,
        //     puntos: questionData.puntos || 1,
        //     dificultad: questionData.dificultad || 'medio',
        //     tags: questionData.tags || [],
        //     activo: true
        // });

        // const preguntaGuardada = await nuevaPregunta.save();

        // TEMPORAL: Simular creación exitosa hasta tener MongoDB
        const errorResponse: ApiResponse = {
            ok: false,
            message: 'MongoDB no conectado - no se puede crear pregunta'
        };
        return res.status(503).json(errorResponse);

    } catch (error) {
        console.error('Error en crear (pregunta):', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al crear pregunta',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Actualizar pregunta
 * PUT /api/questions/:id
 */
export const actualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData = req.body as Partial<CreateQuestionRequest>;

        if (!id || id.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de pregunta es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con actualización real en MongoDB
        // const preguntaActualizada = await NestedQuestion.findOneAndUpdate(
        //     { _id: id, activo: true },
        //     {
        //         ...updateData,
        //         fechaActualizacion: new Date()
        //     },
        //     { new: true, runValidators: true }
        // );

        // if (!preguntaActualizada) {
        //     const errorResponse: ApiResponse = {
        //         ok: false,
        //         message: 'Pregunta no encontrada'
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
        console.error('Error en actualizar (pregunta):', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al actualizar pregunta',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};

/**
 * Eliminar pregunta (soft delete)
 * DELETE /api/questions/:id
 */
export const eliminar = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || id.trim().length === 0) {
            const errorResponse: ApiResponse = {
                ok: false,
                message: 'ID de pregunta es requerido'
            };
            return res.status(400).json(errorResponse);
        }

        // TODO: Reemplazar con soft delete real en MongoDB
        // const preguntaEliminada = await NestedQuestion.findOneAndUpdate(
        //     { _id: id, activo: true },
        //     { 
        //         activo: false,
        //         fechaActualizacion: new Date()
        //     },
        //     { new: true }
        // );

        // if (!preguntaEliminada) {
        //     const errorResponse: ApiResponse = {
        //         ok: false,
        //         message: 'Pregunta no encontrada'
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
        console.error('Error en eliminar (pregunta):', error);

        const errorResponse: ApiResponse = {
            ok: false,
            message: 'Error al eliminar pregunta',
            error: error instanceof Error ? error.message : 'Error interno del servidor'
        };

        return res.status(500).json(errorResponse);
    }
};