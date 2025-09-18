// // ============================================================================
// // EXERCISE SET SERVICE - MINIMALISTA CON TIPOS CORRECTOS
// // ============================================================================

// import ExerciseSet from '../models/ExerciseSet';

// // ============================================================================
// // INTERFACES DE RESPUESTA
// // ============================================================================

// interface ServiceResponse<T = any> {
//   ok: boolean;
//   data?: T;
//   error?: string;
// }

// // ============================================================================
// // SERVICIO EXERCISE SET
// // ============================================================================

// export class ExerciseSetService {

//   /**
//    * Crear Exercise Set
//    */
//   static async crear(data: any): Promise<ServiceResponse> {
//     console.log(data)
//     try {
//       const exerciseSet = new ExerciseSet(data);
//       await exerciseSet.save();
//       return { ok: true, data: exerciseSet };
//     } catch (error) {
//       return { ok: false, error: (error as Error).message };
//     }
//   }

//   /**
//    * Obtener por ID
//    */
//   static async obtenerPorId(esid: string): Promise<ServiceResponse> {
//     try {
//       const exerciseSet = await ExerciseSet.findById(esid);
//       return { ok: true, data: exerciseSet };
//     } catch (error) {
//       return { ok: false, error: (error as Error).message };
//     }
//   }

//   /**
//    * Obtener por instructor
//    */
//   static async obtenerPorInstructor(uid: string): Promise<ServiceResponse> {
//     try {
//       const exerciseSets = await ExerciseSet.find({ uid, activo: true });
//       return { ok: true, data: exerciseSets };
//     } catch (error) {
//       return { ok: false, error: (error as Error).message };
//     }
//   }

//   /**
//    * Actualizar Exercise Set
//    */
//   static async actualizar(esid: string, data: any): Promise<ServiceResponse> {
//     try {
//       const exerciseSet = await ExerciseSet.findByIdAndUpdate(esid, data, { new: true });
//       return { ok: true, data: exerciseSet };
//     } catch (error) {
//       return { ok: false, error: (error as Error).message };
//     }
//   }

//   /**
//    * Eliminar (desactivar)
//    */
//   static async eliminar(esid: string): Promise<ServiceResponse> {
//     try {
//       await ExerciseSet.findByIdAndUpdate(esid, { activo: false });
//       return { ok: true };
//     } catch (error) {
//       return { ok: false, error: (error as Error).message };
//     }
//   }
// }