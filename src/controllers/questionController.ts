// ============================================================================
// CONTROLADOR QUESTIONS - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/controllers/questionController.ts
// Propósito: CRUD para preguntas anidadas dentro de exercise sets
// Compatible con tipos compartidos y estructura frontend

import { Request, Response } from 'express';
import {
    ApiResponse,
    QuestionBase,
    CreateQuestionRequest,
    PaginatedResponse,
    ValidationError
} from '../types/shared';

/**
 * Obtener todas las preguntas de un exercise set
 * GET /api/exercise-sets/:exerciseSetId/questions
 */
export const obtenerPreguntasDeExerciseSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { exerciseSetId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        // Validación básica de ID
        if (!exerciseSetId || exerciseSetId.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, reemplazar con consulta real
        // const preguntas = await NestedQuestion.find({ 
        //   exerciseSetId, 
        //   activo: true 
        // })
        //   .sort({ orden: 1 })
        //   .skip(skip)
        //   .limit(limit);
        // const total = await NestedQuestion.countDocuments({ exerciseSetId, activo: true });

        // TEMPORAL: Datos de prueba para testing
        const preguntasDemo: QuestionBase[] = [
            {
                id: '507f1f77bcf86cd799439020',
                titulo: 'Límite de una función',
                enunciado: 'Calcule el límite: $$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$$',
                tipo: 'numerico',
                orden: 1,
                config: {
                    tolerancia: 0.01,
                    respuestasAceptadas: ['4', '4.0', '4.00']
                },
                respuestaCorrecta: 4,
                feedback: {
                    correcto: 'Correcto! El límite es 4',
                    incorrecto: 'Revisa el proceso de factorización',
                    explicacion: 'Al factorizar el numerador: (x+2)(x-2)/(x-2) = x+2, luego evaluar en x=2',
                    pista: 'Intenta factorizar el numerador'
                },
                puntos: 10,
                dificultad: 'medio',
                tiempoEstimado: 5,
                tags: ['límites', 'cálculo', 'factorización'],
                activo: true
            },
            {
                id: '507f1f77bcf86cd799439021',
                titulo: 'Derivada básica',
                enunciado: 'Encuentra la derivada de: $$f(x) = 3x^2 + 2x - 1$$',
                tipo: 'matematica',
                orden: 2,
                config: {
                    caseSensitive: false,
                    respuestasAceptadas: ['6x + 2', '6*x + 2', '2*3*x + 2']
                },
                respuestaCorrecta: '6x + 2',
                feedback: {
                    correcto: '¡Excelente! La derivada es correcta',
                    incorrecto: 'Revisa las reglas de derivación',
                    explicacion: 'Aplicando la regla de la potencia: d/dx(3x²) = 6x, d/dx(2x) = 2, d/dx(-1) = 0',
                    pista: 'Recuerda la regla: d/dx(xⁿ) = n·xⁿ⁻¹'
                },
                puntos: 15,
                dificultad: 'facil',
                tiempoEstimado: 3,
                tags: ['derivadas', 'cálculo', 'regla de la potencia'],
                activo: true
            },
            {
                id: '507f1f77bcf86cd799439022',
                titulo: 'Pregunta de selección múltiple',
                enunciado: '¿Cuál es la integral de cos(x)?',
                tipo: 'multiple',
                orden: 3,
                config: {
                    opciones: [
                        'sin(x) + C',
                        '-sin(x) + C',
                        'cos(x) + C',
                        '-cos(x) + C'
                    ],
                    correctas: [0] // Primera opción es correcta
                },
                respuestaCorrecta: 0,
                feedback: {
                    correcto: 'Correcto! La integral de cos(x) es sin(x) + C',
                    incorrecto: 'Revisa las integrales básicas',
                    explicacion: 'La integral de cos(x) es sin(x) + C, donde C es la constante de integración',
                    pista: 'Piensa en qué función tiene como derivada cos(x)'
                },
                puntos: 8,
                dificultad: 'facil',
                tiempoEstimado: 2,
                tags: ['integrales', 'cálculo', 'trigonometría'],
                activo: true
            }
        ];

        // Filtrar por exerciseSetId (simulado)
        const preguntasFiltradas = preguntasDemo; // En real, ya vendrían filtradas de la BD
        const total = preguntasFiltradas.length;
        const totalPages = Math.ceil(total / limit);

        const response: ApiResponse<PaginatedResponse<QuestionBase>> = {
            ok: true,
            message: 'Preguntas obtenidas correctamente',
            data: {
                items: preguntasFiltradas.slice(skip, skip + limit),
                total,
                page,
                limit,
                totalPages
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener preguntas:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener preguntas',
            error: 'FETCH_QUESTIONS_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Obtener una pregunta específica
 * GET /api/questions/:id
 */
export const obtenerPreguntaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de pregunta inválido',
                error: 'INVALID_QUESTION_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, reemplazar con consulta real
        // const pregunta = await NestedQuestion.findById(id);

        // TEMPORAL: Datos de prueba
        const preguntaDemo: QuestionBase = {
            id,
            titulo: 'Límite de una función',
            enunciado: 'Calcule el límite: $$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$$',
            tipo: 'numerico',
            orden: 1,
            config: {
                tolerancia: 0.01,
                respuestasAceptadas: ['4', '4.0', '4.00']
            },
            respuestaCorrecta: 4,
            feedback: {
                correcto: 'Correcto! El límite es 4',
                incorrecto: 'Revisa el proceso de factorización',
                explicacion: 'Al factorizar el numerador: (x+2)(x-2)/(x-2) = x+2, luego evaluar en x=2',
                pista: 'Intenta factorizar el numerador'
            },
            puntos: 10,
            dificultad: 'medio',
            tiempoEstimado: 5,
            tags: ['límites', 'cálculo', 'factorización'],
            activo: true
        };

        const response: ApiResponse<QuestionBase> = {
            ok: true,
            message: 'Pregunta obtenida correctamente',
            data: preguntaDemo
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al obtener pregunta:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener pregunta',
            error: 'FETCH_QUESTION_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Crear una nueva pregunta en un exercise set
 * POST /api/exercise-sets/:exerciseSetId/questions
 */
export const crearPregunta = async (req: Request, res: Response): Promise<void> => {
    try {
        const { exerciseSetId } = req.params;
        const questionData: CreateQuestionRequest = req.body;

        // Validación básica del exercise set ID
        if (!exerciseSetId || exerciseSetId.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        // Validación básica de datos
        const validationErrors: ValidationError[] = [];

        if (!questionData.titulo || questionData.titulo.trim().length === 0) {
            validationErrors.push({
                field: 'titulo',
                message: 'El título es obligatorio'
            });
        }

        if (!questionData.enunciado || questionData.enunciado.trim().length === 0) {
            validationErrors.push({
                field: 'enunciado',
                message: 'El enunciado es obligatorio'
            });
        }

        if (!questionData.tipo) {
            validationErrors.push({
                field: 'tipo',
                message: 'El tipo de pregunta es obligatorio'
            });
        }

        if (!questionData.respuestaCorrecta) {
            validationErrors.push({
                field: 'respuestaCorrecta',
                message: 'La respuesta correcta es obligatoria'
            });
        }

        if (!questionData.feedback || !questionData.feedback.correcto) {
            validationErrors.push({
                field: 'feedback.correcto',
                message: 'El feedback para respuesta correcta es obligatorio'
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

        // TODO: Cuando tengamos el modelo, crear pregunta real
        // const nuevaPregunta = new NestedQuestion({
        //   exerciseSetId,
        //   titulo: questionData.titulo.trim(),
        //   enunciado: questionData.enunciado.trim(),
        //   tipo: questionData.tipo,
        //   orden: questionData.orden,
        //   config: questionData.config,
        //   respuestaCorrecta: questionData.respuestaCorrecta,
        //   feedback: questionData.feedback,
        //   puntos: questionData.puntos,
        //   dificultad: questionData.dificultad,
        //   tiempoEstimado: questionData.tiempoEstimado,
        //   tags: questionData.tags,
        //   activo: true
        // });
        // const preguntaCreada = await nuevaPregunta.save();

        // TEMPORAL: Simular creación
        const preguntaCreada: QuestionBase = {
            id: '507f1f77bcf86cd7994390' + Math.random().toString(36).substr(2, 2),
            titulo: questionData.titulo.trim(),
            enunciado: questionData.enunciado.trim(),
            tipo: questionData.tipo,
            orden: questionData.orden,
            config: questionData.config,
            respuestaCorrecta: questionData.respuestaCorrecta,
            feedback: questionData.feedback,
            puntos: questionData.puntos,
            dificultad: questionData.dificultad,
            tiempoEstimado: questionData.tiempoEstimado,
            tags: questionData.tags,
            activo: true
        };

        const response: ApiResponse<QuestionBase> = {
            ok: true,
            message: 'Pregunta creada correctamente',
            data: preguntaCreada
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('❌ Error al crear pregunta:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al crear pregunta',
            error: 'CREATE_QUESTION_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Actualizar una pregunta
 * PUT /api/questions/:id
 */
export const actualizarPregunta = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData: Partial<CreateQuestionRequest> = req.body;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de pregunta inválido',
                error: 'INVALID_QUESTION_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, actualizar pregunta real
        // const preguntaActualizada = await NestedQuestion.findByIdAndUpdate(
        //   id,
        //   updateData,
        //   { new: true, runValidators: true }
        // );

        // TEMPORAL: Simular actualización
        const preguntaActualizada: QuestionBase = {
            id,
            titulo: updateData.titulo || 'Pregunta Actualizada',
            enunciado: updateData.enunciado || 'Enunciado actualizado',
            tipo: updateData.tipo || 'numerico',
            orden: updateData.orden || 1,
            config: updateData.config || {},
            respuestaCorrecta: updateData.respuestaCorrecta || 'Respuesta actualizada',
            feedback: updateData.feedback || {
                correcto: 'Correcto',
                incorrecto: 'Incorrecto'
            },
            puntos: updateData.puntos || 10,
            dificultad: updateData.dificultad || 'medio',
            tiempoEstimado: updateData.tiempoEstimado || 5,
            tags: updateData.tags || [],
            activo: true
        };

        const response: ApiResponse<QuestionBase> = {
            ok: true,
            message: 'Pregunta actualizada correctamente',
            data: preguntaActualizada
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al actualizar pregunta:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al actualizar pregunta',
            error: 'UPDATE_QUESTION_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Eliminar una pregunta (soft delete)
 * DELETE /api/questions/:id
 */
export const eliminarPregunta = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validación básica de ID
        if (!id || id.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de pregunta inválido',
                error: 'INVALID_QUESTION_ID'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, hacer soft delete real
        // const preguntaEliminada = await NestedQuestion.findByIdAndUpdate(
        //   id,
        //   { activo: false },
        //   { new: true }
        // );

        const response: ApiResponse = {
            ok: true,
            message: 'Pregunta eliminada correctamente'
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al eliminar pregunta:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al eliminar pregunta',
            error: 'DELETE_QUESTION_ERROR'
        };

        res.status(500).json(response);
    }
};

/**
 * Reordenar preguntas en un exercise set
 * PATCH /api/exercise-sets/:exerciseSetId/questions/reorder
 */
export const reordenarPreguntas = async (req: Request, res: Response): Promise<void> => {
    try {
        const { exerciseSetId } = req.params;
        const { questionIds }: { questionIds: string[] } = req.body;

        // Validación básica
        if (!exerciseSetId || exerciseSetId.length !== 24) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID de exercise set inválido',
                error: 'INVALID_EXERCISE_SET_ID'
            };
            res.status(400).json(response);
            return;
        }

        if (!questionIds || !Array.isArray(questionIds)) {
            const response: ApiResponse = {
                ok: false,
                message: 'Array de IDs de preguntas requerido',
                error: 'INVALID_QUESTION_IDS'
            };
            res.status(400).json(response);
            return;
        }

        // TODO: Cuando tengamos el modelo, actualizar orden real
        // for (let i = 0; i < questionIds.length; i++) {
        //   await NestedQuestion.findByIdAndUpdate(
        //     questionIds[i],
        //     { orden: i + 1 }
        //   );
        // }

        const response: ApiResponse = {
            ok: true,
            message: 'Preguntas reordenadas correctamente'
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('❌ Error al reordenar preguntas:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al reordenar preguntas',
            error: 'REORDER_QUESTIONS_ERROR'
        };

        res.status(500).json(response);
    }
};