// ============================================================================
// CONTROLADOR EXERCISE SET - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/controllers/exerciseSetController.ts
// Propósito: CRUD completo para Exercise Sets con funciones individuales
// Compatible con tipos compartidos y estructura de rutas

import { Request, Response } from 'express';
import {
    ApiResponse,
    ExerciseSetBase,
    CreateExerciseSetRequest,
    PaginatedResponse,
    ValidationError,
    ValidationErrors
} from '../types/shared';

// ============================================================================
// OBTENER TODOS LOS EXERCISE SETS
// ============================================================================

/**
 * Obtener todos los exercise sets con paginación
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
            }
        ];

        const total = exerciseSetsDemo.length;
        const totalPages = Math.ceil(total / limit);

        const paginatedResponse: PaginatedResponse<ExerciseSetBase> = {
            items: exerciseSetsDemo,
            total,
            page,
            limit,
            totalPages
        };

        const response: ApiResponse<PaginatedResponse<ExerciseSetBase>> = {
            ok: true,
            message: 'Exercise sets obtenidos correctamente',
            data: paginatedResponse
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener exercise sets:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise sets',
            error: 'GET_EXERCISE_SETS_ERROR'
        };

        res.status(500).json(response);
    }
};

// ============================================================================
// OBTENER EXERCISE SET POR ID
// ============================================================================

/**
 * Obtener exercise set específico por ID
 * GET /api/exercise-sets/:id
 */
export const obtenerExerciseSetPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // TODO: Validar que sea un ObjectId válido
        if (!id) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID del exercise set es requerido',
                error: 'INVALID_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, reemplazar con consulta real
        // const exerciseSet = await ExerciseSet.findById(id)
        //   .populate('autorId', 'nombre apellido email')
        //   .populate('preguntas');

        // TEMPORAL: Simular búsqueda
        const exerciseSetDemo: ExerciseSetBase = {
            id: id,
            titulo: 'Ejercicio de Ejemplo',
            descripcion: 'Descripción del ejercicio encontrado',
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
            autorId: '507f1f77bcf86cd799439012'
        };

        const response: ApiResponse<ExerciseSetBase> = {
            ok: true,
            message: 'Exercise set encontrado',
            data: exerciseSetDemo
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener exercise set por ID:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise set',
            error: 'GET_EXERCISE_SET_BY_ID_ERROR'
        };

        res.status(500).json(response);
    }
};

// ============================================================================
// CREAR NUEVO EXERCISE SET
// ============================================================================

/**
 * Crear nuevo exercise set
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

// ============================================================================
// ACTUALIZAR EXERCISE SET
// ============================================================================

/**
 * Actualizar exercise set existente
 * PUT /api/exercise-sets/:id
 */
export const actualizarExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData: Partial<CreateExerciseSetRequest> = req.body;

        if (!id) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID del exercise set es requerido',
                error: 'INVALID_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Validar que exista el exercise set
        // TODO: Validar permisos del usuario
        // TODO: Actualizar en base de datos

        // TEMPORAL: Simular actualización
        const exerciseSetActualizado: ExerciseSetBase = {
            id: id,
            titulo: updateData.titulo || 'Título actualizado',
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
            fechaCreacion: new Date(Date.now() - 86400000), // 1 día atrás
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

// ============================================================================
// ELIMINAR EXERCISE SET
// ============================================================================

/**
 * Eliminar exercise set (soft delete)
 * DELETE /api/exercise-sets/:id
 */
export const eliminarExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID del exercise set es requerido',
                error: 'INVALID_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Validar que exista el exercise set
        // TODO: Validar permisos del usuario
        // TODO: Soft delete en base de datos (activo = false)

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

// ============================================================================
// TOGGLE PUBLICAR/DESPUBLICAR
// ============================================================================

/**
 * Publicar o despublicar exercise set
 * PATCH /api/exercise-sets/:id/publish
 */
export const togglePublicarExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID del exercise set es requerido',
                error: 'INVALID_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Obtener exercise set actual
        // TODO: Validar permisos
        // TODO: Cambiar estado de publicación

        // TEMPORAL: Simular toggle
        const exerciseSetActualizado: ExerciseSetBase = {
            id: id,
            titulo: 'Exercise Set Publicado',
            descripcion: 'Descripción del exercise set',
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
            fechaCreacion: new Date(Date.now() - 86400000),
            fechaActualizacion: new Date(),
            autorId: 'temp-user-id'
        };

        const response: ApiResponse<ExerciseSetBase> = {
            ok: true,
            message: 'Estado de publicación actualizado',
            data: exerciseSetActualizado
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

// ============================================================================
// FUNCIONES ADICIONALES PARA COMPATIBILIDAD CON RUTAS
// ============================================================================

/**
 * Obtener exercise sets por instructor (para rutas específicas)
 * GET /api/exercise-sets/instructor/:uid
 */
export const obtenerPorInstructor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = req.params;

        if (!uid) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID del instructor es requerido',
                error: 'INVALID_INSTRUCTOR_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Filtrar por autorId = uid
        // const exerciseSets = await ExerciseSet.find({ autorId: uid, activo: true });

        // TEMPORAL: Simular búsqueda por instructor
        const exerciseSetsDemo: ExerciseSetBase[] = [
            {
                id: '507f1f77bcf86cd799439011',
                titulo: 'Ejercicios del Instructor',
                descripcion: 'Ejercicios creados por este instructor',
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
                autorId: uid
            }
        ];

        const response: ApiResponse<ExerciseSetBase[]> = {
            ok: true,
            message: 'Exercise sets del instructor obtenidos',
            data: exerciseSetsDemo
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener exercise sets por instructor:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener exercise sets del instructor',
            error: 'GET_EXERCISE_SETS_BY_INSTRUCTOR_ERROR'
        };

        res.status(500).json(response);
    }
};

// ============================================================================
// ALIASES PARA COMPATIBILIDAD CON DIFERENTES ESTILOS DE RUTAS
// ============================================================================

// Alias para mantener compatibilidad con routes que usen 'crear'
export const crear = crearExerciseSet;

// Alias para mantener compatibilidad con routes que usen 'obtenerPorId'
export const obtenerPorId = obtenerExerciseSetPorId;

// Alias para mantener compatibilidad con routes que usen 'actualizar'
export const actualizar = actualizarExerciseSet;

// Alias para mantener compatibilidad con routes que usen 'eliminar'
export const eliminar = eliminarExerciseSet;