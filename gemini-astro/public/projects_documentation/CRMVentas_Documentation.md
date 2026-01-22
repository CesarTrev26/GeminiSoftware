# 🏢 CRM Ventas - Sistema de Gestión de Relaciones con Clientes

## 📋 Descripción General

**CRM Ventas** es una aplicación web completa de gestión de relaciones con clientes (CRM) desarrollada específicamente para el sector inmobiliario. El sistema permite gestionar proyectos inmobiliarios, inventario de propiedades, cotizaciones, separaciones de inmuebles, y el seguimiento completo de clientes desde el primer contacto hasta la venta.

La aplicación está diseñada para empresas desarrolladoras de bienes raíces, facilitando la gestión comercial y administrativa de múltiples proyectos inmobiliarios simultáneamente.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Inicio de sesión seguro con JWT (JSON Web Tokens)
- Sistema de roles (Administrador y Comercial)
- Gestión de sesiones con expiración automática
- Protección de rutas según nivel de acceso

### 🏗️ Gestión de Proyectos
- Administración de múltiples proyectos inmobiliarios
- Visualización de inventario por proyecto
- Pipeline de ventas con seguimiento de etapas
- Gestión de departamentos/unidades disponibles
- Control de precios y disponibilidad

### 👥 Gestión de Clientes
- Registro completo de información de clientes
- Múltiples emails, teléfonos y direcciones por cliente
- Detección automática de clientes duplicados
- Historial de cambios en información del cliente
- Gestión de archivos y documentos por cliente
- Notas y seguimiento de interacciones
- Foto de perfil de clientes

### 💰 Cotizaciones
- Sistema de cotización personalizado por proyecto
- Cotizaciones estándar y personalizadas
- Cálculo automático de precios con promociones
- Generación de listas de precios
- Visualización de disponibilidad de inmuebles

### 📝 Separaciones (Reservas)
- Registro de separaciones de propiedades
- Captura completa de datos del cliente
- Actualización automática del maestro de clientes
- Control de inventario en tiempo real
- Historial de cambios en separaciones

### 📂 Gestión de Archivos
- Carga y almacenamiento de documentos por cliente
- Categorización de archivos (Identificación, Comprobantes, Contratos, etc.)
- Sistema de etiquetas para organización
- Visualización y descarga de archivos
- Metadatos y descripción de documentos

### 🔄 Integración con Less Annoying CRM
- Sincronización bidireccional de contactos
- Importación automática de información de clientes
- Actualización de datos en tiempo real

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3** - Biblioteca principal de UI
- **TypeScript** - Tipado estático y seguridad en el código
- **Vite** - Build tool y servidor de desarrollo
- **React Router DOM 6.30** - Enrutamiento y navegación
- **Zustand 5.0** - Gestión de estado global
- **Axios** - Cliente HTTP para peticiones API
- **React Quill** - Editor de texto enriquecido
- **DOMPurify** - Sanitización de HTML

### Backend
- **Node.js** - Entorno de ejecución
- **Express 5.1** - Framework web
- **TypeScript** - Tipado estático en servidor
- **PostgreSQL** - Base de datos relacional
- **Kysely 0.28** - Query builder type-safe
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Manejo de carga de archivos
- **Sanitize-HTML** - Sanitización de contenido

### DevOps y Herramientas
- **ESLint 9.17** - Linting de código
- **Concurrently** - Ejecución paralela de procesos
- **TSX** - Ejecución de TypeScript con hot-reload
- **node-pg-migrate** - Migraciones de base de datos
- **Kysely Codegen** - Generación automática de tipos desde BD

## 📁 Estructura del Proyecto

```
crmventas/
├── src/                          # Código fuente del frontend
│   ├── admin/                    # Módulo de administración
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   │       └── ProjectManagementPage.tsx
│   ├── auth/                     # Autenticación
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   │       └── LoginPage.tsx
│   ├── comercial/                # Módulo comercial
│   │   ├── components/           # Componentes reutilizables
│   │   ├── helpers/              # Funciones auxiliares
│   │   ├── hooks/                # Custom hooks
│   │   └── pages/                # Páginas del módulo
│   │       ├── AvailableListPage.tsx
│   │       ├── ContactListPage.tsx
│   │       ├── CreateContactPage.tsx
│   │       ├── CustomerProfilePage.tsx
│   │       ├── PersonalQuotePage.tsx
│   │       ├── PriceListPage.tsx
│   │       ├── ProjectPipelinePage.tsx
│   │       ├── ProjectsPage.tsx
│   │       ├── QuotePage.tsx
│   │       └── ReservationPage.tsx
│   ├── context/                  # Context API de React
│   │   ├── AuthContext.tsx       # Contexto de autenticación
│   │   ├── ProjectContext.tsx    # Contexto de proyectos
│   │   └── customerStore.ts      # Store de clientes (Zustand)
│   ├── home/                     # Página de inicio
│   ├── router/                   # Configuración de rutas
│   │   └── AppRouter.tsx
│   ├── types/                    # Definiciones TypeScript
│   │   └── models.ts
│   ├── ui/                       # Componentes UI globales
│   │   └── components/
│   │       ├── Navbar.tsx
│   │       └── Sidebar.tsx
│   ├── utils/                    # Utilidades
│   │   └── api.ts
│   ├── assets/                   # Recursos estáticos
│   │   ├── fonts/
│   │   ├── img/
│   │   ├── styles/
│   │   └── videos/
│   ├── main.tsx                  # Punto de entrada
│   └── VentasApp.tsx             # Componente raíz
│
├── server/                       # Código fuente del backend
│   ├── controllers/              # Controladores de rutas
│   │   ├── archivosClienteController.ts
│   │   ├── authController.ts
│   │   ├── customersController.ts
│   │   ├── inventoryController.ts
│   │   ├── lacrmController.ts
│   │   ├── pipelineController.ts
│   │   ├── projectController.ts
│   │   └── separacionesController.ts
│   ├── models/                   # Modelos de datos
│   │   ├── archivosClienteModel.ts
│   │   ├── authModel.ts
│   │   ├── customersModel.ts
│   │   ├── inventoryModel.ts
│   │   ├── lacrmModel.ts
│   │   ├── pipelineModel.ts
│   │   ├── projectModel.ts
│   │   └── separacionesModel.ts
│   ├── routes/                   # Definición de rutas API
│   │   ├── archivosCliente.ts
│   │   ├── auth.ts
│   │   ├── customers.ts
│   │   ├── index.ts
│   │   ├── inventory.ts
│   │   ├── lacrm.ts
│   │   ├── pipelines.ts
│   │   ├── projects.ts
│   │   └── separaciones.ts
│   ├── middleware/               # Middlewares
│   │   └── auth.ts              # Autenticación JWT
│   ├── db/                       # Configuración de BD
│   │   ├── kysely.ts            # Cliente Kysely
│   │   └── types.ts             # Tipos generados
│   ├── migrations/               # Migraciones SQL
│   ├── uploads/                  # Archivos subidos
│   │   ├── clientes/
│   │   └── customers/
│   ├── utils/                    # Utilidades del servidor
│   │   └── lacrmAPI.ts
│   ├── index.ts                  # Punto de entrada del servidor
│   ├── package.json
│   └── tsconfigserver.json
│
├── public/                       # Archivos públicos estáticos
├── package.json                  # Dependencias del frontend
├── tsconfig.json                 # Configuración TypeScript
├── vite.config.js                # Configuración Vite
├── eslint.config.js              # Configuración ESLint
└── .env                          # Variables de entorno (no incluido)
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** o **yarn**

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd crmventas
```

### 2. Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
DATABASE_SCHEMA=crm_ventas

# JWT
JWT_SECRET=tu_clave_secreta_super_segura

# API Externa (opcional)
LACRM_API_KEY=tu_api_key_lacrm

# Servidor
PORT=3000
NODE_ENV=development
```

### 3. Instalar Dependencias

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
cd ..
```

### 4. Configurar la Base de Datos

#### Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE nombre_base_datos;
CREATE SCHEMA crm_ventas;
```

#### Ejecutar migraciones:
```bash
npm run migrate:up
```

#### Generar tipos de TypeScript desde la BD:
```bash
npm run kysely:gen
npm run sync-types
```

### 5. Ejecutar el Proyecto

#### Modo Desarrollo (Frontend + Backend simultáneamente):
```bash
npm run dev:both
```

#### O ejecutar por separado:

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
npm run server:dev
```

El frontend estará disponible en: `http://localhost:5173`
El backend estará disponible en: `http://localhost:3000`

## 📊 Esquema de Base de Datos

### Tablas Principales

#### `usuarios`
Almacena información de usuarios del sistema.
- id, nombre, email, password, teléfono, rol

#### `clientes`
Registro maestro de clientes.
- id, nombre, empresa, puesto, RFC, cumpleaños
- correos (email_principal, email_secundario)
- teléfonos (telefono_celular, telefono_casa, telefono_trabajo)
- direcciones, redes sociales
- foto_perfil, información adicional

#### `proyectos`
Proyectos inmobiliarios gestionados.
- id, nombre, ubicación, descripción, estado

#### `departamentos`
Unidades/departamentos dentro de proyectos.
- id, proyecto_id, número, piso, torre
- precio, superficie, recámaras, baños
- estatus, fecha_disponibilidad

#### `separaciones`
Reservas de propiedades por clientes.
- id, departamento_id, cliente_id
- datos del cliente (pueden diferir del maestro)
- fecha_separacion, timestamp
- historial de cambios

#### `archivos_cliente`
Documentos y archivos por cliente.
- id, cliente_id, nombre_archivo, ruta_archivo
- categoria_archivo, descripcion, etiquetas
- tipo_mime, tamaño_archivo, metadatos

#### `notas_contacto`
Historial de interacciones con clientes.
- id, cliente_id, usuario_id
- tipo_nota, contenido, fecha_contacto

#### `pipelines`
Etapas del proceso de ventas.
- id, nombre, orden, descripción

#### `historial_cambios_cliente`
Auditoría de cambios en información de clientes.
- id, cliente_id, campo_modificado
- valor_anterior, valor_nuevo, fecha_modificacion

## 🔒 Seguridad

### Autenticación y Autorización
- JWT con expiración de 24 horas
- Tokens almacenados en localStorage del cliente
- Middleware de autenticación en todas las rutas protegidas
- Verificación de roles para acceso administrativo

### Protección de Datos
- Sanitización de inputs HTML con DOMPurify y sanitize-html
- Validación de datos en frontend y backend
- Uso de prepared statements para prevenir SQL injection
- CORS configurado para origen específico

### Archivos
- Validación de tipos de archivo en carga
- Almacenamiento seguro en directorio protegido
- URLs de acceso con autenticación requerida

## 📡 API Endpoints

### Autenticación
```
POST /api/auth/login          # Iniciar sesión
```

### Proyectos
```
GET    /api/proyectos         # Listar proyectos
GET    /api/proyectos/:id     # Obtener proyecto
POST   /api/proyectos         # Crear proyecto
PUT    /api/proyectos/:id     # Actualizar proyecto
DELETE /api/proyectos/:id     # Eliminar proyecto
```

### Clientes
```
GET    /api/clientes                    # Listar clientes
GET    /api/clientes/:id                # Obtener cliente
POST   /api/clientes                    # Crear cliente
PUT    /api/clientes/:id                # Actualizar cliente
DELETE /api/clientes/:id                # Eliminar cliente
GET    /api/clientes/:id/historial      # Historial de cambios
```

### Archivos de Cliente
```
GET    /api/clientes/:id/archivos       # Listar archivos
POST   /api/clientes/:id/archivos       # Subir archivo
GET    /api/clientes/:id/archivos/:archivoId  # Descargar archivo
DELETE /api/clientes/:id/archivos/:archivoId  # Eliminar archivo
```

### Inventario
```
GET /api/inventario/:projectId          # Inventario por proyecto
GET /api/inventario/:projectId/disponibles  # Unidades disponibles
```

### Separaciones
```
GET    /api/separaciones                # Listar separaciones
POST   /api/separaciones                # Crear separación
GET    /api/separaciones/:id            # Obtener separación
PUT    /api/separaciones/:id            # Actualizar separación
DELETE /api/separaciones/:id            # Cancelar separación
```

### Pipelines
```
GET /api/pipelines                      # Obtener pipeline de ventas
```

### Less Annoying CRM
```
GET  /api/lacrm/contacts                # Sincronizar contactos
POST /api/lacrm/contacts                # Crear contacto en LACRM
```

## 🎨 Características de UI/UX

### Interfaz Responsiva
- Diseño adaptable a diferentes tamaños de pantalla
- Navegación intuitiva con sidebar colapsable
- Experiencia optimizada para desktop

### Componentes Principales
- **Navbar**: Barra de navegación superior con notificaciones y perfil
- **Sidebar**: Menú lateral con navegación por módulos
- **Modals**: Ventanas modales para acciones rápidas
- **Forms**: Formularios con validación en tiempo real
- **Tables**: Tablas de datos con ordenamiento y búsqueda
- **File Upload**: Drag & drop para carga de archivos

### Temas y Estilos
- Variables CSS para personalización
- Paleta de colores corporativa
- Tipografía consistente
- Iconografía profesional

## 🧪 Scripts Disponibles

### Frontend
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build
npm run lint             # Linting del código
npm run typecheck        # Verificación de tipos
```

### Backend
```bash
npm run server:dev       # Servidor con hot-reload
npm run server:build     # Compilar TypeScript
npm run server:start     # Ejecutar build compilado
npm run server:typecheck # Verificación de tipos
```

### Base de Datos
```bash
npm run migrate:up       # Ejecutar migraciones
npm run migrate:down     # Revertir última migración
npm run kysely:gen       # Generar tipos desde BD
npm run full-sync        # Sincronización completa de tipos
```

### Desarrollo Completo
```bash
npm run dev:both         # Frontend + Backend simultáneamente
npm run start:full       # Preparar y ejecutar todo
npm run typecheck:all    # Verificar tipos frontend + backend
```

## 📈 Casos de Uso

### 1. Gestión de Leads
Un asesor comercial puede:
- Registrar nuevos clientes potenciales
- Capturar múltiples formas de contacto
- Añadir notas de seguimiento
- Ver historial de interacciones

### 2. Proceso de Venta
Durante una venta, el sistema permite:
- Mostrar inventario disponible al cliente
- Generar cotización personalizada
- Realizar separación de unidad
- Subir documentación del cliente
- Dar seguimiento en el pipeline

### 3. Administración de Proyectos
Los administradores pueden:
- Crear y configurar nuevos proyectos
- Gestionar inventario de unidades
- Controlar precios y disponibilidad
- Ver reportes de ventas por proyecto

### 4. Sincronización con CRM Externo
El sistema puede:
- Importar contactos desde Less Annoying CRM
- Mantener sincronización bidireccional
- Evitar duplicación de información

## 🔧 Mantenimiento y Actualizaciones

### Actualizar Dependencias
```bash
npm update
cd server && npm update
```

### Crear Nueva Migración
```bash
cd server
npm run migrate:create nombre_migracion
```

### Regenerar Tipos de BD
```bash
npm run kysely:gen
npm run sync-types
```

## 🤝 Contribuciones

Este es un proyecto privado desarrollado para uso interno. Para contribuir:

1. Crear una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Commit de cambios: `git commit -m 'Agregar nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request para revisión

## 📝 Convenciones de Código

### TypeScript
- Usar tipos explícitos siempre que sea posible
- Interfaces para definición de estructuras de datos
- No usar `any` excepto en casos justificados

### React
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Custom hooks para lógica reutilizable
- CSS Modules para estilos encapsulados

### Backend
- Separación clara de capas (routes, controllers, models)
- Manejo centralizado de errores
- Validación de datos en controllers
- SQL parametrizado con Kysely

## 🐛 Debugging

### Frontend
```bash
# Modo desarrollo con source maps
npm run dev

# Verificar errores de TypeScript
npm run typecheck
```

### Backend
```bash
# Con logs detallados
npm run server:dev

# Verificar conexión a BD
node -e "require('./server/db/kysely.js')"
```

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema:
- Documentar el problema en detalle
- Incluir capturas de pantalla si es relevante
- Verificar logs de consola del navegador
- Revisar logs del servidor

## 📄 Licencia

Este proyecto es propiedad privada de GRUPO NEST, S.C. Todos los derechos reservados.

---

**Desarrollado con ❤️ para optimizar la gestión comercial inmobiliaria**

*Versión: 1.0.0*  
*Última actualización: Enero 2026*
