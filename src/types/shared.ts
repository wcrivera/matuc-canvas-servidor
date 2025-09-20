// ============================================================================
// TIPOS COMPARTIDOS - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: shared-types/index.ts
// Propósito: Tipos base compartidos entre frontend y backend
// Codificación: MINIMALISTA Y LIMPIA

/**
 * Identificadores únicos
 */
export type ID = string;
export type ESID = string; // Exercise Set ID
export type NQID = string; // Nested Question ID
export type SAID = string; // Student Attempt ID

/**
 * Estados básicos
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
export type ExerciseStatus = 'draft' | 'published' | 'archived';
export type AttemptStatus = 'not_started' | 'in_progress' | 'completed' | 'submitted' | 'graded';

/**
 * Tipos de pregunta
 */
export type QuestionType = 
    | 'multiple'
    | 'verdadero_falso'
    | 'texto_corto'
    | 'numerico'
    | 'matematica'
    | 'numero'
    | 'conjunto'
    | 'punto'
    | 'formula'
    | 'ecuacion'
    | 'antiderivada';

/**
 * Roles
 */
export type UserRole = 'instructor' | 'student' | 'admin';
export type LTIRole = 'Instructor' | 'Learner' | 'TeachingAssistant';

/**
 * Respuesta API estándar
 */
export interface ApiResponse<T = unknown> {
    readonly ok: boolean;
    readonly data?: T;
    readonly message?: string;
    readonly error?: string;
}

/**
 * Error de validación
 */
export interface ValidationError {
    readonly field: string;
    readonly message: string;
}

/**
 * Paginación LIMPIA
 */
export interface PaginationParams {
    readonly page: number;
    readonly limit: number;
}

export interface PaginatedResponse<T> {
    readonly items: T[];
    readonly pagination: {
        readonly currentPage: number;
        readonly totalPages: number;
        readonly totalItems: number;
        readonly itemsPerPage: number;
        readonly hasNextPage: boolean;
        readonly hasPreviousPage: boolean;
    };
}

/**
 * Datos LTI 1.1
 */
export interface LTIUserData {
    readonly user_id: string;
    readonly lis_person_name_full: string;
    readonly lis_person_contact_email_primary: string;
    readonly custom_canvas_user_id: string;
    readonly roles: LTIRole[];
}

export interface LTIContextData {
    readonly context_id: string;
    readonly context_title: string;
    readonly custom_canvas_course_id: string;
    readonly resource_link_id: string;
}

/**
 * Usuario base
 */
export interface BaseUser {
    readonly id: ID;
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly rol: UserRole;
}

/**
 * Configuración de ejercicio
 */
export interface ExerciseConfig {
    readonly intentos: number;
    readonly tiempo?: number;
    readonly mostrarRespuestas: boolean;
    readonly mostrarExplicaciones: boolean;
    readonly navegacionLibre: boolean;
    readonly autoguardado: boolean;
}

/**
 * Feedback de pregunta
 */
export interface QuestionFeedback {
    readonly correcto: string;
    readonly incorrecto: string;
    readonly explicacion?: string;
    readonly pista?: string;
}

/**
 * Configuración de pregunta
 */
export interface QuestionConfig {
    readonly opciones?: string[];
    readonly correctas?: number[];
    readonly tolerancia?: number;
    readonly caseSensitive?: boolean;
    readonly respuestasAceptadas?: string[];
}

/**
 * Pregunta base - LIMPIA Y CONSISTENTE
 */
export interface QuestionBase {
    readonly id: NQID;
    readonly exerciseSetId: ESID;
    readonly titulo: string;
    readonly enunciado: string;
    readonly tipo: QuestionType;
    readonly orden: number;
    readonly config: QuestionConfig;
    readonly respuestaCorrecta: any;
    readonly feedback: QuestionFeedback;
    readonly puntos: number;
    readonly dificultad: 'facil' | 'medio' | 'dificil';
    readonly tags: string[];
    readonly activo: boolean;
}

/**
 * Exercise Set base - LIMPIO Y CONSISTENTE
 */
export interface ExerciseSetBase {
    readonly id: ESID;
    readonly titulo: string;
    readonly descripcion: string;
    readonly instrucciones?: string;
    readonly preguntas: QuestionBase[];
    readonly configuracion: ExerciseConfig;
    readonly estado: ExerciseStatus;
    readonly activo: boolean;
    readonly publicado: boolean;
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
    readonly autorId: ID;
}

/**
 * Intento de estudiante
 */
export interface StudentAttemptBase {
    readonly id: SAID;
    readonly exerciseSetId: ESID;
    readonly studentId: ID;
    readonly estado: AttemptStatus;
    readonly fechaInicio: Date;
    readonly fechaFinalizacion?: Date;
    readonly puntajeObtenido?: number;
    readonly puntajeMaximo: number;
    readonly tiempoTranscurrido: number;
    readonly intentoNumero: number;
}

/**
 * Respuesta a pregunta
 */
export interface QuestionResponseBase {
    readonly id: ID;
    readonly questionId: NQID;
    readonly attemptId: SAID;
    readonly respuestaEstudiante: any;
    readonly esCorrecta: boolean;
    readonly puntajeObtenido: number;
    readonly puntajeMaximo: number;
    readonly tiempoRespuesta: number;
}

/**
 * Requests para APIs - LIMPIOS
 */
export interface CreateExerciseSetRequest {
    readonly titulo: string;
    readonly descripcion: string;
    readonly instrucciones?: string;
    readonly configuracion: ExerciseConfig;
}

export interface CreateQuestionRequest {
    readonly exerciseSetId: ESID;
    readonly titulo: string;
    readonly enunciado: string;
    readonly tipo: QuestionType;
    readonly orden: number;
    readonly config: QuestionConfig;
    readonly respuestaCorrecta: any;
    readonly feedback: QuestionFeedback;
    readonly puntos: number;
    readonly dificultad: 'facil' | 'medio' | 'dificil';
    readonly tags: string[];
}