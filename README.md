# MATUC LTI Exercise Composer - Backend

## 🎯 Descripción
Backend para Exercise Composer con preguntas anidadas integrado con Canvas LTI 1.3.

## 🚀 Inicio Rápido

### 1. Instalación
```bash
# Clonar o crear el directorio del proyecto
mkdir matuc-lti-backend
cd matuc-lti-backend

# Instalar dependencias
npm install
```

### 2. Configuración
```bash
# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

### 3. Variables de Entorno Requeridas
```env
PORT=3000
NODE_ENV=development
DB_CNN=mongodb://localhost:27017/matuc-lti-dev
CORS_ORIGIN=http://localhost:3000
```

### 4. Iniciar MongoDB
```bash
# Usando MongoDB local
mongod

# O usando Docker
docker run -d -p 27017:27017 --name mongo-matuc mongo:latest
```

### 5. Ejecutar Servidor
```bash
# Desarrollo
npm run dev

# Build y producción
npm run build
npm start
```

## 📋 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Health check del servidor |
| `/info` | GET | Información del sistema |
| `/api/test` | GET | Test básico de API |
| `/api/test/echo` | POST | Echo test para desarrollo |

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración MongoDB
│   └── server.ts                # Servidor Express principal
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor en modo desarrollo
- `npm run dev:debug` - Servidor con debug
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar versión compilada

## ✅ Verificación de Funcionamiento

1. **Verificar servidor:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Verificar API:**
   ```bash
   curl http://localhost:3000/api/test
   ```

3. **Test Echo:**
   ```bash
   curl -X POST http://localhost:3000/api/test/echo \
        -H "Content-Type: application/json" \
        -d '{"test": "data"}'
   ```

## 🎯 Próximos Pasos

### Fase 2: Modelos de Datos
- [ ] Modelo ExerciseSet
- [ ] Modelo NestedQuestion
- [ ] Modelo StudentAttempt

### Fase 3: Servicios LTI
- [ ] Configuración LTI 1.3
- [ ] Servicios de autenticación
- [ ] Integración Canvas

### Fase 4: Controladores y Rutas
- [ ] Controladores CRUD
- [ ] Rutas API completas
- [ ] Validaciones

### Fase 5: Testing y Seguridad
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Auditoría de seguridad

## 🛠️ Tecnologías

- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose**
- **LTI 1.3** (próximamente)
- **Canvas Integration** (próximamente)

## 👨‍💻 Autor
Wolfgang Rivera - <wcrivera@uc.cl>

---

**Estado actual:** ✅ Fase 1 Completada - Servidor Básico Funcionando# matuc-canvas-servidor
