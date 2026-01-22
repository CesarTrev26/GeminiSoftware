# ANIDA - Sitio Web Inmobiliario

![Next.js](https://img.shields.io/badge/Next.js-12.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.1-38B2AC?logo=tailwind-css)
![Prismic CMS](https://img.shields.io/badge/Prismic-CMS-5163BA?logo=prismic)

## 📋 Descripción del Proyecto

**ANIDA** es un sitio web moderno y de alto rendimiento para marketing inmobiliario, desarrollado para NEST, una empresa de desarrollos residenciales premium en Monterrey, México. El sitio web presenta propiedades residenciales de lujo con experiencias visuales inmersivas, recorridos virtuales interactivos y funcionalidad de contacto fluida.

### 🌐 Sitio Web en Vivo
- **URL**: [https://www.anida.mx](https://www.anida.mx)
- **Cliente**: NEST Real Estate Development
- **Ubicación**: Monterrey, Nuevo León, México

---

## 🎯 Objetivos del Proyecto

1. **Presentación de Marca**: Presentar el desarrollo residencial premium de ANIDA con un diseño elegante
2. **Generación de Leads**: Capturar información de compradores potenciales mediante formularios de contacto optimizados
3. **Experiencia Virtual**: Integrar recorridos virtuales 3D para exploración de propiedades
4. **Gestión de Contenido**: Permitir que miembros del equipo sin conocimientos técnicos actualicen el contenido fácilmente
5. **Rendimiento**: Entregar tiempos de carga rápidos y animaciones fluidas
6. **Analítica**: Rastrear el comportamiento del usuario y tasas de conversión

---

## 🛠️ Stack Tecnológico

### Framework Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 12.2.3 | Framework de React con capacidades SSG/SSR |
| **React** | 18.2.0 | Librería de componentes de UI |
| **TypeScript** | 4.7.4 | JavaScript con tipado seguro |

### Estilos y Animación
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 3.1.7 | Framework CSS utility-first |
| **SASS** | 1.54.4 | Preprocesador CSS |
| **Framer Motion** | 7.2.0 | Librería de animaciones |
| **Styled Components** | 5.3.5 | Estilos CSS-in-JS |
| **Swiper** | 8.3.2 | Slider/carrusel táctil |

### Gestión de Contenido y Datos
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Prismic CMS** | 6.6.3 | CMS headless para contenido |
| **SWR** | 1.3.0 | Obtención/caché de datos |

### Manejo y Validación de Formularios
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Formik** | 2.2.9 | Gestión de estado de formularios |
| **Deep Email Validator** | 0.1.21 | Validación de emails |
| **SendGrid** | 7.7.0 | Servicio de envío de emails |

### Analítica y Marketing
| Tecnología | Propósito |
|------------|-----------|
| **Google Tag Manager** | Seguimiento de analítica |
| **Facebook Pixel** | Seguimiento de conversiones |
| **Integración Zapier** | Automatización de CRM |

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
anida-main/
├── components/          # Componentes de UI reutilizables
│   ├── Header.tsx       # Navegación con menú móvil responsivo
│   ├── Footer.tsx       # Pie de página con enlaces sociales
│   ├── Layout.js        # Envoltura de página con transiciones
│   ├── Slider.tsx       # Carrusel de imágenes basado en Swiper
│   ├── Picture.tsx      # Componente de imagen optimizado
│   ├── SEO.tsx          # Gestión de meta tags
│   ├── FAB.tsx          # Botón de acción flotante (WhatsApp)
│   └── svg/             # Componentes de iconos SVG
│
├── pages/               # Páginas de Next.js (enrutamiento basado en archivos)
│   ├── index.js         # Página de inicio
│   ├── [uid].tsx        # Páginas dinámicas desde Prismic
│   ├── _app.tsx         # Envoltura de aplicación con analítica
│   └── api/
│       └── send-mail.ts # Endpoint API de email
│
├── slices/              # Componentes Slice de Prismic
│   ├── Hero/            # Hero de pantalla completa con slideshow
│   ├── Columnas/        # Secciones de contenido de dos columnas
│   ├── Contacto/        # Formulario de contacto con validación
│   ├── Slider/          # Slider de galería de imágenes
│   ├── Proyecto/        # Visualización de información del proyecto
│   ├── PuntosDeInteres/ # Mapa de puntos de interés
│   ├── TipologiaSlice/  # Selector de tipos de propiedad
│   ├── ClubLiving/      # Muestra de amenidades
│   ├── NestLiving/      # Sección de información de marca
│   ├── Frase/           # Sección de frase/eslogan
│   └── HeroVideo/       # Sección hero con video
│
├── hooks/               # Hooks personalizados de React
│   ├── modalpopup.js    # Modal popup con formulario de leads
│   ├── pathName.js      # Detección de ruta URL
│   └── otroField.js     # Utilidades de campos de formulario
│
├── styles/              # Estilos globales
│   ├── globals.css      # CSS global con Tailwind
│   └── *.module.css     # Módulos específicos de componentes
│
└── customtypes/         # Definiciones de tipos de contenido de Prismic
    ├── homepage/        # Estructura de contenido de página de inicio
    ├── pagina/          # Estructura de página genérica
    ├── sitioconfig/     # Configuración del sitio
    └── tipologia/       # Definiciones de tipos de propiedad
```

### Arquitectura de Flujo de Datos

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Prismic CMS   │────▶│   Next.js SSG   │────▶│   HTML Estático │
│   (API Content) │     │  (Build Time)   │     │   + React JS    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │   CDN/Vercel    │
                        │  (Despliegue)   │
                        └─────────────────┘
```

---

## ✨ Características Principales

### 1. Sección Hero Dinámica con Slideshow
- Hero inmersivo de pantalla completa con carrusel de imágenes con reproducción automática
- Superposición de color personalizable y transparencia
- Tipografía animada con efectos de texto dividido
- Efecto parallax de fondo fijo

### 2. Integración de Recorrido Virtual Interactivo
- Enlaces de recorrido virtual 3D para tipologías de propiedades
- Menú desplegable para selección de recorridos
- Integración con escáner externo (scannen.mx)

### 3. Navegación Responsiva
- Encabezado fijo con comportamiento de ocultación al hacer scroll
- Menú hamburguesa móvil con transiciones suaves
- Enlaces de barra de navegación dinámicos desde CMS

### 4. Sistema de Formulario de Contacto
- Validación del lado del cliente con Formik
- Validación de email del lado del servidor
- Entrega de emails con SendGrid
- Integración de CRM con Zapier
- Mensajes de éxito/error

### 5. Modal de Captura de Leads
- Popup temporizado para generación de leads
- Visualización de promoción de preventa
- Integración directa con WhatsApp
- Funcionalidad de cerrar al hacer clic afuera

### 6. Navegador de Tipologías de Propiedades
- Visor interactivo de planos de piso
- Filtrado por cantidad de habitaciones (2-3 recámaras)
- Especificaciones de metros cuadrados
- Listas de características por tipología

### 7. Mapa de Amenidades
- Mapa interactivo de ubicación de amenidades
- Marcadores de ubicación numerados
- Animaciones al pasar el cursor
- Enlace externo a Google Maps

### 8. SEO y Analítica
- Meta tags dinámicos por página
- Compartir en redes sociales con Open Graph
- Integración de Google Tag Manager
- Seguimiento de conversiones con Facebook Pixel

### 9. Optimizaciones de Rendimiento
- Generación de Sitio Estático (SSG)
- Optimización de imágenes vía Next.js
- Animaciones de transición entre páginas
- Indicador de carga con barra de progreso

---

## 🎨 Sistema de Diseño

### Paleta de Colores
| Nombre Color | Código Hex | Uso |
|--------------|------------|-----|
| Azul | `#051231` | Color principal de marca, fondos |
| Crema | `#ece1c4` | Fondo secundario, texto |
| Púrpura | `#9A1554` | Color de acento, CTAs |
| Crema Claro | `#f8f4ed` | Fondos alternativos |
| Gris Predeterminado | `#333333` | Texto del cuerpo |

### Tipografía
- **Fuente Principal**: Gilroy (Personalizada)
- **Fuente Secundaria**: Helvetica Neue
- **Tamaños de Encabezados**: 3xl a 9xl (responsivos)
- **Texto del Cuerpo**: Base (16px)

### Patrones de Componentes
- Esquinas redondeadas en CTAs
- Efectos de sombra sutiles
- Transformaciones de escala al pasar el cursor
- Transiciones suaves de color

---

## 📱 Breakpoints Responsivos

| Breakpoint | Ancho | Objetivo |
|------------|-------|----------|
| Móvil | < 768px | Smartphones |
| Tablet | 768px - 1024px | Tablets, laptops pequeñas |
| Escritorio | > 1024px | Computadoras de escritorio |

---

## 🔌 Integraciones de API

### 1. API de Prismic CMS
- Entrega de contenido para todas las páginas
- Funcionalidad de vista previa para editores
- Resolvedor de enlaces para URLs dinámicas

### 2. API de Email de SendGrid
- Envíos de formularios de contacto
- Soporte para múltiples destinatarios
- Plantillas de email HTML

### 3. Webhooks de Zapier
- Datos de leads al pipeline de CRM
- Flujos de trabajo de seguimiento automatizado

### 4. Servicios de Recorrido Virtual
- Recorridos 3D de Scannen.mx
- Recorridos virtuales de Topside Front

---

## 🚀 Despliegue

### Plataforma
- **Hosting**: Vercel (recomendado para Next.js)
- **CDN**: Red global de edge
- **SSL**: HTTPS automático

### Comandos de Build
```bash
# Desarrollo
npm run dev

# Build de Producción
npm run build

# Iniciar Servidor de Producción
npm start

# Prismic Slice Machine
npm run slicemachine
```

### Requisitos de Entorno
- Node.js 16+
- npm o yarn
- Acceso al repositorio de Prismic
- Clave API de SendGrid

---

## 📊 Métricas de Rendimiento

| Métrica | Objetivo | Logrado |
|---------|----------|----------|
| First Contentful Paint | < 1.5s | ✅ |
| Time to Interactive | < 3.0s | ✅ |
| Rendimiento Lighthouse | > 90 | ✅ |
| Responsivo Móvil | 100% | ✅ |

---

## 👥 Equipo y Rol

**Rol del Desarrollador**: Desarrollador Full-Stack

**Responsabilidades**:
- Desarrollo frontend con Next.js/React
- Integración de CMS y modelado de contenido
- Desarrollo de API para funcionalidad de email
- Optimización de rendimiento
- Implementación de animaciones
- Implementación de diseño responsivo
- Integración de analítica

---

## 🔮 Mejoras Futuras

1. **Sistema de Disponibilidad de Unidades**: Inventario en tiempo real desde sistema de ventas
2. **Explorador de Edificio 3D**: Visualización interactiva del edificio
3. **Calculadora Hipotecaria**: Integración de herramienta de financiamiento
4. **Soporte Multiidioma**: Alternancia Inglés/Español
5. **Integración de Chat**: Chat en vivo con equipo de ventas

---

## 📸 Capturas de Pantalla

*Agregar capturas de pantalla de páginas y características clave:*
- Sección hero de página de inicio
- Navegador de tipologías de propiedades
- Formulario de contacto
- Navegación móvil
- Mapa de amenidades

---

## 🏆 Aspectos Destacados del Proyecto

- **Arquitectura Limpia**: Sistema modular de componentes basado en slices
- **Impulsado por CMS**: 100% del contenido gestionable por no-desarrolladores
- **Stack Moderno**: Últimos patrones de React y características de Next.js
- **Enfoque en Rendimiento**: Generación estática para velocidad óptima
- **Optimización de Leads**: Múltiples puntos de contacto para conversión
- **Consistencia de Marca**: Implementación fiel del sistema de diseño

---

## 📄 Licencia

Este proyecto fue desarrollado para NEST Real Estate. Todos los derechos reservados.

---

*Documentación generada para fines de portafolio. Para consultas sobre proyectos similares, favor de contactar al desarrollador.*
