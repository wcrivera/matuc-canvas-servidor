// ============================================================================
// MODELO QUESTION RESPONSE - MINIMALISTA
// ============================================================================

import { Schema, Types, model } from 'mongoose';

interface QuestionResponse {
    qrid: Types.ObjectId;
    nqid: Schema.Types.ObjectId;  // Nested Question ID
    said: Schema.Types.ObjectId;  // Student Attempt ID
    uid: Schema.Types.ObjectId;   // Usuario (Estudiante) ID

    respuestaEstudiante: any;
    fechaRespuesta: Date;

    validacion: {
        esCorrecta: boolean;
        puntaje: number;
        puntajeMaximo: number;
        feedback?: string;
    };

    tiempoGastado: number;
    estado: 'pendiente' | 'calificada';
    activo: boolean;
}

const QuestionResponseSchema = new Schema<QuestionResponse>({
    nqid: {
        type: Schema.Types.ObjectId,
        ref: 'NestedQuestion',
        required: true
    },

    said: {
        type: Schema.Types.ObjectId,
        ref: 'StudentAttempt',
        required: true
    },

    uid: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    respuestaEstudiante: {
        type: Schema.Types.Mixed,
        required: true
    },

    fechaRespuesta: {
        type: Date,
        required: true,
        default: Date.now
    },

    validacion: {
        esCorrecta: {
            type: Boolean,
            required: true,
            default: false
        },
        puntaje: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        puntajeMaximo: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        feedback: {
            type: String,
            trim: true
        }
    },

    tiempoGastado: {
        type: Number,
        min: 0,
        default: 0
    },

    estado: {
        type: String,
        enum: ['pendiente', 'calificada'],
        default: 'pendiente'
    },

    activo: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Método toJSON siguiendo tu convención
QuestionResponseSchema.method('toJSON', function () {
    const { _id, ...object } = this.toObject();
    object.qrid = _id;
    return object;
});

// Índices básicos
QuestionResponseSchema.index({ nqid: 1, uid: 1 });
QuestionResponseSchema.index({ said: 1 });

// Índice único para evitar respuestas duplicadas
QuestionResponseSchema.index(
    { nqid: 1, said: 1 },
    { unique: true }
);

export default model('QuestionResponse', QuestionResponseSchema);