// ============================================================================
// MODELO STUDENT ATTEMPT - MINIMALISTA
// ============================================================================

import { Schema, Types, model } from 'mongoose';

interface StudentAttempt {
  said: Types.ObjectId;
  esid: Schema.Types.ObjectId;  // Exercise Set ID
  uid: Schema.Types.ObjectId;   // Usuario (Estudiante) ID
  numeroIntento: number;
  estado: 'en_progreso' | 'completado' | 'enviado';
  
  fechaInicio: Date;
  fechaEnvio?: Date;
  tiempoTotal: number;
  
  calificacion: {
    puntaje: number;
    puntajeMaximo: number;
    porcentaje: number;
  };
  
  lti: {
    courseId: string;
    userId: string;
    userRole: string;
  };
  
  activo: boolean;
}

const StudentAttemptSchema = new Schema<StudentAttempt>({
  esid: {
    type: Schema.Types.ObjectId,
    ref: 'ExerciseSet',
    required: true
  },
  
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  
  numeroIntento: {
    type: Number,
    required: true,
    min: 1
  },
  
  estado: {
    type: String,
    enum: ['en_progreso', 'completado', 'enviado'],
    default: 'en_progreso'
  },
  
  fechaInicio: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  fechaEnvio: Date,
  
  tiempoTotal: {
    type: Number,
    min: 0,
    default: 0
  },
  
  calificacion: {
    puntaje: {
      type: Number,
      min: 0,
      default: 0
    },
    puntajeMaximo: {
      type: Number,
      min: 0,
      default: 0
    },
    porcentaje: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  
  lti: {
    courseId: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: String,
      required: true,
      trim: true
    },
    userRole: {
      type: String,
      required: true,
      trim: true
    }
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
StudentAttemptSchema.method('toJSON', function() {
  const { _id, ...object } = this.toObject();
  object.said = _id;
  return object;
});

// Índices básicos
StudentAttemptSchema.index({ esid: 1, uid: 1 });
StudentAttemptSchema.index({ uid: 1, estado: 1 });

// Índice único para evitar intentos duplicados
StudentAttemptSchema.index(
  { esid: 1, uid: 1, numeroIntento: 1 },
  { unique: true }
);

export default model('StudentAttempt', StudentAttemptSchema);