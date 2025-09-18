// ============================================================================
// MODELO EXERCISE SET - HÍBRIDO (Tu estructura + Mejoras LTI)
// ============================================================================

import { Schema, Types, model } from 'mongoose';

// ============================================================================
// INTERFACE - SIGUIENDO TU ESTRUCTURA
// ============================================================================

interface ExerciseSet {
    esid: Types.ObjectId;
    cid: Schema.Types.ObjectId;  // Curso ID (compatibilidad con tu sistema)
    uid: Schema.Types.ObjectId;  // Usuario (Instructor) ID
    titulo: string;
    descripcion: string;
    instrucciones?: string;
    preguntas: Schema.Types.ObjectId[];  // Referencias a NestedQuestion

    // Configuración (sub-schema simplificado)
    configuracion: {
        intentos: number;
        tiempo?: number;  // en minutos
        mostrarRespuestas: boolean;
        mostrarExplicaciones: boolean;
        navegacionLibre: boolean;
        autoguardado: boolean;
    };

    // LTI (sub-schema necesario para Canvas)
    lti: {
        courseId: string;
        resourceLinkId: string;
        contextId: string;
        maxScore: number;
        enviarACanvas: boolean;
    };

    // Estados simples (como tus modelos)
    estado: 'borrador' | 'publicado' | 'archivado';
    activo: boolean;
    publicado: boolean;

    // Fechas importantes
    fechaPublicacion?: Date;
    fechaVencimiento?: Date;
    fechaDisponible?: Date;
    fechaLimite?: Date;

    // Estadísticas básicas
    stats: {
        totalIntentos: number;
        promedioScore: number;
        tasaCompletacion: number;
    };
}

// ============================================================================
// SCHEMA - CON VALIDACIONES ROBUSTAS PERO SIMPLES
// ============================================================================

const ExerciseSetSchema = new Schema<ExerciseSet>({
    // Referencias a tu sistema existente
    cid: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        required: [true, 'El curso es obligatorio']
    },

    uid: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El instructor es obligatorio']
    },

    // Información básica
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },

    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },

    instrucciones: {
        type: String,
        trim: true,
        maxlength: [2000, 'Las instrucciones no pueden exceder 2000 caracteres']
    },

    // Preguntas (referencias simples como en tu estructura)
    preguntas: [{
        type: Schema.Types.ObjectId,
        ref: 'NestedQuestion'
    }],

    // Configuración (sub-schema simplificado)
    configuracion: {
        intentos: {
            type: Number,
            required: true,
            min: [1, 'Debe permitir al menos 1 intento'],
            default: 1
        },
        tiempo: {
            type: Number,
            min: [1, 'El tiempo debe ser mayor a 0']
        },
        mostrarRespuestas: {
            type: Boolean,
            default: false
        },
        mostrarExplicaciones: {
            type: Boolean,
            default: false
        },
        navegacionLibre: {
            type: Boolean,
            default: true
        },
        autoguardado: {
            type: Boolean,
            default: true
        }
    },

    // LTI (necesario para Canvas)
    lti: {
        courseId: {
            type: String,
            required: [true, 'El courseId de Canvas es obligatorio'],
            trim: true
        },
        resourceLinkId: {
            type: String,
            required: [true, 'El resourceLinkId es obligatorio'],
            trim: true
        },
        contextId: {
            type: String,
            required: [true, 'El contextId es obligatorio'],
            trim: true
        },
        maxScore: {
            type: Number,
            required: true,
            min: [0, 'La puntuación máxima no puede ser negativa'],
            default: 100
        },
        enviarACanvas: {
            type: Boolean,
            default: true
        }
    },

    // Estados (como en tus modelos)
    estado: {
        type: String,
        enum: ['borrador', 'publicado', 'archivado'],
        default: 'borrador'
    },

    activo: {
        type: Boolean,
        required: true,
        default: true
    },

    publicado: {
        type: Boolean,
        required: true,
        default: false
    },

    // Fechas
    fechaPublicacion: Date,
    fechaVencimiento: Date,
    fechaDisponible: {
        type: Date,
        default: Date.now
    },
    fechaLimite: Date,

    // Estadísticas básicas
    stats: {
        totalIntentos: {
            type: Number,
            default: 0,
            min: 0
        },
        promedioScore: {
            type: Number,
            default: 0,
            min: 0
        },
        tasaCompletacion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    }
}, {
    // Agregar timestamps (mejora) pero opcional
    timestamps: true,
    versionKey: false
});

// ============================================================================
// MÉTODO toJSON - SIGUIENDO TU CONVENCIÓN
// ============================================================================

ExerciseSetSchema.method('toJSON', function () {
    const { _id, ...object } = this.toObject();
    object.esid = _id;
    return object;
});

// ============================================================================
// ÍNDICES OPTIMIZADOS PARA LTI
// ============================================================================

ExerciseSetSchema.index({ uid: 1 });  // Por instructor
ExerciseSetSchema.index({ cid: 1 });  // Por curso
ExerciseSetSchema.index({ estado: 1, activo: 1 });  // Por estado
ExerciseSetSchema.index({ 'lti.courseId': 1, 'lti.resourceLinkId': 1 });  // Para LTI

// ============================================================================
// MÉTODOS ESTÁTICOS ÚTILES (Mejoras funcionales)
// ============================================================================

/**
 * Buscar por instructor (como tus otros modelos)
 */
ExerciseSetSchema.statics.findByInstructor = function (uid: string) {
    return this.find({ uid, activo: true }).sort({ createdAt: -1 });
};

/**
 * Buscar por curso (compatibilidad con tu sistema)
 */
ExerciseSetSchema.statics.findByCourse = function (cid: string) {
    return this.find({
        cid,
        activo: true,
        publicado: true
    }).sort({ createdAt: -1 });
};

/**
 * Buscar por LTI Resource Link (necesario para Canvas)
 */
ExerciseSetSchema.statics.findByLTI = function (resourceLinkId: string, courseId: string) {
    return this.findOne({
        'lti.resourceLinkId': resourceLinkId,
        'lti.courseId': courseId,
        activo: true
    });
};

// ============================================================================
// MÉTODOS DE INSTANCIA ÚTILES
// ============================================================================

/**
 * Verificar si está disponible
 */
ExerciseSetSchema.methods.estaDisponible = function (fecha: Date = new Date()) {
    if (!this.publicado || !this.activo) return false;
    if (this.fechaDisponible && fecha < this.fechaDisponible) return false;
    if (this.fechaLimite && fecha > this.fechaLimite) return false;
    return true;
};

/**
 * Publicar ejercicio
 */
ExerciseSetSchema.methods.publicar = function () {
    this.estado = 'publicado';
    this.publicado = true;
    this.fechaPublicacion = new Date();
    return this.save();
};

// ============================================================================
// MIDDLEWARE ÚTIL
// ============================================================================

/**
 * Pre-save: Validar fechas
 */
ExerciseSetSchema.pre('save', function () {
    if (this.fechaVencimiento && this.fechaDisponible &&
        this.fechaVencimiento <= this.fechaDisponible) {
        throw new Error('La fecha de vencimiento debe ser posterior a la fecha disponible');
    }
});

// ============================================================================
// EXPORTAR MODELO - SIGUIENDO TU CONVENCIÓN
// ============================================================================

export default model('ExerciseSet', ExerciseSetSchema);