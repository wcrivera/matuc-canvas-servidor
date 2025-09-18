// ============================================================================
// NESTED QUESTION SERVICE - MINIMALISTA CON TIPOS CORRECTOS
// ============================================================================

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
// SERVICIO NESTED QUESTION
// ============================================================================

export class NestedQuestionService {
  
  /**
   * Crear pregunta
   */
  static async crear(data: any): Promise<ServiceResponse> {
    try {
      const question = new NestedQuestion(data);
      await question.save();
      return { ok: true, data: question };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Obtener preguntas por Exercise Set
   */
  static async obtenerPorEjercicio(esid: string): Promise<ServiceResponse> {
    try {
      const questions = await NestedQuestion.find({ 
        esid, 
        activo: true 
      }).sort({ orden: 1 });
      return { ok: true, data: questions };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Obtener pregunta por ID
   */
  static async obtenerPorId(nqid: string): Promise<ServiceResponse> {
    try {
      const question = await NestedQuestion.findById(nqid);
      return { ok: true, data: question };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Actualizar pregunta
   */
  static async actualizar(nqid: string, data: any): Promise<ServiceResponse> {
    try {
      const question = await NestedQuestion.findByIdAndUpdate(nqid, data, { new: true });
      return { ok: true, data: question };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Eliminar pregunta
   */
  static async eliminar(nqid: string): Promise<ServiceResponse> {
    try {
      await NestedQuestion.findByIdAndUpdate(nqid, { activo: false });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}