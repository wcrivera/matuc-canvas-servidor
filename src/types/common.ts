// ============================================================================
// TIPOS COMUNES - MATUC LTI EXERCISE COMPOSER
// ============================================================================

import { Document } from 'mongoose';

/**
 * Tipos base para respuestas API
 */
export interface ApiResponse<T = any> {
    ok: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp: string;
}

/**
 * Tipos base para documentos MongoDB
 */
export interface BaseDocument extends Document {
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

/**
 * Tipos para identificadores
 */
export type ObjectId = string;
export type MongoObjectId = import('mongoose').Types.ObjectId;

/**
 * Tipos para configuración LTI
 */
export interface LTIContext {
    courseId: string;
    resourceLinkId: string;
    contextId: string;
    userId: string;
    userRole: 'Instructor' | 'Student' | 'TeachingAssistant';
}

/**
 * Tipos para configuración de ejercicios
 */
export interface ExerciseSettings {
    timeLimit?: number; // en minutos
    attemptsAllowed: number;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
    randomizeQuestions: boolean;
    allowNavigationBack: boolean;
    autoSave: boolean;
}

/**
 * Estados posibles para ejercicios y intentos
 */
export type ExerciseStatus = 'draft' | 'published' | 'archived';
export type AttemptStatus = 'in_progress' | 'completed' | 'submitted' | 'graded';

/**
 * Tipos para calificaciones
 */
export interface GradingInfo {
    score: number;
    maxScore: number;
    percentage: number;
    isGraded: boolean;
    gradedAt?: Date;
    gradedBy?: ObjectId;
}

/**
 * Tipos para validación de respuestas
 */
export interface ValidationResult {
    isCorrect: boolean;
    score: number;
    maxScore: number;
    feedback?: string;
    explanation?: string;
    hint?: string;
}

/**
 * Tipos para metadatos
 */
export interface CreationMetadata {
    createdBy: ObjectId;
    createdAt: Date;
    lastModifiedBy: ObjectId;
    lastModifiedAt: Date;
}