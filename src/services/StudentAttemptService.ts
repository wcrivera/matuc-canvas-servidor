// ============================================================================
// STUDENT ATTEMPT SERVICE - MINIMALISTA CON TIPOS CORRECTOS
// ============================================================================

import StudentAttempt from '../models/StudentAttempt';

// ============================================================================
// INTERFACES DE RESPUESTA
// ============================================================================

interface ServiceResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// SERVICIO STUDENT ATTEMPT
// ============================================================================

export class StudentAttemptService {
  
  /**
   * Iniciar nuevo intento
   */
  static async iniciarIntento(data: any): Promise<ServiceResponse> {
    try {
      const attempt = new StudentAttempt(data);
      await attempt.save();
      return { ok: true, data: attempt };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Obtener intento actual
   */
  static async obtenerIntentoActual(uid: string, esid: string): Promise<ServiceResponse> {
    try {
      const attempt = await StudentAttempt.findOne({
        uid,
        esid,
        estado: 'en_progreso',
        activo: true
      });
      return { ok: true, data: attempt };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Obtener intentos por estudiante
   */
  static async obtenerPorEstudiante(uid: string, esid?: string): Promise<ServiceResponse> {
    try {
      const query: any = { uid, activo: true };
      if (esid) query.esid = esid;
      
      const attempts = await StudentAttempt.find(query).sort({ fechaInicio: -1 });
      return { ok: true, data: attempts };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Completar intento
   */
  static async completarIntento(said: string): Promise<ServiceResponse> {
    try {
      const attempt = await StudentAttempt.findByIdAndUpdate(
        said,
        { 
          estado: 'completado',
          fechaEnvio: new Date()
        },
        { new: true }
      );
      return { ok: true, data: attempt };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  /**
   * Actualizar calificación
   */
  static async actualizarCalificacion(said: string, calificacion: any): Promise<ServiceResponse> {
    try {
      const attempt = await StudentAttempt.findByIdAndUpdate(
        said,
        { calificacion },
        { new: true }
      );
      return { ok: true, data: attempt };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}