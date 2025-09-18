// ============================================================================
// MODELO NESTED QUESTION - HÍBRIDO (Tu estructura + Mejoras LTI)
// ============================================================================

import { Schema, Types, model } from 'mongoose';

// ============================================================================
// INTERFACE - SIGUIENDO TU ESTRUCTURA
// ============================================================================

interface NestedQuestion {
  nqid: Types.ObjectId;  // Nested Question ID
  esid: Schema.Types.ObjectId;  // Exercise Set ID
  titulo: string;
  enunciado: string;
  tipo: 'multiple' | 'verdadero_falso' | 'texto_corto' | 'numerico' | 'matematica';
  orden: number;
  
  // Configuración por tipo (simplificado)
  config: {
    opciones?: string[];  // Para múltiple
    correctas?: number[];  // Índices correctos
    tolerancia?: number;  // Para numérico
    caseSensitive?: boolean;  // Para texto
    respuestasAceptadas?: string[];  // Alternativas válidas
  };
  
  // Respuesta correcta (flexible)
  respuestaCorrecta: any;
  
  // Feedback (simplificado)
  feedback: {
    correcto: string;
    incorrecto: string;
    explicacion?: string;
    pista?: string;
  };
  
  // Calificación
  puntos: number;
  
  // Metadatos simples
  dificultad: 'facil' | 'medio' | 'dificil';
  tiempoEstimado: number;  // en minutos
  tags: string[];
  
  // Estados (como tus modelos)
  activo: boolean;
}

// ============================================================================
// SCHEMA - VALIDACIONES ROBUSTAS PERO SIMPLES
// ============================================================================

const NestedQuestionSchema = new Schema<NestedQuestion>({
  // Referencia al Exercise Set
  esid: {
    type: Schema.Types.ObjectId,
    ref: 'ExerciseSet',
    required: [true, 'El Exercise Set es obligatorio']
  },
  
  // Información básica
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  
  enunciado: {
    type: String,
    required: [true, 'El enunciado es obligatorio'],
    trim: true,
    maxlength: [2000, 'El enunciado no puede exceder 2000 caracteres']
  },
  
  tipo: {
    type: String,
    required: [true, 'El tipo de pregunta es obligatorio'],
    enum: {
      values: ['multiple', 'verdadero_falso', 'texto_corto', 'numerico', 'matematica'],
      message: 'Tipo de pregunta no válido'
    }
  },
  
  orden: {
    type: Number,
    required: [true, 'El orden es obligatorio'],
    min: [1, 'El orden debe ser mayor a 0']
  },
  
  // Configuración por tipo (sub-schema simplificado)
  config: {
    opciones: [String],  // Para multiple choice
    correctas: [Number],  // Índices de opciones correctas
    tolerancia: {
      type: Number,
      min: [0, 'La tolerancia no puede ser negativa']
    },
    caseSensitive: {
      type: Boolean,
      default: false
    },
    respuestasAceptadas: [String]
  },
  
  // Respuesta correcta (flexible como Schema.Types.Mixed)
  respuestaCorrecta: {
    type: Schema.Types.Mixed,
    required: [true, 'La respuesta correcta es obligatoria']
  },
  
  // Feedback (sub-schema simplificado)
  feedback: {
    correcto: {
      type: String,
      required: [true, 'El feedback correcto es obligatorio'],
      trim: true
    },
    incorrecto: {
      type: String,
      required: [true, 'El feedback incorrecto es obligatorio'],
      trim: true
    },
    explicacion: {
      type: String,
      trim: true
    },
    pista: {
      type: String,
      trim: true
    }
  },
  
  // Calificación
  puntos: {
    type: Number,
    required: [true, 'Los puntos son obligatorios'],
    min: [0, 'Los puntos no pueden ser negativos'],
    default: 1
  },
  
  // Metadatos
  dificultad: {
    type: String,
    enum: ['facil', 'medio', 'dificil'],
    default: 'medio'
  },
  
  tiempoEstimado: {
    type: Number,
    min: [1, 'El tiempo estimado debe ser mayor a 0'],
    default: 2
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Estado (como tus modelos)
  activo: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true,  // Mejora: timestamps automáticos
  versionKey: false
});

// ============================================================================
// MÉTODO toJSON - SIGUIENDO TU CONVENCIÓN
// ============================================================================

NestedQuestionSchema.method('toJSON', function() {
  const { _id, ...object } = this.toObject();
  object.nqid = _id;
  return object;
});

// ============================================================================
// ÍNDICES OPTIMIZADOS
// ============================================================================

NestedQuestionSchema.index({ esid: 1, orden: 1 });  // Por exercise set y orden
NestedQuestionSchema.index({ tipo: 1 });  // Por tipo
NestedQuestionSchema.index({ dificultad: 1 });  // Por dificultad
NestedQuestionSchema.index({ activo: 1 });  // Por estado

// ============================================================================
// MÉTODOS ESTÁTICOS ÚTILES (Mejoras funcionales)
// ============================================================================

/**
 * Buscar preguntas de un Exercise Set ordenadas
 */
NestedQuestionSchema.statics.findByExerciseSet = function(esid: string) {
  return this.find({ esid, activo: true }).sort({ orden: 1 });
};

/**
 * Buscar siguiente pregunta
 */
NestedQuestionSchema.statics.findSiguiente = function(esid: string, ordenActual: number) {
  return this.findOne({
    esid,
    orden: { $gt: ordenActual },
    activo: true
  }).sort({ orden: 1 });
};

/**
 * Buscar pregunta anterior
 */
NestedQuestionSchema.statics.findAnterior = function(esid: string, ordenActual: number) {
  return this.findOne({
    esid,
    orden: { $lt: ordenActual },
    activo: true
  }).sort({ orden: -1 });
};

// ============================================================================
// MÉTODOS DE INSTANCIA ÚTILES
// ============================================================================

/**
 * Validar respuesta del estudiante (método simple pero robusto)
 */
NestedQuestionSchema.methods.validarRespuesta = function(respuestaEstudiante: any): boolean {
  const correcta = this.respuestaCorrecta;
  const tolerancia = this.config.tolerancia || 0;
  
  switch (this.tipo) {
    case 'multiple':
      if (Array.isArray(correcta)) {
        return JSON.stringify(respuestaEstudiante.sort()) === JSON.stringify(correcta.sort());
      }
      return respuestaEstudiante === correcta;
      
    case 'verdadero_falso':
      return respuestaEstudiante === correcta;
      
    case 'numerico':
      const numRespuesta = parseFloat(respuestaEstudiante);
      const numCorrecta = parseFloat(correcta);
      return Math.abs(numRespuesta - numCorrecta) <= tolerancia;
      
    case 'texto_corto':
      const caseSensitive = this.config.caseSensitive || false;
      const textoEstudiante = caseSensitive ? respuestaEstudiante : respuestaEstudiante.toLowerCase();
      const textoCorrect = caseSensitive ? correcta : correcta.toLowerCase();
      
      // Verificar respuestas alternativas
      if (this.config.respuestasAceptadas) {
        return this.config.respuestasAceptadas.some((aceptada: string) => {
          const textoAceptado = caseSensitive ? aceptada : aceptada.toLowerCase();
          return textoEstudiante === textoAceptado;
        });
      }
      
      return textoEstudiante === textoCorrect;
      
    default:
      return respuestaEstudiante === correcta;
  }
};

/**
 * Obtener puntuación
 */
NestedQuestionSchema.methods.obtenerPuntos = function(esCorrecta: boolean): number {
  return esCorrecta ? this.puntos : 0;
};

/**
 * Obtener feedback apropiado
 */
NestedQuestionSchema.methods.obtenerFeedback = function(esCorrecta: boolean): string {
  return esCorrecta ? this.feedback.correcto : this.feedback.incorrecto;
};

// ============================================================================
// MIDDLEWARE DE VALIDACIÓN
// ============================================================================

/**
 * Pre-save: Validaciones específicas por tipo
 */
NestedQuestionSchema.pre('save', function() {
  switch (this.tipo) {
    case 'multiple':
      if (!this.config.opciones || this.config.opciones.length < 2) {
        throw new Error('Las preguntas múltiples deben tener al menos 2 opciones');
      }
      break;
      
    case 'numerico':
      if (typeof this.respuestaCorrecta !== 'number') {
        throw new Error('La respuesta correcta para preguntas numéricas debe ser un número');
      }
      break;
  }
});

// ============================================================================
// EXPORTAR MODELO - SIGUIENDO TU CONVENCIÓN
// ============================================================================

export default model('NestedQuestion', NestedQuestionSchema);