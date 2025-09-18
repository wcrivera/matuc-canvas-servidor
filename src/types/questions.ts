// ============================================================================
// TIPOS PARA PREGUNTAS ANIDADAS - EXERCISE COMPOSER
// ============================================================================

import { BaseDocument, ObjectId, ValidationResult } from './common';

/**
 * Tipos de preguntas soportadas
 */
export type QuestionType =
    | 'multiple_choice'
    | 'true_false'
    | 'short_answer'
    | 'numeric'
    | 'mathematical_expression'
    | 'fill_in_blank'
    | 'drag_and_drop'
    | 'ordering';

/**
 * Configuración específica por tipo de pregunta
 */
export interface QuestionTypeConfig {
    // Para multiple choice
    options?: string[];
    correctOptions?: number[]; // índices de opciones correctas
    allowMultipleSelection?: boolean;

    // Para numeric y mathematical
    tolerance?: number;
    units?: string;
    decimalPlaces?: number;

    // Para short answer y fill in blank
    caseSensitive?: boolean;
    exactMatch?: boolean;
    acceptedAnswers?: string[];

    // Para drag and drop y ordering
    items?: string[];
    correctOrder?: number[];
}

/**
 * Interface para pregunta anidada
 */
export interface INestedQuestion extends BaseDocument {
    // Identificación
    title: string;
    statement: string;
    type: QuestionType;
    order: number;

    // Configuración específica del tipo
    config: QuestionTypeConfig;

    // Respuesta correcta y validación
    correctAnswer: string | number | string[] | number[];
    validation: {
        validator: string; // Función de validación personalizada
        errorMessage?: string;
    };

    // Feedback y explicaciones
    feedback: {
        correct: string;
        incorrect: string;
        hint?: string;
        explanation?: string;
    };

    // Calificación
    points: number;

    // Metadatos
    tags: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedTime: number; // en minutos

    // Relaciones
    exerciseSetId: ObjectId;

    // Configuración de visualización
    display: {
        showPoints: boolean;
        showFeedback: boolean;
        allowRetry: boolean;
    };
}

/**
 * Request para crear pregunta
 */
export interface CreateQuestionRequest {
    title: string;
    statement: string;
    type: QuestionType;
    order: number;
    config: QuestionTypeConfig;
    correctAnswer: string | number | string[] | number[];
    validation?: {
        validator: string;
        errorMessage?: string;
    };
    feedback: {
        correct: string;
        incorrect: string;
        hint?: string;
        explanation?: string;
    };
    points: number;
    tags?: string[];
    difficulty?: 'easy' | 'medium' | 'hard';
    estimatedTime?: number;
    exerciseSetId: ObjectId;
    display?: {
        showPoints?: boolean;
        showFeedback?: boolean;
        allowRetry?: boolean;
    };
}

/**
 * Interface para respuesta del estudiante
 */
export interface IQuestionResponse extends BaseDocument {
    // Identificación
    questionId: ObjectId;
    studentId: ObjectId;
    attemptId: ObjectId;

    // Respuesta
    studentAnswer: string | number | string[] | number[];
    submittedAt: Date;

    // Validación automática
    autoValidation: ValidationResult;

    // Calificación manual (opcional)
    manualGrading?: {
        score: number;
        feedback: string;
        gradedBy: ObjectId;
        gradedAt: Date;
    };

    // Metadatos
    timeSpent: number; // en segundos
    attemptNumber: number;

    // Estado
    status: 'pending' | 'auto_graded' | 'manually_graded' | 'needs_review';
}

/**
 * Request para enviar respuesta
 */
export interface SubmitAnswerRequest {
    questionId: ObjectId;
    attemptId: ObjectId;
    studentAnswer: string | number | string[] | number[];
    timeSpent?: number;
}

/**
 * Response de validación de respuesta
 */
export interface QuestionValidationResponse {
    questionId: ObjectId;
    validation: ValidationResult;
    allowRetry: boolean;
    nextQuestion?: ObjectId;
}