// ============================================================================
// QUESTION RESPONSE SERVICE - MINIMALISTA CON TIPOS CORRECTOS
// ============================================================================

import QuestionResponse from '../models/QuestionResponse';
import NestedQuestion from '../models/NestedQuestion';

// ============================================================================
// INTERFACES DE RESPUESTA
// ============================================================================

interface ServiceResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// SERVICIO QUESTION RESPONSE
// ============================================================================

export class QuestionResponseService {
  
  /**
   * Crear respuesta
   */
  static async crear(data: any): Promise<ServiceResponse> {
    try {
      const response = new QuestionResponse(data);
      await response.save();
      return { ok: true, data: response };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Validar respuesta automáticamente
   */
  static async validarRespuesta(nqid: string, respuestaEstudiante: any): Promise<ServiceResponse> {
    try {
      const question = await NestedQuestion.findById(nqid);
      if (!question) {
        return { ok: false, error: 'Pregunta no encontrada' };
      }

      // Validación simple por tipo
      let esCorrecta = false;
      
      switch (question.tipo) {
        case 'multiple':
          esCorrecta = respuestaEstudiante === question.respuestaCorrecta;
          break;
        case 'verdadero_falso':
          esCorrecta = respuestaEstudiante === question.respuestaCorrecta;
          break;
        case 'numerico':
          const tolerancia = question.config.tolerancia || 0;
          const diff = Math.abs(parseFloat(respuestaEstudiante) - parseFloat(question.respuestaCorrecta));
          esCorrecta = diff <= tolerancia;
          break;
        case 'texto_corto':
          const caseSensitive = question.config.caseSensitive || false;
          const respuesta = caseSensitive ? respuestaEstudiante : respuestaEstudiante.toLowerCase();
          const correcta = caseSensitive ? question.respuestaCorrecta : question.respuestaCorrecta.toLowerCase();
          esCorrecta = respuesta === correcta;
          break;
        default:
          esCorrecta = respuestaEstudiante === question.respuestaCorrecta;
      }

      const validacion = {
        esCorrecta,
        puntaje: esCorrecta ? question.puntos : 0,
        puntajeMaximo: question.puntos,
        feedback: esCorrecta ? question.feedback.correcto : question.feedback.incorrecto
      };

      return { ok: true, data: validacion };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Obtener respuestas por intento
   */
  static async obtenerPorIntento(said: string): Promise<ServiceResponse> {
    try {
      const responses = await QuestionResponse.find({ 
        said, 
        activo: true 
      }).sort({ fechaRespuesta: 1 });
      return { ok: true, data: responses };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Actualizar respuesta
   */
  static async actualizar(qrid: string, data: any): Promise<ServiceResponse> {
    try {
      const response = await QuestionResponse.findByIdAndUpdate(qrid, data, { new: true });
      return { ok: true, data: response };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}