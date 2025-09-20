// ============================================================================
// TIPOS DEFINITIVOS ABSOLUTOS - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: shared-types/index.ts
// VERSIÓN: DEFINITIVA ABSOLUTA - NUNCA MÁS MODIFICAR
// Incluye: LTI 1.1 COMPLETO + Canvas + Frontend + Backend + Implementación Final

/**
 * Identificadores únicos - CORREGIDOS
 */
export type ID = string;    // MongoDB _id convertido a string
export type CID = string;   // Curso ID
export type ESID = string;  // Exercise Set ID
export type NQID = string;  // Nested Question ID
export type SAID = string;  // Student Attempt ID
export type QRID = string;  // Question Response ID
export type LSID = string;  // LTI Session ID
export type LTID = string;  // LTI Tool ID

/**
 * Estados básicos - DEFINITIVOS ABSOLUTOS
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
export type ExerciseStatus = 'borrador' | 'publicado' | 'archivado';
export type AttemptStatus = 'no_iniciado' | 'en_progreso' | 'completado' | 'enviado' | 'calificado';
export type LTISessionStatus = 'active' | 'expired' | 'invalid';
export type GradeStatus = 'pending' | 'sent' | 'failed' | 'success';

/**
 * Tipos de pregunta - DEFINITIVOS ABSOLUTOS
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
 * Dificultades - DEFINITIVAS ABSOLUTAS
 */
export type QuestionDifficulty = 'facil' | 'medio' | 'dificil';

/**
 * Roles - DEFINITIVOS ABSOLUTOS
 */
export type UserRole = 'instructor' | 'student' | 'admin';
export type LTIRole = 'Instructor' | 'Learner' | 'TeachingAssistant' | 'ContentDeveloper' | 'Administrator';

/**
 * Privacidad LTI - DEFINITIVA ABSOLUTA
 */
export type LTIPrivacyLevel = 'anonymous' | 'name_only' | 'public';

/**
 * Métodos OAuth - DEFINITIVOS ABSOLUTOS
 */
export type OAuthSignatureMethod = 'HMAC-SHA1' | 'RSA-SHA1' | 'PLAINTEXT';

/**
 * Respuesta API estándar - DEFINITIVA ABSOLUTA
 */
export interface ApiResponse<T = unknown> {
    readonly ok: boolean;
    readonly data?: T;
    readonly message?: string;
    readonly error?: string;
    readonly timestamp?: string;
    readonly requestId?: string;
}

/**
 * Error de validación - DEFINITIVO ABSOLUTO
 */
export interface ValidationError {
    readonly field: string;
    readonly message: string;
    readonly code?: string;
    readonly value?: any;
}

/**
 * Paginación - DEFINITIVA ABSOLUTA
 */
export interface PaginationParams {
    readonly page: number;
    readonly limit: number;
    readonly sortBy?: string;
    readonly sortOrder?: 'asc' | 'desc';
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

// ============================================================================
// LTI 1.1 COMPLETO - DEFINITIVO ABSOLUTO
// ============================================================================

/**
 * Parámetros completos de LTI 1.1 Launch - DEFINITIVOS ABSOLUTOS
 */
export interface LTILaunchParams {
    // OAuth requeridos
    readonly oauth_consumer_key: string;
    readonly oauth_signature_method: OAuthSignatureMethod;
    readonly oauth_timestamp: string;
    readonly oauth_nonce: string;
    readonly oauth_version: string;
    readonly oauth_signature: string;
    readonly oauth_callback?: string;

    // LTI básicos requeridos
    readonly lti_message_type: string;           // 'basic-lti-launch-request'
    readonly lti_version: string;                // 'LTI-1p0'
    readonly resource_link_id: string;
    readonly resource_link_title?: string;
    readonly resource_link_description?: string;

    // Usuario
    readonly user_id: string;
    readonly lis_person_name_given?: string;
    readonly lis_person_name_family?: string;
    readonly lis_person_name_full?: string;
    readonly lis_person_contact_email_primary?: string;
    readonly lis_person_sourcedid?: string;
    readonly roles: string;                      // Comma-separated roles

    // Contexto (Curso)
    readonly context_id: string;
    readonly context_type?: string;
    readonly context_title?: string;
    readonly context_label?: string;
    readonly lis_course_offering_sourcedid?: string;
    readonly lis_course_section_sourcedid?: string;

    // Tool Consumer (Canvas)
    readonly tool_consumer_instance_guid?: string;
    readonly tool_consumer_instance_name?: string;
    readonly tool_consumer_instance_description?: string;
    readonly tool_consumer_instance_url?: string;
    readonly tool_consumer_instance_contact_email?: string;

    // Outcome Service (Calificaciones)
    readonly lis_outcome_service_url?: string;
    readonly lis_result_sourcedid?: string;

    // Launch Presentation
    readonly launch_presentation_return_url?: string;
    readonly launch_presentation_document_target?: string;
    readonly launch_presentation_width?: string;
    readonly launch_presentation_height?: string;
    readonly launch_presentation_locale?: string;

    // Custom Canvas parameters
    readonly custom_canvas_user_id?: string;
    readonly custom_canvas_user_login_id?: string;
    readonly custom_canvas_course_id?: string;
    readonly custom_canvas_assignment_id?: string;
    readonly custom_canvas_assignment_title?: string;
    readonly custom_canvas_assignment_points_possible?: string;

    // Extension parameters
    readonly ext_outcomes_tool_placement_url?: string;
    readonly ext_outcome_data_values_accepted?: string;
    readonly ext_outcome_result_total_score_accepted?: string;

    // Extensiones adicionales que Canvas puede enviar
    readonly [key: `custom_${string}`]: string | undefined;
    readonly [key: `ext_${string}`]: string | undefined;
}

/**
 * Datos del usuario desde LTI - DEFINITIVOS ABSOLUTOS
 */
export interface LTIUserData {
    readonly user_id: string;
    readonly lis_person_name_given?: string;
    readonly lis_person_name_family?: string;
    readonly lis_person_name_full?: string;
    readonly lis_person_contact_email_primary?: string;
    readonly lis_person_sourcedid?: string;
    readonly custom_canvas_user_id?: string;
    readonly custom_canvas_user_login_id?: string;
    readonly roles: LTIRole[];
}

/**
 * Contexto del curso desde LTI - DEFINITIVO ABSOLUTO
 */
export interface LTIContextData {
    readonly context_id: string;
    readonly context_type?: string;
    readonly context_title?: string;
    readonly context_label?: string;
    readonly custom_canvas_course_id?: string;
    readonly lis_course_offering_sourcedid?: string;
    readonly lis_course_section_sourcedid?: string;
}

/**
 * Resource Link Data - DEFINITIVO ABSOLUTO
 */
export interface LTIResourceLinkData {
    readonly resource_link_id: string;
    readonly resource_link_title?: string;
    readonly resource_link_description?: string;
    readonly custom_canvas_assignment_id?: string;
    readonly custom_canvas_assignment_title?: string;
    readonly custom_canvas_assignment_points_possible?: string;
}

/**
 * Outcome Service Data - DEFINITIVO ABSOLUTO
 */
export interface LTIOutcomeData {
    readonly lis_outcome_service_url?: string;
    readonly lis_result_sourcedid?: string;
    readonly canSendGrades: boolean;
    readonly maxScore?: number;
}

/**
 * Tool Consumer Data - DEFINITIVO ABSOLUTO
 */
export interface LTIToolConsumerData {
    readonly tool_consumer_instance_guid?: string;
    readonly tool_consumer_instance_name?: string;
    readonly tool_consumer_instance_description?: string;
    readonly tool_consumer_instance_url?: string;
    readonly tool_consumer_instance_contact_email?: string;
}

/**
 * Launch Presentation Data - DEFINITIVO ABSOLUTO
 */
export interface LTILaunchPresentationData {
    readonly return_url?: string;
    readonly document_target?: string;
    readonly width?: number;
    readonly height?: number;
    readonly locale?: string;
}

/**
 * Sesión LTI completa - DEFINITIVA ABSOLUTA
 */
export interface LTISession {
    readonly lsid: LSID;
    readonly userId: ID;                         // MongoDB _id del usuario
    readonly userData: LTIUserData;
    readonly contextData: LTIContextData;
    readonly resourceLinkData: LTIResourceLinkData;
    readonly outcomeData: LTIOutcomeData;
    readonly toolConsumerData: LTIToolConsumerData;
    readonly launchPresentationData: LTILaunchPresentationData;
    readonly launchParams: LTILaunchParams;
    readonly status: LTISessionStatus;
    readonly isActive: boolean;
    readonly expiresAt: Date;
    readonly createdAt: Date;
    readonly lastActivity: Date;
}

/**
 * Configuración del Tool Provider - DEFINITIVA ABSOLUTA
 */
export interface LTIToolConfig {
    readonly ltid: LTID;
    readonly title: string;
    readonly description: string;
    readonly launch_url: string;
    readonly secure_launch_url: string;
    readonly icon_url?: string;
    readonly privacy_level: LTIPrivacyLevel;
    readonly consumer_key: string;
    readonly consumer_secret: string;
    readonly custom_fields?: Record<string, string>;
    readonly extensions?: Record<string, any>;
    readonly version: string;                    // 'LTI-1p0'
    readonly message_type: string;               // 'basic-lti-launch-request'
    readonly is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}

/**
 * Outcome Service Request - DEFINITIVO ABSOLUTO
 */
export interface LTIOutcomeRequest {
    readonly operation: 'replaceResult' | 'readResult' | 'deleteResult';
    readonly sourcedId: string;
    readonly score?: number;                     // 0.0 to 1.0
    readonly resultData?: {
        readonly text?: string;
        readonly url?: string;
    };
}

/**
 * Outcome Service Response - DEFINITIVO ABSOLUTO
 */
export interface LTIOutcomeResponse {
    readonly success: boolean;
    readonly messageRefIdentifier: string;
    readonly operationRefIdentifier: string;
    readonly description?: string;
    readonly score?: number;
    readonly resultData?: {
        readonly text?: string;
        readonly url?: string;
    };
}

/**
 * Grade Passback Data - DEFINITIVO ABSOLUTO
 */
export interface LTIGradePassback {
    readonly gpid: string;                       // Grade Passback ID
    readonly said: SAID;                         // Student Attempt ID
    readonly lsid: LSID;                         // LTI Session ID
    readonly lis_result_sourcedid: string;
    readonly lis_outcome_service_url: string;
    readonly score: number;                      // 0.0 to 1.0
    readonly maxScore: number;
    readonly status: GradeStatus;
    readonly attempts: number;
    readonly lastAttemptAt?: Date;
    readonly successAt?: Date;
    readonly errorMessage?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

// ============================================================================
// MODELOS DE DATOS PRINCIPALES - DEFINITIVOS ABSOLUTOS
// ============================================================================

/**
 * Usuario base - CORREGIDO
 */
export interface BaseUser {
    readonly id: ID;              // MongoDB _id convertido a string
    readonly email: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly rol: UserRole;
    readonly canvasUserId?: string;
    readonly ltiUserId?: string;
    readonly activo: boolean;
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
}

/**
 * Configuración de ejercicio - DEFINITIVA ABSOLUTA
 */
export interface ExerciseConfig {
    readonly intentos: number;
    readonly tiempo?: number;                    // en minutos
    readonly mostrarRespuestas: boolean;
    readonly mostrarExplicaciones: boolean;
    readonly navegacionLibre: boolean;
    readonly autoguardado: boolean;
    readonly fechaInicio?: Date;
    readonly fechaFin?: Date;
    readonly enviarACanvas: boolean;
    readonly requiereCompletacion: boolean;
    readonly mostrarProgreso: boolean;
    readonly permitirRevision: boolean;
}

/**
 * Configuración LTI completa - DEFINITIVA ABSOLUTA
 */
export interface LTIConfig {
    readonly canvasCourseId: string;
    readonly canvasAssignmentId?: string;
    readonly resourceLinkId: string;
    readonly contextId: string;
    readonly maxScore: number;
    readonly enviarACanvas: boolean;
    readonly outcomeServiceUrl?: string;
    readonly resultSourcedId?: string;
    readonly returnUrl?: string;
    readonly privacyLevel: LTIPrivacyLevel;
    readonly customFields?: Record<string, string>;
}

/**
 * Feedback de pregunta - DEFINITIVO ABSOLUTO
 */
export interface QuestionFeedback {
    readonly correcto: string;
    readonly incorrecto: string;
    readonly explicacion?: string;
    readonly pista?: string;
    readonly solucion?: string;
    readonly referencias?: string[];
}

/**
 * Configuración de pregunta - DEFINITIVA ABSOLUTA
 */
export interface QuestionConfig {
    readonly opciones?: string[];                // Para múltiple opción
    readonly correctas?: number[];               // Índices correctos
    readonly tolerancia?: number;                // Para numérico
    readonly caseSensitive?: boolean;            // Para texto
    readonly respuestasAceptadas?: string[];     // Alternativas válidas
    readonly formula?: string;                   // Para matemáticas
    readonly variables?: Record<string, any>;    // Variables para fórmulas
    readonly puntosParciales?: boolean;          // Permite puntos parciales
    readonly ordenImporta?: boolean;             // Para respuestas ordenadas
    readonly mostrarCalculadora?: boolean;       // Mostrar calculadora
    readonly mostrarFormulario?: boolean;        // Mostrar editor de fórmulas
    readonly randomizarOpciones?: boolean;       // Randomizar opciones
}

/**
 * Pregunta base - DEFINITIVA ABSOLUTA
 */
export interface QuestionBase {
    readonly nqid: NQID;
    readonly esid: ESID;                         // Exercise Set al que pertenece
    readonly titulo: string;
    readonly enunciado: string;
    readonly tipo: QuestionType;
    readonly orden: number;
    readonly config: QuestionConfig;
    readonly respuestaCorrecta: any;
    readonly feedback: QuestionFeedback;
    readonly puntos: number;
    readonly dificultad: QuestionDifficulty;
    readonly tags: string[];
    readonly activo: boolean;
    readonly tiempoEstimado?: number;            // en minutos
    readonly imagen?: string;                    // URL de imagen
    readonly video?: string;                     // URL de video
    readonly audio?: string;                     // URL de audio
    readonly latex?: string;                     // Fórmulas LaTeX
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
}

/**
 * Exercise Set base - DEFINITIVO ABSOLUTO
 */
export interface ExerciseSetBase {
    readonly esid: ESID;
    readonly cid: CID;                           // Curso ID
    readonly uid: UID;                           // Instructor/Autor ID
    readonly titulo: string;
    readonly descripcion: string;
    readonly instrucciones?: string;
    readonly preguntas: NQID[];                  // Array de IDs de preguntas
    readonly configuracion: ExerciseConfig;
    readonly ltiConfig: LTIConfig;
    readonly estado: ExerciseStatus;
    readonly activo: boolean;
    readonly publicado: boolean;
    readonly fechaPublicacion?: Date;
    readonly fechaVencimiento?: Date;
    readonly puntajeTotal: number;
    readonly tiempoEstimadoTotal?: number;       // en minutos
    readonly imagen?: string;                    // URL de imagen de portada
    readonly categoria?: string;
    readonly dificultadPromedio?: QuestionDifficulty;
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
}

/**
 * Intento de estudiante - DEFINITIVO ABSOLUTO
 */
export interface StudentAttemptBase {
    readonly said: SAID;
    readonly esid: ESID;                         // Exercise Set
    readonly uid: UID;                           // Estudiante
    readonly lsid?: LSID;                        // LTI Session (si aplica)
    readonly estado: AttemptStatus;
    readonly fechaInicio: Date;
    readonly fechaFinalizacion?: Date;
    readonly puntajeObtenido?: number;
    readonly puntajeMaximo: number;
    readonly porcentaje?: number;                // 0-100
    readonly tiempoTranscurrido: number;         // en segundos
    readonly intentoNumero: number;
    readonly respuestas: QRID[];                 // Array de IDs de respuestas
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly enviadoACanvas: boolean;
    readonly gradePassbackId?: string;
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
}

/**
 * Respuesta a pregunta individual - DEFINITIVA ABSOLUTA
 */
export interface QuestionResponseBase {
    readonly id: QRID;
    readonly questionId: NQID;                   // Pregunta
    readonly attemptId: SAID;                    // Intento
    readonly studentId: ID;                      // Estudiante ID (_id de MongoDB)
    readonly respuestaEstudiante: any;
    readonly respuestaCorrecta: any;
    readonly esCorrecta: boolean;
    readonly puntajeObtenido: number;
    readonly puntajeMaximo: number;
    readonly porcentaje: number;                 // 0-100
    readonly tiempoRespuesta: number;            // en segundos
    readonly numeroIntentos: number;
    readonly feedbackMostrado?: string;
    readonly puntajesParciales?: number[];       // Para preguntas complejas
    readonly metadatos?: Record<string, any>;    // Datos adicionales
    readonly fechaCreacion: Date;
    readonly fechaActualizacion: Date;
}

// ============================================================================
// REQUESTS PARA APIS - DEFINITIVOS ABSOLUTOS
// ============================================================================

/**
 * Requests para Exercise Sets - DEFINITIVOS ABSOLUTOS
 */
export interface CreateExerciseSetRequest {
    readonly titulo: string;
    readonly descripcion: string;
    readonly instrucciones?: string;
    readonly configuracion: ExerciseConfig;
    readonly ltiConfig: LTIConfig;
    readonly cid: CID;                           // Curso ID
    readonly categoria?: string;
    readonly imagen?: string;
}

export interface UpdateExerciseSetRequest {
    readonly titulo?: string;
    readonly descripcion?: string;
    readonly instrucciones?: string;
    readonly configuracion?: Partial<ExerciseConfig>;
    readonly ltiConfig?: Partial<LTIConfig>;
    readonly estado?: ExerciseStatus;
    readonly publicado?: boolean;
    readonly categoria?: string;
    readonly imagen?: string;
}

/**
 * Requests para Questions - DEFINITIVOS ABSOLUTOS
 */
export interface CreateQuestionRequest {
    readonly esid: ESID;
    readonly titulo: string;
    readonly enunciado: string;
    readonly tipo: QuestionType;
    readonly orden: number;
    readonly config: QuestionConfig;
    readonly respuestaCorrecta: any;
    readonly feedback: QuestionFeedback;
    readonly puntos: number;
    readonly dificultad: QuestionDifficulty;
    readonly tags: string[];
    readonly tiempoEstimado?: number;
    readonly imagen?: string;
    readonly video?: string;
    readonly audio?: string;
    readonly latex?: string;
}

export interface UpdateQuestionRequest {
    readonly titulo?: string;
    readonly enunciado?: string;
    readonly tipo?: QuestionType;
    readonly orden?: number;
    readonly config?: Partial<QuestionConfig>;
    readonly respuestaCorrecta?: any;
    readonly feedback?: Partial<QuestionFeedback>;
    readonly puntos?: number;
    readonly dificultad?: QuestionDifficulty;
    readonly tags?: string[];
    readonly activo?: boolean;
    readonly tiempoEstimado?: number;
    readonly imagen?: string;
    readonly video?: string;
    readonly audio?: string;
    readonly latex?: string;
}

/**
 * Requests para Attempts - DEFINITIVOS ABSOLUTOS
 */
export interface StartAttemptRequest {
    readonly esid: ESID;
    readonly uid: UID;
    readonly lsid?: LSID;                        // LTI Session si aplica
}

export interface SubmitAnswerRequest {
    readonly said: SAID;
    readonly nqid: NQID;
    readonly respuesta: any;
    readonly tiempoRespuesta?: number;
    readonly metadatos?: Record<string, any>;
}

export interface FinishAttemptRequest {
    readonly said: SAID;
    readonly enviarACanvas?: boolean;
}

/**
 * Requests para LTI - DEFINITIVOS ABSOLUTOS
 */
export interface LTILaunchRequest {
    readonly launchParams: LTILaunchParams;
    readonly consumerKey: string;
    readonly signature: string;
}

export interface LTIGradePassbackRequest {
    readonly said: SAID;
    readonly score: number;                      // 0.0 to 1.0
    readonly resultData?: {
        readonly text?: string;
        readonly url?: string;
    };
}

// ============================================================================
// RESPUESTAS CON DATOS POBLADOS - DEFINITIVAS ABSOLUTAS
// ============================================================================

export interface ExerciseSetWithQuestions extends Omit<ExerciseSetBase, 'preguntas'> {
    readonly preguntas: QuestionBase[];
}

export interface StudentAttemptWithResponses extends Omit<StudentAttemptBase, 'respuestas'> {
    readonly respuestas: QuestionResponseBase[];
}

export interface StudentAttemptWithExercise extends StudentAttemptBase {
    readonly exerciseSet: ExerciseSetBase;
}

export interface QuestionResponseWithQuestion extends QuestionResponseBase {
    readonly question: QuestionBase;
}

// ============================================================================
// FILTROS Y BÚSQUEDAS - DEFINITIVOS ABSOLUTOS
// ============================================================================

export interface ExerciseSetFilters {
    readonly cid?: CID;
    readonly uid?: UID;
    readonly estado?: ExerciseStatus;
    readonly publicado?: boolean;
    readonly activo?: boolean;
    readonly fechaDesde?: Date;
    readonly fechaHasta?: Date;
    readonly search?: string;
    readonly categoria?: string;
    readonly dificultad?: QuestionDifficulty;
    readonly tags?: string[];
}

export interface QuestionFilters {
    readonly esid?: ESID;
    readonly tipo?: QuestionType;
    readonly dificultad?: QuestionDifficulty;
    readonly activo?: boolean;
    readonly tags?: string[];
    readonly puntos?: number;
    readonly tiempoEstimado?: number;
}

export interface AttemptFilters {
    readonly esid?: ESID;
    readonly uid?: UID;
    readonly estado?: AttemptStatus;
    readonly fechaDesde?: Date;
    readonly fechaHasta?: Date;
    readonly puntajeMinimo?: number;
    readonly puntajeMaximo?: number;
}

// ============================================================================
// ESTADÍSTICAS Y ANALYTICS - DEFINITIVOS ABSOLUTOS
// ============================================================================

export interface ExerciseSetStats {
    readonly esid: ESID;
    readonly totalIntentos: number;
    readonly intentosCompletados: number;
    readonly promedioTiempo: number;
    readonly promedioPuntaje: number;
    readonly mediaPuntaje: number;
    readonly tasaComplecion: number;
    readonly tasaExito: number;                  // % con puntaje >= 70%
    readonly distribucionPuntajes: { rango: string; cantidad: number }[];
    readonly distribucionTiempos: { rango: string; cantidad: number }[];
    readonly preguntasMasDificiles: { nqid: NQID; porcentajeError: number }[];
    readonly preguntasMasFaciles: { nqid: NQID; porcentajeAcierto: number }[];
}

export interface QuestionStats {
    readonly nqid: NQID;
    readonly totalRespuestas: number;
    readonly porcentajeCorrectas: number;
    readonly tiempoPromedioRespuesta: number;
    readonly puntajePromedio: number;
    readonly dificultadCalculada: QuestionDifficulty;
    readonly respuestasComunes: { respuesta: string; frecuencia: number }[];
    readonly erroresComunes: { respuesta: string; frecuencia: number }[];
    readonly discriminacion: number;             // Item discrimination
    readonly fiabilidad: number;                 // Item reliability
}

export interface StudentStats {
    readonly uid: UID;
    readonly totalIntentos: number;
    readonly intentosCompletados: number;
    readonly promedioPuntaje: number;
    readonly mejorPuntaje: number;
    readonly tiempoPromedioTotal: number;
    readonly ejerciciosCompletados: ESID[];
    readonly ejerciciosEnProgreso: ESID[];
    readonly fortalezas: QuestionType[];
    readonly debilidades: QuestionType[];
    readonly progresion: { fecha: Date; puntaje: number }[];
}

export interface CourseStats {
    readonly cid: CID;
    readonly totalEstudiantes: number;
    readonly totalEjercicios: number;
    readonly totalIntentos: number;
    readonly promedioCurso: number;
    readonly tasaParticipacion: number;
    readonly distribucionCalificaciones: { rango: string; cantidad: number }[];
    readonly ejerciciosMasUsados: { esid: ESID; intentos: number }[];
    readonly estudiantesMasActivos: { uid: UID; intentos: number }[];
    readonly tiempoPromedioEjercicio: Record<ESID, number>;
}

// ============================================================================
// CONFIGURACIONES DEL SISTEMA - DEFINITIVAS ABSOLUTAS
// ============================================================================

export interface SystemConfig {
    readonly lti: {
        readonly version: string;
        readonly message_type: string;
        readonly privacy_level: LTIPrivacyLevel;
        readonly launch_url: string;
        readonly secure_launch_url: string;
        readonly icon_url: string;
        readonly consumer_keys: string[];
    };
    readonly grading: {
        readonly auto_send_grades: boolean;
        readonly grade_passback_timeout: number;
        readonly max_grade_passback_attempts: number;
        readonly default_max_score: number;
    };
    readonly security: {
        readonly session_timeout: number;
        readonly max_concurrent_sessions: number;
        readonly ip_whitelist?: string[];
        readonly require_https: boolean;
    };
    readonly features: {
        readonly enable_analytics: boolean;
        readonly enable_proctoring: boolean;
        readonly enable_plagiarism_detection: boolean;
        readonly enable_adaptive_learning: boolean;
    };
}

// ============================================================================
// EVENTOS Y WEBHOOKS - DEFINITIVOS ABSOLUTOS
// ============================================================================

export interface WebhookEvent {
    readonly id: string;
    readonly type: 'attempt.started' | 'attempt.completed' | 'grade.sent' | 'session.expired';
    readonly source: 'exercise_composer';
    readonly timestamp: Date;
    readonly data: Record<string, any>;
    readonly version: string;
}

export interface AuditLog {
    readonly id: string;
    readonly uid?: UID;
    readonly action: string;
    readonly resource: string;
    readonly resourceId: string;
    readonly details: Record<string, any>;
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly timestamp: Date;
}

// ============================================================================
// TIPOS DE INTEGRACIÓN - DEFINITIVOS ABSOLUTOS
// ============================================================================

export interface CanvasIntegration {
    readonly course_id: string;
    readonly assignment_id?: string;
    readonly points_possible: number;
    readonly grading_type: 'pass_fail' | 'percent' | 'letter_grade' | 'gpa_scale' | 'points';
    readonly submission_types: string[];
    readonly allowed_extensions?: string[];
    readonly external_tool_tag_attributes: {
        readonly url: string;
        readonly new_tab: boolean;
        readonly resource_link_id: string;
    };
}

export interface BlackboardIntegration {
    readonly course_id: string;
    readonly gradebook_column_id?: string;
    readonly points_possible: number;
    readonly grading_schema: string;
    readonly content_id: string;
}

export interface MoodleIntegration {
    readonly course_id: string;
    readonly grade_item_id?: string;
    readonly grade_max: number;
    readonly grade_min: number;
    readonly activity_id: string;
    readonly module_id: string;
}