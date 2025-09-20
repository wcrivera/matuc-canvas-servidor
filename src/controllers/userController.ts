// ============================================================================
// USER CONTROLLER - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/controllers/userController.ts
// Propósito: Controlador CRUD para usuarios usando solo tipos shared

import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import {
    ApiResponse,
    BaseUser,
    PaginatedResponse,
    ValidationError,
    UserRole,
    ID
} from '../types/shared';

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

const documentToBaseUser = (doc: IUser): BaseUser => {
    const baseUser: BaseUser = {
        id: doc._id.toString(),     // MongoDB _id convertido a string
        email: doc.email,
        nombre: doc.nombre,
        apellido: doc.apellido,
        rol: doc.rol,
        activo: doc.activo,
        fechaCreacion: doc.fechaCreacion,
        fechaActualizacion: doc.fechaActualizacion,
        ...(doc.canvasUserId && { canvasUserId: doc.canvasUserId }),
        ...(doc.ltiUserId && { ltiUserId: doc.ltiUserId })
    };

    return baseUser;
};

const validateUserData = (data: Partial<BaseUser>): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (data.email !== undefined) {
        if (!data.email || data.email.trim().length === 0) {
            errors.push({ field: 'email', message: 'Email es requerido' });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push({ field: 'email', message: 'Email debe tener formato válido' });
        }
    }

    if (data.nombre !== undefined) {
        if (!data.nombre || data.nombre.trim().length === 0) {
            errors.push({ field: 'nombre', message: 'Nombre es requerido' });
        } else if (data.nombre.length < 2) {
            errors.push({ field: 'nombre', message: 'Nombre debe tener al menos 2 caracteres' });
        }
    }

    if (data.apellido !== undefined) {
        if (!data.apellido || data.apellido.trim().length === 0) {
            errors.push({ field: 'apellido', message: 'Apellido es requerido' });
        } else if (data.apellido.length < 2) {
            errors.push({ field: 'apellido', message: 'Apellido debe tener al menos 2 caracteres' });
        }
    }

    if (data.rol && !['instructor', 'student', 'admin'].includes(data.rol)) {
        errors.push({ field: 'rol', message: 'Rol debe ser: instructor, student o admin' });
    }

    return errors;
};

// ============================================================================
// CONTROLADORES
// ============================================================================

export const crearUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userData = req.body as Partial<BaseUser> & { canvasUserId?: string; ltiUserId?: string };

        // Crear objeto con campos requeridos sin undefined
        const fieldsToValidate: Record<string, string | undefined> = {};
        if (userData.email !== undefined) fieldsToValidate.email = userData.email;
        if (userData.nombre !== undefined) fieldsToValidate.nombre = userData.nombre;
        if (userData.apellido !== undefined) fieldsToValidate.apellido = userData.apellido;

        const validationErrors = validateUserData(fieldsToValidate as Partial<BaseUser>);

        // Verificar que los campos requeridos estén presentes
        if (!userData.email || !userData.nombre || !userData.apellido) {
            validationErrors.push({ field: 'required', message: 'Email, nombre y apellido son requeridos' });
        }

        if (validationErrors.length > 0) {
            const response: ApiResponse<ValidationError[]> = {
                ok: false,
                message: 'Errores de validación',
                data: validationErrors
            };
            return res.status(400).json(response);
        }

        const existingUser = await User.findOne({ email: userData.email!.toLowerCase().trim() });
        if (existingUser) {
            const response: ApiResponse = {
                ok: false,
                message: 'Email ya está registrado',
                error: 'EMAIL_EXISTS'
            };
            return res.status(409).json(response);
        }

        const nuevoUsuario = new User({
            email: userData.email!.toLowerCase().trim(),
            nombre: userData.nombre!.trim(),
            apellido: userData.apellido!.trim(),
            rol: userData.rol || 'student',
            canvasUserId: userData.canvasUserId?.trim(),
            ltiUserId: userData.ltiUserId?.trim(),
            activo: true
        });

        const usuarioGuardado = await nuevoUsuario.save();

        const response: ApiResponse<BaseUser> = {
            ok: true,
            message: 'Usuario creado exitosamente',
            data: documentToBaseUser(usuarioGuardado)
        };

        return res.status(201).json(response);

    } catch (error) {
        console.error('Error en crearUsuario:', error);

        if (error instanceof Error) {
            if (error.message.includes('E11000')) {
                const response: ApiResponse = {
                    ok: false,
                    message: 'Ya existe un usuario con esos datos',
                    error: 'DUPLICATE_KEY'
                };
                return res.status(409).json(response);
            }

            if (error.name === 'ValidationError') {
                const response: ApiResponse = {
                    ok: false,
                    message: 'Error de validación',
                    error: error.message
                };
                return res.status(400).json(response);
            }
        }

        const response: ApiResponse = {
            ok: false,
            message: 'Error interno del servidor',
            error: 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};

export const obtenerUsuarios = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
        const rol = req.query.rol as UserRole;
        const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;
        const search = req.query.search as string;

        const query: any = {};

        if (rol) query.rol = rol;
        if (activo !== undefined) query.activo = activo;

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { nombre: searchRegex },
                { apellido: searchRegex },
                { email: searchRegex },
                { uid: searchRegex }
            ];
        }

        const skip = (page - 1) * limit;

        const [usuarios, totalItems] = await Promise.all([
            User.find(query)
                .sort({ fechaCreacion: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        const response: ApiResponse<PaginatedResponse<BaseUser>> = {
            ok: true,
            message: 'Usuarios obtenidos exitosamente',
            data: {
                items: usuarios.map(user => documentToBaseUser(user as IUser)),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en obtenerUsuarios:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener usuarios',
            error: error instanceof Error ? error.message : 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};

export const obtenerUsuarioPorUID = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || id.trim().length === 0) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID es requerido'
            };
            return res.status(400).json(response);
        }

        const usuario = await User.findById(id.trim()).where({ activo: true });

        if (!usuario) {
            const response: ApiResponse = {
                ok: false,
                message: 'Usuario no encontrado'
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse<BaseUser> = {
            ok: true,
            message: 'Usuario encontrado',
            data: documentToBaseUser(usuario)
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en obtenerUsuarioPorUID:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener usuario',
            error: error instanceof Error ? error.message : 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};

export const actualizarUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updateData = req.body as Partial<BaseUser> & { canvasUserId?: string; ltiUserId?: string };

        if (!id || id.trim().length === 0) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID es requerido'
            };
            return res.status(400).json(response);
        }

        const validationErrors = validateUserData(updateData);
        if (validationErrors.length > 0) {
            const response: ApiResponse<ValidationError[]> = {
                ok: false,
                message: 'Errores de validación',
                data: validationErrors
            };
            return res.status(400).json(response);
        }

        const updateFields: any = {};
        if (updateData.email) updateFields.email = updateData.email.toLowerCase().trim();
        if (updateData.nombre) updateFields.nombre = updateData.nombre.trim();
        if (updateData.apellido) updateFields.apellido = updateData.apellido.trim();
        if (updateData.rol) updateFields.rol = updateData.rol;
        if (updateData.canvasUserId !== undefined) updateFields.canvasUserId = updateData.canvasUserId?.trim();
        if (updateData.ltiUserId !== undefined) updateFields.ltiUserId = updateData.ltiUserId?.trim();
        if (updateData.activo !== undefined) updateFields.activo = updateData.activo;

        const usuarioActualizado = await User.findByIdAndUpdate(
            id.trim(),
            updateFields,
            {
                new: true,
                runValidators: true
            }
        );

        if (!usuarioActualizado) {
            const response: ApiResponse = {
                ok: false,
                message: 'Usuario no encontrado'
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse<BaseUser> = {
            ok: true,
            message: 'Usuario actualizado exitosamente',
            data: documentToBaseUser(usuarioActualizado)
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en actualizarUsuario:', error);

        if (error instanceof Error) {
            if (error.message.includes('E11000')) {
                const response: ApiResponse = {
                    ok: false,
                    message: 'Email ya está en uso por otro usuario',
                    error: 'EMAIL_EXISTS'
                };
                return res.status(409).json(response);
            }

            if (error.message.includes('último administrador')) {
                const response: ApiResponse = {
                    ok: false,
                    message: error.message,
                    error: 'LAST_ADMIN_PROTECTION'
                };
                return res.status(400).json(response);
            }

            if (error.name === 'ValidationError') {
                const response: ApiResponse = {
                    ok: false,
                    message: 'Error de validación',
                    error: error.message
                };
                return res.status(400).json(response);
            }
        }

        const response: ApiResponse = {
            ok: false,
            message: 'Error al actualizar usuario',
            error: 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};

export const eliminarUsuario = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        if (!id || id.trim().length === 0) {
            const response: ApiResponse = {
                ok: false,
                message: 'ID es requerido'
            };
            return res.status(400).json(response);
        }

        const usuarioEliminado = await User.findByIdAndUpdate(
            id.trim(),
            { activo: false },
            { new: true }
        );

        if (!usuarioEliminado) {
            const response: ApiResponse = {
                ok: false,
                message: 'Usuario no encontrado'
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse = {
            ok: true,
            message: 'Usuario eliminado exitosamente'
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en eliminarUsuario:', error);

        if (error instanceof Error && error.message.includes('último administrador')) {
            const response: ApiResponse = {
                ok: false,
                message: error.message,
                error: 'LAST_ADMIN_PROTECTION'
            };
            return res.status(400).json(response);
        }

        const response: ApiResponse = {
            ok: false,
            message: 'Error al eliminar usuario',
            error: 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};

export const crearAdminPorDefecto = async (req: Request, res: Response): Promise<Response> => {
    try {
        const adminExists = await User.findOne({ rol: 'admin', activo: true });

        if (adminExists) {
            const response: ApiResponse<BaseUser> = {
                ok: true,
                message: 'Administrador ya existe',
                data: documentToBaseUser(adminExists)
            };
            return res.status(200).json(response);
        }

        const defaultAdmin = new User({
            email: 'admin@matuc.cl',
            nombre: 'Administrador',
            apellido: 'Sistema',
            rol: 'admin',
            activo: true
        });

        const admin = await defaultAdmin.save();

        const response: ApiResponse<BaseUser> = {
            ok: true,
            message: 'Administrador por defecto creado',
            data: documentToBaseUser(admin)
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en crearAdminPorDefecto:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al crear administrador por defecto',
            error: error instanceof Error ? error.message : 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};

export const obtenerEstadisticasUsuarios = async (req: Request, res: Response): Promise<Response> => {
    try {
        const [
            totalUsuarios,
            usuariosActivos,
            instructores,
            estudiantes,
            administradores
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ activo: true }),
            User.countDocuments({ rol: 'instructor', activo: true }),
            User.countDocuments({ rol: 'student', activo: true }),
            User.countDocuments({ rol: 'admin', activo: true })
        ]);

        const response: ApiResponse = {
            ok: true,
            message: 'Estadísticas de usuarios obtenidas',
            data: {
                total: totalUsuarios,
                activos: usuariosActivos,
                inactivos: totalUsuarios - usuariosActivos,
                porRol: {
                    instructores,
                    estudiantes,
                    administradores
                },
                porcentajeActivos: totalUsuarios > 0 ? Math.round((usuariosActivos / totalUsuarios) * 100) : 0
            }
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error en obtenerEstadisticasUsuarios:', error);

        const response: ApiResponse = {
            ok: false,
            message: 'Error al obtener estadísticas',
            error: 'INTERNAL_ERROR'
        };
        return res.status(500).json(response);
    }
};