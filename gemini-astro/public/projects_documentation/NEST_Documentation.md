# 🏠 NEST - Sitio Web Corporativo

## Documentación Técnica del Proyecto

---

## 📋 Descripción General

**NEST** es un sitio web corporativo moderno desarrollado para una empresa de desarrollo inmobiliario mexicana. El proyecto presenta un portafolio completo de propiedades inmobiliarias, información institucional y herramientas de contacto con clientes potenciales.

El sitio web está diseñado con un enfoque en la experiencia del usuario, ofreciendo navegación intuitiva, animaciones fluidas y un diseño responsive que se adapta a dispositivos móviles y de escritorio.

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Next.js** | 13.2.4 | Framework de React para producción con SSR/SSG |
| **React** | 18.2.0 | Biblioteca de interfaces de usuario |
| **TypeScript** | 5.0.3 | Superset de JavaScript con tipado estático |
| **Tailwind CSS** | 3.3.1 | Framework de CSS utilitario |
| **SASS/SCSS** | 1.60.0 | Preprocesador CSS para estilos modulares |
| **Framer Motion** | 10.12.4 | Biblioteca de animaciones para React |

### Backend & APIs
| Tecnología | Descripción |
|------------|-------------|
| **Contentful** | CMS Headless para gestión de contenido |
| **Supabase** | Backend as a Service (base de datos PostgreSQL) |
| **SendGrid** | Servicio de envío de correos electrónicos |
| **Next.js API Routes** | Endpoints serverless para el backend |

### Bibliotecas UI/UX
| Biblioteca | Uso |
|------------|-----|
| **Swiper** | Carruseles y galerías interactivas |
| **React Slick** | Sliders de contenido |
| **React Waypoint** | Detección de scroll para animaciones |
| **React Responsive Masonry** | Layouts tipo masonry para galerías |
| **Next SEO** | Optimización para motores de búsqueda |

---

## 📁 Arquitectura del Proyecto

```
nest/
├── 📂 components/           # Componentes React reutilizables
│   ├── 📂 common/           # Componentes compartidos (Layout, Navbar, Footer)
│   ├── 📂 Home/             # Componentes específicos de la página de inicio
│   ├── 📂 icons/            # Iconos SVG como componentes React
│   ├── 📂 nosotros/         # Componentes de la sección "Nosotros"
│   ├── 📂 Proyecto/         # Componentes de detalle de proyectos
│   ├── Canvas.tsx           # Componente de canvas interactivo
│   ├── ContentfulImage.tsx  # Wrapper para imágenes de Contentful
│   └── SurveyForm.tsx       # Formulario de encuesta de compra
│
├── 📂 helpers/              # Funciones utilitarias
│   ├── compareByYear.ts     # Ordenamiento de proyectos por año
│   ├── configLayout.ts      # Configuración del layout global
│   ├── contentful.ts        # Helpers para consultas a Contentful
│   ├── generateRandomNumber.ts
│   ├── normalizeProject.ts  # Normalización de datos de proyectos
│   └── toSlug.ts            # Conversión de texto a slug URL
│
├── 📂 lib/                  # Clientes de servicios externos
│   ├── contentful.ts        # Cliente de Contentful CMS
│   └── supabase.ts          # Cliente de Supabase
│
├── 📂 pages/                # Páginas de Next.js (File-based routing)
│   ├── 📂 api/              # API Routes (Endpoints backend)
│   │   ├── landing-mail.ts  # Envío de correos desde landing
│   │   ├── send-mail.ts     # Envío de correos de contacto
│   │   └── submit-survey.ts # Procesamiento de encuestas
│   ├── 📂 proyecto/         # Páginas dinámicas de proyectos
│   │   └── [slug].tsx       # Página de detalle de proyecto
│   ├── _app.js              # Componente App personalizado
│   ├── _document.js         # Documento HTML personalizado
│   ├── index.tsx            # Página de inicio
│   ├── nosotros.tsx         # Página "Nosotros"
│   ├── proyectos.tsx        # Catálogo de proyectos
│   ├── nest-living.tsx      # Sección Nest Living
│   ├── encuesta-compra.tsx  # Encuesta post-compra
│   └── botella.tsx          # Página especial de campaña
│
├── 📂 public/               # Archivos estáticos
│   ├── 📂 fonts/            # Fuentes tipográficas
│   ├── 📂 images/           # Imágenes locales
│   └── 📂 forms/            # Assets para formularios
│
├── 📂 styles/               # Estilos CSS/SCSS
│   ├── 📂 components/       # Estilos específicos por componente
│   ├── globals.scss         # Estilos globales
│   └── *.module.scss        # Módulos CSS por página
│
├── 📂 types/                # Definiciones de TypeScript
│   └── ContentfulTypes.ts   # Tipos para datos de Contentful
│
└── Archivos de configuración
    ├── next.config.js       # Configuración de Next.js
    ├── tailwind.config.js   # Configuración de Tailwind CSS
    ├── tsconfig.json        # Configuración de TypeScript
    └── package.json         # Dependencias y scripts
```

---

## 🌐 Páginas Principales

### 1. **Página de Inicio** (`/`)
- Hero section con carrusel de imágenes/videos
- Sección de proyectos destacados aleatorios
- Información institucional "Quiénes somos"
- Sección de noticias
- Sección Nest Living
- Formulario de contacto integrado

### 2. **Nosotros** (`/nosotros`)
- Hero image de la empresa
- Historia y valores de la compañía
- Información de ubicación
- Equipo de trabajo
- Integración con Google Maps

### 3. **Proyectos** (`/proyectos`)
- Grid de proyectos destacados (4 principales)
- Filtrado por estado (En proceso / Finalizados)
- Ordenamiento por año
- Tarjetas interactivas con hover effects

### 4. **Detalle de Proyecto** (`/proyecto/[slug]`)
- Página dinámica generada por SSG
- Hero con imagen principal
- Logo del proyecto
- Galería de imágenes con Swiper
- Información de ubicación
- Integración con Google Maps
- Amenidades y características
- Botón de WhatsApp flotante

### 5. **Nest Living** (`/nest-living`)
- Concepto de estilo de vida
- Layout masonry para galería
- Lista de características
- Pilares de la marca

### 6. **Encuesta de Compra** (`/encuesta-compra`)
- Formulario completo de satisfacción
- Campos de selección múltiple
- Validación en frontend
- Almacenamiento en Supabase

---

## ⚡ Características Técnicas Destacadas

### Renderizado y Optimización
- **Static Site Generation (SSG)** con `getStaticProps` para mejor rendimiento
- **Incremental Static Regeneration (ISR)** para contenido actualizado
- **Optimización de imágenes** con `next/image` y carga lazy
- **SEO optimizado** con Next SEO

### Animaciones y UX
- **Scroll-triggered animations** con React Waypoint
- **Smooth transitions** con Framer Motion
- **Split text animations** personalizadas
- **Parallax effects** en secciones hero

### Gestión de Contenido (CMS)
- **Contentful CMS** como fuente de datos principal
- **Rich Text rendering** con personalización de bloques
- **Manejo de assets** (imágenes, videos) desde CDN

### Integraciones
- **SendGrid** para envío de emails transaccionales
- **Supabase** para almacenamiento de encuestas
- **Google Maps Embed** para ubicaciones de proyectos

### Diseño Responsive
- Mobile-first approach
- Breakpoints personalizados en Tailwind
- Imágenes hero específicas para móvil y desktop
- Menú hamburguesa animado en móvil

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
--gray-default: #76777A   /* Gris principal */
--gray-light: #B1B1B1     /* Gris claro */
--gray-dark: #262626      /* Gris oscuro / Negro */
--off-white: #EEEEEE      /* Blanco roto / Fondo */
```

### Tipografía
- Sistema de fuentes personalizadas
- Pesos: Regular, Bold, Semibold
- Escalado responsive con clases utilitarias

### Componentes UI Reutilizables
- `Button` - Botones con variantes
- `Carousel` - Carrusel configurable
- `SectionTitle` - Títulos de sección consistentes
- `SplitText` - Animación de texto letra por letra

---

## 📧 APIs y Endpoints

### `POST /api/send-mail`
Envía correos de contacto desde el formulario principal.

**Payload:**
```json
{
  "username": "string",
  "email": "string",
  "phone": "string",
  "interes": "string",
  "otro": "string (opcional)",
  "message": "string (opcional)"
}
```

### `POST /api/submit-survey`
Almacena respuestas de encuestas de satisfacción en Supabase.

**Payload:**
```json
{
  "name": "string",
  "age": "number",
  "project": "string",
  "department": "string",
  "maritalStatus": "string",
  "colonia": "string",
  "actualmenteVive": "string",
  "profile": "string",
  "comoEntero": "string",
  "visitadoOtros": "string",
  "proyectoVisitado": "string",
  "ventajas": "string[]",
  "amenidades": "string[]",
  "desventajas": "string",
  "opinionCliente": "string"
}
```

### `POST /api/landing-mail`
Envío de correos específicos para páginas de landing.

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting
npm run lint
```

---

## 🔧 Variables de Entorno

El proyecto requiere las siguientes variables de entorno:

```env
# Contentful CMS
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

---

## 📊 Métricas y Rendimiento

### Optimizaciones Implementadas
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático de Next.js
- ✅ CSS Modules para scope de estilos
- ✅ Preload de recursos críticos
- ✅ Compresión de assets
- ✅ CDN para contenido de Contentful

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

---

## 🌍 Despliegue

El proyecto está optimizado para despliegue en **Vercel** (plataforma recomendada por Next.js):

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a main

---

## 👥 Proyectos Inmobiliarios

El sitio presenta diversos proyectos inmobiliarios incluyendo:
- **WE2T** - Desarrollo residencial
- **W3ST** - Desarrollo residencial
- **RISE** - Torres residenciales
- **ANIDA** - Comunidad residencial

Cada proyecto incluye:
- Galería de imágenes
- Ubicación con mapa interactivo
- Estado del proyecto (En proceso/Finalizado)
- Página web dedicada del proyecto

---

## 📝 Notas Adicionales

### Mantenimiento del CMS
El contenido del sitio se gestiona desde **Contentful**. Para actualizar:
- Proyectos: Content Type "Proyecto"
- Páginas: Content Types específicos por página
- Navbar/Footer: Content Type "Config"

### Escalabilidad
La arquitectura permite agregar fácilmente:
- Nuevos proyectos desde el CMS
- Páginas adicionales
- Integración con CRM
- Multilenguaje (i18n ready)

---

## 🏆 Características Destacadas para Portafolio

| Característica | Implementación |
|----------------|----------------|
| 🎨 Diseño moderno y elegante | Tailwind CSS + SCSS personalizado |
| 📱 100% Responsive | Mobile-first con breakpoints optimizados |
| ⚡ Alto rendimiento | Next.js SSG + ISR |
| 🔄 Contenido dinámico | Contentful CMS |
| ✉️ Formularios funcionales | SendGrid + Supabase |
| 🗺️ Mapas interactivos | Google Maps Embed |
| 🎬 Animaciones suaves | Framer Motion + React Waypoint |
| 🔍 SEO optimizado | Next SEO + Meta tags dinámicos |
| 📊 Encuestas de satisfacción | Forms + Base de datos |
| 🖼️ Galerías interactivas | Swiper + Masonry layouts |

---

## 📄 Licencia

Proyecto privado - © GRUPO NEST, S.C. Todos los derechos reservados.

---

*Documentación generada para portafolio de software - Enero 2026*
