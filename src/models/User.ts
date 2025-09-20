// ============================================================================
// MODELO USER - MATUC LTI EXERCISE COMPOSER
// ============================================================================
// Archivo: src/models/User.ts
// Propósito: Modelo de usuario compatible con LTI y Canvas

import { Schema, model, Document } from 'mongoose';
import { UID, UserRole } from '../types/shared';

// ============================================================================
// INTERFACE PARA TYPESCRIPT
// ============================================================================

export interface IUser extends Document {
    uid: UID;
    email: string;
    nombre: string;
    apellido: string;
    rol: UserRole;
    canvasUserId?: string;
    ltiUserId?: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;

    // Métodos del documento
    getNombreCompleto(): string;
    isAdmin(): boolean;
    isInstructor(): boolean;
    isStudent(): boolean;
}

// ============================================================================
// SCHEMA MONGOOSE
// ============================================================================

const UserSchema = new Schema<IUser>({
    uid: {
        type: String,
        required: [true, 'UID es requerido'],
        unique: true,
        trim: true,
        maxlength: [50, 'UID no puede exceder 50 caracteres'],
        match: [/^[a-zA-Z0-9_-]+$/, 'UID solo puede contener letras, números, guiones y guiones bajos']
    },

    email: {
        type: String,
        required: [true, 'Email es requerido'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [255, 'Email no puede exceder 255 caracteres'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email debe tener formato válido']
    },

    nombre: {
        type: String,
        required: [true, 'Nombre es requerido'],
        trim: true,
        minlength: [2, 'Nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'Nombre no puede exceder 100 caracteres'],
        match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre solo puede contener letras y espacios']
    },

    apellido: {
        type: String,
        required: [true, 'Apellido es requerido'],
        trim: true,
        minlength: [2, 'Apellido debe tener al menos 2 caracteres'],
        maxlength: [100, 'Apellido no puede exceder 100 caracteres'],
        match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Apellido solo puede contener letras y espacios']
    },

    rol: {
        type: String,
        required: [true, 'Rol es requerido'],
        enum: {
            values: ['instructor', 'student', 'admin'],
            message: 'Rol debe ser: instructor, student o admin'
        },
        default: 'student'
    },

    canvasUserId: {
        type: String,
        sparse: true, // Permite múltiples null/undefined pero únicos si existe
        trim: true,
        maxlength: [50, 'Canvas User ID no puede exceder 50 caracteres']
    },

    ltiUserId: {
        type: String,
        sparse: true,
        trim: true,
        maxlength: [255, 'LTI User ID no puede exceder 255 caracteres']
    },

    activo: {
        type: Boolean,
        required: true,
        default: true
    },

    fechaCreacion: {
        type: Date,
        default: Date.now,
        immutable: true // No se puede modificar después de creado
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaActualizacion'
    },
    versionKey: false // Deshabilitar __v
});

// ============================================================================
// ÍNDICES PARA PERFORMANCE
// ============================================================================

// Índices únicos
UserSchema.index({ uid: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

// Índices de búsqueda
UserSchema.index({ rol: 1 });
UserSchema.index({ activo: 1 });
UserSchema.index({ canvasUserId: 1 }, { sparse: true });
UserSchema.index({ ltiUserId: 1 }, { sparse: true });

// Índice compuesto para búsquedas comunes
UserSchema.index({ rol: 1, activo: 1 });
UserSchema.index({ nombre: 1, apellido: 1 });

// ============================================================================
// MÉTODOS DEL DOCUMENTO
// ============================================================================

UserSchema.methods.getNombreCompleto = function (): string {
    return `${this.nombre} ${this.apellido}`.trim();
};

UserSchema.methods.isAdmin = function (): boolean {
    return this.rol === 'admin';
};

UserSchema.methods.isInstructor = function (): boolean {
    return this.rol === 'instructor';
};

UserSchema.methods.isStudent = function (): boolean {
    return this.rol === 'student';
};

// ============================================================================
// MIDDLEWARES
// ============================================================================

// Pre-save: Generar UID si no existe
UserSchema.pre('save', function (next) {
    if (!this.uid) {
        // Generar UID basado en email
        const emailPrefix = this.email.split('@')[0];
        const timestamp = Date.now().toString().slice(-6);
        this.uid = `${emailPrefix}_${timestamp}`;
    }
    next();
});

// Pre-save: Actualizar fechaActualizacion
UserSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.fechaActualizacion = new Date();
    }
    next();
});

// Post-save: Log de creación
UserSchema.post('save', function (doc) {
    if (doc.isNew) {
        console.log(`User created: ${doc.uid} (${doc.email}) - Role: ${doc.rol}`);
    }
});

// ============================================================================
// MÉTODOS ESTÁTICOS
// ============================================================================

UserSchema.statics.findByRole = function (rol: UserRole) {
    return this.find({ rol, activo: true });
};

UserSchema.statics.findByCanvasId = function (canvasUserId: string) {
    return this.findOne({ canvasUserId, activo: true });
};

UserSchema.statics.findByLTIId = function (ltiUserId: string) {
    return this.findOne({ ltiUserId, activo: true });
};

UserSchema.statics.createDefaultAdmin = async function () {
    const adminExists = await this.findOne({ rol: 'admin', activo: true });

    if (!adminExists) {
        const defaultAdmin = new this({
            uid: 'admin_default',
            email: 'admin@matuc.cl',
            nombre: 'Administrador',
            apellido: 'Sistema',
            rol: 'admin',
            activo: true
        });

        await defaultAdmin.save();
        console.log('Default admin created');
        return defaultAdmin;
    }

    return adminExists;
};

// ============================================================================
// CONFIGURACIÓN DE SALIDA JSON
// ============================================================================

UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    // Remover campos sensibles si es necesario
    // delete userObject.somePrivateField;

    return userObject;
};

// ============================================================================
// VALIDACIONES PERSONALIZADAS
// ============================================================================

// Validar que siempre haya al menos un admin activo
UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as any;

    // Si se está desactivando un admin
    if (update.activo === false || update.rol !== 'admin') {
        const doc = await this.model.findOne(this.getQuery());
        if (doc && doc.rol === 'admin') {
            const activeAdmins = await this.model.countDocuments({
                rol: 'admin',
                activo: true,
                _id: { $ne: doc._id }
            });

            if (activeAdmins === 0) {
                throw new Error('No se puede desactivar o cambiar rol del último administrador');
            }
        }
    }

    next();
});

// ============================================================================
// CREAR Y EXPORTAR MODELO
// ============================================================================

const User = model<IUser>('User', UserSchema);

export default User;