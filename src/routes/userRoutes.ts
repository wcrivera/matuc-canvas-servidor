// ============================================================================
// USER ROUTES - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/routes/userRoutes.ts
// Propósito: Rutas para gestión de usuarios

import { Router } from 'express';
import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorUID,
    actualizarUsuario,
    eliminarUsuario,
    crearAdminPorDefecto,
    obtenerEstadisticasUsuarios
} from '../controllers';

const router = Router();

// ============================================================================
// RUTAS PRINCIPALES DE USUARIOS
// ============================================================================

/**
 * @route   POST /api/users
 * @desc    Crear nuevo usuario
 * @access  Public (temporal, agregar auth después)
 * @body    { email, nombre, apellido, rol?, uid?, canvasUserId?, ltiUserId? }
 */
router.post('/', crearUsuario);

/**
 * @route   GET /api/users
 * @desc    Obtener usuarios con filtros y paginación
 * @access  Public (temporal, agregar auth después)
 * @query   ?page=1&limit=10&rol=student&activo=true&search=juan
 */
router.get('/', obtenerUsuarios);

/**
 * @route   GET /api/users/:uid
 * @desc    Obtener usuario por UID
 * @access  Public (temporal, agregar auth después)
 * @params  uid - UID del usuario
 */
router.get('/:uid', obtenerUsuarioPorUID);

/**
 * @route   PUT /api/users/:uid
 * @desc    Actualizar usuario
 * @access  Public (temporal, agregar auth después)
 * @params  uid - UID del usuario
 * @body    { email?, nombre?, apellido?, rol?, canvasUserId?, ltiUserId?, activo? }
 */
router.put('/:uid', actualizarUsuario);

/**
 * @route   DELETE /api/users/:uid
 * @desc    Eliminar usuario (soft delete)
 * @access  Public (temporal, agregar auth después)
 * @params  uid - UID del usuario
 */
router.delete('/:uid', eliminarUsuario);

// ============================================================================
// RUTAS ESPECIALES
// ============================================================================

/**
 * @route   POST /api/users/init-admin
 * @desc    Crear administrador por defecto si no existe
 * @access  Public (temporal, agregar auth después)
 */
router.post('/init-admin', crearAdminPorDefecto);

/**
 * @route   GET /api/users/stats
 * @desc    Obtener estadísticas de usuarios
 * @access  Public (temporal, agregar auth después)
 */
router.get('/stats', obtenerEstadisticasUsuarios);

export default router;