// ============================================================================
// TIPOS PARA EXERCISE SETS - EJERCICIOS CON PREGUNTAS ANIDADAS
// ============================================================================

import { BaseDocument, ObjectId, ExerciseSettings, ExerciseStatus, LTIContext, GradingInfo } from './common';

/**
 * Interface para Exercise Set (conjunto de ejercicios con preguntas anidadas)
 */
export interface IExerciseSet extends BaseDocument {
    // Información básica
    title: string;
    description: string;
    instructions?: string;

    // Preguntas anidadas
    nestedQuestions: ObjectId[]; // Referencias a NestedQuestion

    // Configuración del ejercicio
    settings: ExerciseSettings;

    // Información LTI
    ltiConfig: {
        courseId: string;
        resourceLinkId: string;
        contextId: string;
        maxScore: number;
        passingScore?: number;
        sendScoreToCanvas: boolean;
    };

    // Metadatos del instructor
    instructor: ObjectId;
    course: ObjectId;

    // Estado y configuración
    status: ExerciseStatus;
    publishedAt?: Date;
    dueDate?: Date;
    availableFrom?: Date;
    availableUntil?: Date;

    // Estadísticas
    stats: {
        totalAttempts: number;
        averageScore: number;
        completionRate: number;
        averageTimeSpent: number; // en minutos
    };

    // Configuración de visualización
    display: {
        showProgress: boolean;
        showTimer: boolean;
        showQuestionNumbers: boolean;
        showTotalQuestions: boolean;
    };
}

/**
 * Interface para intento de estudiante
 */
export interface IStudentAttempt extends BaseDocument {
    // Identificación
    exerciseSetId: ObjectId;
    studentId: ObjectId;
    attemptNumber: number;

    // Estado del intento
    status: 'in_progress' | 'completed' | 'submitted' | 'graded';

    // Temporización
    startedAt: Date;
    submittedAt?: Date;
    timeSpent: number; // en segundos

    // Respuestas
    responses: ObjectId[]; // Referencias a QuestionResponse

    // Calificación
    grading: GradingInfo;

    // Progreso
    progress: {
        currentQuestion: number;
        questionsAnswered: number;
        totalQuestions: number;
        percentageComplete: number;
    };

    // Contexto LTI
    ltiContext: LTIContext;

    // Metadatos
    ipAddress?: string;
    userAgent?: string;

    // Auto-guardado
    lastSavedAt: Date;
    autoSaveData: Record<string, any>;
}

/**
 * Request para crear Exercise Set
 */
export interface CreateExerciseSetRequest {
    title: string;
    description: string;
    instructions?: string;
    settings: ExerciseSettings;
    ltiConfig: {
        courseId: string;
        resourceLinkId: string;
        contextId: string;
        maxScore: number;
        passingScore?: number;
        sendScoreToCanvas?: boolean;
    };
    course: ObjectId;
    dueDate?: Date;
    availableFrom?: Date;
    availableUntil?: Date;
    display?: {
        showProgress?: boolean;
        showTimer?: boolean;
        showQuestionNumbers?: boolean;
        showTotalQuestions?: boolean;
    };
}

/**
 * Request para actualizar Exercise Set
 */
export interface UpdateExerciseSetRequest extends Partial<CreateExerciseSetRequest> {
    status?: ExerciseStatus;
}

/**
 * Request para iniciar intento
 */
export interface StartAttemptRequest {
    exerciseSetId: ObjectId;
    ltiContext: LTIContext;
}

/**
 * Response de Exercise Set con preguntas
 */
export interface ExerciseSetWithQuestions {
    exerciseSet: IExerciseSet;
    questions: Array<{
        id: ObjectId;
        title: string;
        statement: string;
        type: string;
        order: number;
        points: number;
        config: Record<string, any>;
        display: Record<string, any>;
    }>;
    currentAttempt?: IStudentAttempt;
    canStartNewAttempt: boolean;
    attemptsRemaining: number;
}

/**
 * Response de estadísticas del ejercicio
 */
export interface ExerciseStatistics {
    exerciseSetId: ObjectId;
    totalStudents: number;
    studentsCompleted: number;
    studentsInProgress: number;
    averageScore: number;
    averageTimeSpent: number;
    questionStats: Array<{
        questionId: ObjectId;
        correctAnswers: number;
        incorrectAnswers: number;
        averageTimeSpent: number;
        difficulty: number; // calculado basado en respuestas correctas
    }>;
}