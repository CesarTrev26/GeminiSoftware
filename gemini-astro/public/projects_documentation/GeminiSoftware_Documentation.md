# Gemini Software - Portafolio Web Empresarial

## 📋 Resumen Ejecutivo

**Gemini Software** es el sitio web corporativo y portafolio de la empresa, desarrollado con arquitectura moderna full-stack. El proyecto combina un frontend ultra-rápido con Astro y un backend robusto con Node.js/Express, ofreciendo una experiencia premium para mostrar proyectos y servicios de desarrollo de software.

---

## 🎯 Objetivos del Proyecto

1. **Presencia Digital Profesional**: Crear un sitio web que refleje la calidad del trabajo de Gemini Software
2. **Portafolio Dinámico**: Sistema CMS propio para gestionar proyectos sin modificar código
3. **Generación de Leads**: Formulario de contacto integrado con notificaciones por email
4. **Panel de Administración**: Gestión completa de contenido, proyectos y contactos
5. **Performance Óptimo**: Tiempos de carga ultrarrápidos con Astro y optimización de imágenes

---

## 🏗️ Arquitectura del Sistema

### Frontend (gemini-astro)
- **Framework**: Astro 5.x con React para componentes interactivos
- **Styling**: Tailwind CSS 3.x para diseño responsivo utility-first
- **Animaciones**: GSAP + Framer Motion para transiciones fluidas
- **Smooth Scroll**: Lenis para navegación suave premium
- **Deployment**: Vercel con SSR híbrido
- **Build Tool**: Vite (integrado en Astro)

### Backend (gemini-backend)
- **Runtime**: Node.js 20+ con TypeScript
- **Framework**: Express 4.x con middleware de seguridad
- **ORM**: Prisma con SQLite (portable y sin servidor externo)
- **Autenticación**: JWT con roles (ADMIN, EDITOR)
- **Seguridad**: Helmet, CORS, Rate Limiting, bcrypt
- **Email**: Nodemailer para notificaciones
- **Uploads**: Multer + Sharp para optimización de imágenes
- **Deployment**: Fly.io con persistencia de datos

---

## 📁 Estructura del Proyecto

```
GeminiSoftware/
├── gemini-astro/           # Frontend Astro
│   ├── src/
│   │   ├── components/     # Componentes Astro (Hero, Services, Portfolio, etc.)
│   │   ├── layouts/        # BaseLayout con SEO y meta tags
│   │   ├── pages/          # Páginas (index, portfolio, servicios, contacto, admin)
│   │   ├── lib/            # API client y utilidades
│   │   └── styles/         # CSS global y Tailwind config
│   ├── public/
│   │   ├── admin/          # Panel de administración (admin.js)
│   │   ├── img/            # Imágenes estáticas optimizadas
│   │   └── fonts/          # Tipografías personalizadas
│   └── astro.config.mjs    # Configuración de Astro + Vercel adapter
│
├── gemini-backend/         # Backend Node.js
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio (projects, contacts, auth)
│   │   ├── routes/         # Endpoints API RESTful
│   │   ├── middleware/     # Auth JWT, validación
│   │   ├── config/         # Variables de entorno
│   │   └── server.ts       # Entry point Express
│   ├── prisma/
│   │   ├── schema.prisma   # Modelo de datos (User, Project, Contact, Service)
│   │   └── seed.ts         # Datos iniciales
│   └── uploads/            # Archivos subidos (imágenes de proyectos)
│
└── .vscode/
    └── tasks.json          # Scripts de desarrollo integrados
```

---

## 🗄️ Modelo de Datos

### User (Usuarios)
- Autenticación con email/password (bcrypt)
- Roles: ADMIN, EDITOR
- Avatar opcional

### Project (Proyectos)
- Información completa: título, descripción, cliente, categoría
- **longDescription**: Contenido en bloques (text, highlight, two-column, cards)
- **results**: Métricas del proyecto (JSON array)
- **tags**: Stack tecnológico
- Imágenes múltiples con carrusel
- Estados: publicado, destacado, en progreso

### Service (Servicios)
- Título, descripción, icono
- Características en formato lista
- Orden personalizable

### Contact (Contactos)
- Formulario con nombre, email, teléfono, servicio, mensaje
- Estados: NEW, IN_PROGRESS, CONTACTED, CONVERTED, ARCHIVED
- Notas internas para seguimiento

---

## ✨ Funcionalidades Principales

### Sitio Público
- **Hero Section**: Animaciones con Lottie y texto dinámico
- **Servicios**: Cards interactivas con iconos SVG
- **Portafolio**: Grid responsivo con hover effects
- **Página de Proyecto**: Carrusel de imágenes + descripción en bloques
- **Contacto**: Formulario con validación y envío a backend
- **SEO Avanzado**: Schema.org, Open Graph, sitemap automático

### Panel de Administración
- **Login JWT**: Autenticación segura con tokens
- **CRUD Proyectos**: Crear, editar, eliminar proyectos con imágenes
- **Editor de Bloques**: longDescription con tipos de contenido
- **Gestión de Servicios**: Con selector visual de iconos
- **Bandeja de Contactos**: Lista con estados y notas
- **Upload de Imágenes**: Optimización automática con Sharp

---

## 🛡️ Seguridad Implementada

1. **Helmet.js**: Headers de seguridad HTTP
2. **CORS Configurado**: Whitelist de orígenes permitidos
3. **Rate Limiting**: 500 requests/15min por IP
4. **JWT**: Tokens con expiración de 7 días
5. **bcrypt**: Hash de contraseñas con salt
6. **Validación**: express-validator en todos los endpoints
7. **Sanitización**: Escape de HTML en inputs

---

## 🚀 Deployment

### Frontend (Vercel)
- Build automático desde GitHub
- Dominio: geminisoftware.mx
- SSL automático
- CDN global

### Backend (Fly.io)
- Dockerfile optimizado
- SQLite persistente con volumen
- Litestream para backups
- Dominio: gemini-backend.fly.dev
- Auto-scaling

---

## 📊 Métricas del Desarrollo

| Métrica | Valor |
|---------|-------|
| **Lighthouse Performance** | 95+ |
| **Componentes Astro** | 8 |
| **Endpoints API** | 15+ |
| **Modelos de Datos** | 5 |
| **Tiempo de Desarrollo** | 2 meses |
| **Líneas de Código** | ~5,000 |

---

## 🔧 Stack Tecnológico Completo

### Frontend
- Astro 5.x
- React 18
- TypeScript 5.x
- Tailwind CSS 3.x
- GSAP 3.x
- Framer Motion
- Lenis (smooth scroll)

### Backend
- Node.js 20+
- Express 4.x
- TypeScript 5.x
- Prisma ORM
- SQLite
- JWT
- Nodemailer
- Sharp
- Multer

### DevOps
- Vercel (Frontend)
- Fly.io (Backend)
- GitHub (Repositorio)
- VS Code Tasks

---

## 📝 Conclusión

Gemini Software representa un ejemplo completo de arquitectura moderna full-stack, combinando las mejores prácticas de desarrollo web con performance excepcional. El sistema es escalable, seguro y fácil de mantener, sirviendo como la presencia digital principal de la empresa y demostrando las capacidades técnicas del equipo.
