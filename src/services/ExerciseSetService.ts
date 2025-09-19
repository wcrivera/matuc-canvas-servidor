// ============================================================================
// CONTROLADOR EXERCISE SET - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/controllers/exerciseSetController.ts
// Propósito: CRUD básico para Exercise Sets
// Compatible con tipos compartidos y estructura frontend

import { Request, Response } from 'express';
import {
    ApiResponse,
    ExerciseSetBase,
    CreateExerciseSetRequest,
    PaginatedResponse,
    ValidationError,
    ValidationErrors
} from '../types/shared';

/**
 * Obtener todos los exercise sets
 * GET /api/exercise-sets
 */
export const obtenerExerciseSets = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parámetros de paginación
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // TODO: Cuando tengamos el modelo, reemplazar con consulta real
        // const exerciseSets = await ExerciseSet.find({ activo: true })
        //   .populate('autorId', 'nombre apellido email')
        //   .sort({ fechaCreacion: -1 })
        //   .skip(skip)
        //   .limit(limit);
        // const total = await ExerciseSet.countDocuments({ activo: true });

        // TEMPORAL: Datos de prueba para testing
        const exerciseSetsDemo: ExerciseSetBase[] = [
            {
                id: '507f1f77bcf86cd799439011',
                titulo: 'Ejercicios de Cálculo I',
                descripcion: 'Ejercicios básicos de límites y derivadas',
                instrucciones: 'Resuelve cada pregunta paso a paso',
                preguntas: [],
                configuracion: {
                    intentos: 3,
                    tiempo: 60,
                    mostrarRespuestas: true,
                    mostrarExplicaciones: true,
                    navegacionLibre: true,
                    autoguardado: true
                },
                estado: 'published',
                activo: true,
                publicado: true,
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                autorId: '507f1f77bcf86cd799439012',
                cursoId: '507f1f77bcf86cd799439013'
            },
            {
                id: '507f1f77bcf86cd799439014',
                titulo: 'Álgebra Lineal - Matrices',
                descripcion: 'Operaciones con matrices y determinantes',
                instrucciones: 'Calcula paso a paso cada operación',
                preguntas: [],
                configuracion: {
                    intentos: 2,
                    tiempo: 45,
                    mostrarRespuestas: false,
                    mostrarExplicaciones: true,
                    navegacionLibre: false,
                    autoguardado: true
                },
                estado: 'draft',
                activo: true,
                publicado: false,
                fechaCreacion: new Date(),
                fechaActualizacion: new Date(),
                autorId: '507f1f77bcf86cd799439015',
                cursoId: '507f1f77bcf86cd799439013'
            }
        ];

        const total = exerciseSetsDemo.length;
        const totalPages = Math.ceil(total / limit);

        const response: ApiResponse<PaginatedResponse<ExerciseSetBase>> = {
            ok: true,
            message: 'Exercise sets obtenidos correctamente',
            data: {
                items: exerciseSetsDemo.slice(skip, skip + limit),
                total,
                page,
                limit,
                totalPages
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener exercise sets:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise sets',
            error: 'FETCH_EXERCISE_SETS_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Obtener un exercise set por ID
 * GET /api/exercise-sets/:id
 */
export const obtenerExerciseSetPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, reemplazar con consulta real
        // const exerciseSet = await ExerciseSet.findById(id)
        //   .populate('autorId', 'nombre apellido email')
        //   .populate('preguntas');

        // TEMPORAL: Datos de prueba
        const exerciseSetDemo: ExerciseSetBase = {
            id,
            titulo: 'Ejercicios de Cálculo I',
            descripcion: 'Ejercicios básicos de límites y derivadas',
            instrucciones: 'Resuelve cada pregunta paso a paso',
            preguntas: [],
            configuracion: {
                intentos: 3,
                tiempo: 60,
                mostrarRespuestas: true,
                mostrarExplicaciones: true,
                navegacionLibre: true,
                autoguardado: true
            },
            estado: 'published',
            activo: true,
            publicado: true,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            autorId: '507f1f77bcf86cd799439012',
            cursoId: '507f1f77bcf86cd799439013'
        };

        const response: ApiResponse<ExerciseSetBase> = {
            ok: true,
            message: 'Exercise set obtenido correctamente',
            data: exerciseSetDemo
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener exercise set:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise set',
            error: 'FETCH_EXERCISE_SET_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Crear un nuevo exercise set
 * POST /api/exercise-sets
 */
export const crearExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const exerciseData: CreateExerciseSetRequest = req.body;

        // Validación básica
        const validationErrors: ValidationError[] = [];

        if (!exerciseData.titulo || exerciseData.titulo.trim().length === 0) {
            validationErrors.push({
                field: 'titulo',
                message: 'El título es obligatorio'
            });
        }

        if (!exerciseData.descripcion || exerciseData.descripcion.trim().length === 0) {
            validationErrors.push({
                field: 'descripcion',
                message: 'La descripción es obligatoria'
            });
        }

        if (!exerciseData.configuracion) {
            validationErrors.push({
                field: 'configuracion',
                message: 'La configuración es obligatoria'
            });
        }

        if (validationErrors.length > 0) {
            const response: ApiResponse<ValidationError[]> = {
                ok: false,
                message: 'Errores de validación',
                data: validationErrors,
                error: 'VALIDATION_ERROR'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, crear exercise set real
        // const nuevoExerciseSet = new ExerciseSet({
        //   titulo: exerciseData.titulo.trim(),
        //   descripcion: exerciseData.descripcion.trim(),
        //   instrucciones: exerciseData.instrucciones?.trim(),
        //   configuracion: exerciseData.configuracion,
        //   cursoId: exerciseData.cursoId,
        //   autorId: req.user?.id, // Del middleware de autenticación
        //   estado: 'draft',
        //   activo: true,
        //   publicado: false
        // });
        // const exerciseSetCreado = await nuevoExerciseSet.save();

        // TEMPORAL: Simular creación
        const exerciseSetCreado: ExerciseSetBase = {
            id: '507f1f77bcf86cd7994390' + Math.random().toString(36).substr(2, 2),
            titulo: exerciseData.titulo.trim(),
            descripcion: exerciseData.descripcion.trim(),
            preguntas: [],
            configuracion: exerciseData.configuracion,
            estado: 'draft',
            activo: true,
            publicado: false,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            autorId: 'temp-user-id',
            ...(exerciseData.instrucciones && { instrucciones: exerciseData.instrucciones.trim() }),
            ...(exerciseData.cursoId && { cursoId: exerciseData.cursoId })
        };

        const response: ApiResponse<ExerciseSetBase> = {
            ok: true,
            message: 'Exercise set creado correctamente',
            data: exerciseSetCreado
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('❌ Error al crear exercise set:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al crear exercise set',
            error: 'CREATE_EXERCISE_SET_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Actualizar un exercise set
 * PUT /api/exercise-sets/:id
 */
export const actualizarExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData: Partial<CreateExerciseSetRequest> = req.body;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, actualizar exercise set real
        // const exerciseSetActualizado = await ExerciseSet.findByIdAndUpdate(
        //   id,
        //   {
        //     ...updateData,
        //     fechaActualizacion: new Date()
        //   },
        //   { new: true, runValidators: true }
        // ).populate('autorId', 'nombre apellido email');

        // TEMPORAL: Simular actualización
        const exerciseSetActualizado: ExerciseSetBase = {
            id,
            titulo: updateData.titulo || 'Ejercicios Actualizados',
            descripcion: updateData.descripcion || 'Descripción actualizada',
            preguntas: [],
            configuracion: updateData.configuracion || {
                intentos: 3,
                tiempo: 60,
                mostrarRespuestas: true,
                mostrarExplicaciones: true,
                navegacionLibre: true,
                autoguardado: true
            },
            estado: 'draft',
            activo: true,
            publicado: false,
            fechaCreacion: new Date('2024-01-01'),
            fechaActualizacion: new Date(),
            autorId: 'temp-user-id',
            ...(updateData.instrucciones && { instrucciones: updateData.instrucciones }),
            ...(updateData.cursoId && { cursoId: updateData.cursoId })
        };

        const response: ApiResponse<ExerciseSetBase> = {
            ok: true,
            message: 'Exercise set actualizado correctamente',
            data: exerciseSetActualizado
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al actualizar exercise set:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al actualizar exercise set',
            error: 'UPDATE_EXERCISE_SET_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Eliminar un exercise set (soft delete)
 * DELETE /api/exercise-sets/:id
 */
export const eliminarExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, hacer soft delete real
        // const exerciseSetEliminado = await ExerciseSet.findByIdAndUpdate(
        //   id,
        //   { 
        //     activo: false,
        //     fechaActualizacion: new Date()
        //   },
        //   { new: true }
        // );

        const response: ApiResponse = {
            ok: true,
            message: 'Exercise set eliminado correctamente'
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al eliminar exercise set:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al eliminar exercise set',
            error: 'DELETE_EXERCISE_SET_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Publicar/despublicar un exercise set
 * PATCH /api/exercise-sets/:id/publish
 */
export const togglePublicarExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { publicado }: { publicado: boolean } = req.body;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, actualizar estado real
        // const exerciseSet = await ExerciseSet.findByIdAndUpdate(
        //   id,
        //   { 
        //     publicado,
        //     estado: publicado ? 'published' : 'draft',
        //     fechaPublicacion: publicado ? new Date() : undefined,
        //     fechaActualizacion: new Date()
        //   },
        //   { new: true }
        // );

        const response: ApiResponse = {
            ok: true,
            message: `Exercise set ${publicado ? 'publicado' : 'despublicado'} correctamente`
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al cambiar estado de publicación:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al cambiar estado de publicación',
            error: 'TOGGLE_PUBLISH_ERROR'
        };

        res.status(500).json(response);
    }
};