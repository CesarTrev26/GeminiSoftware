# 📋 Documentación del Proyecto WE2T

## 🏢 Descripción General del Proyecto

**WE2T** es un sitio web inmobiliario de alto impacto desarrollado para **NEST**, una empresa desarrolladora inmobiliaria con sede en Monterrey, Nuevo León, México. El proyecto presenta un desarrollo residencial de lujo ubicado en la zona de Valle Poniente, San Pedro Garza García.

### 🎯 Objetivo del Proyecto
Crear una experiencia digital premium que presente el desarrollo residencial WE2T, permitiendo a los prospectos explorar departamentos, amenidades y ubicación, además de generar leads a través de formularios de contacto integrados.

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión/Descripción |
|------------|---------------------|
| **HTML5** | Estructura semántica moderna |
| **CSS3** | Estilos avanzados con animaciones |
| **JavaScript** | ES6+ con jQuery |
| **Bootstrap** | v5.1.3 - Framework CSS responsivo |

### Librerías y Plugins
| Librería | Función |
|----------|---------|
| **jQuery** | v3.6.0 - Manipulación DOM y AJAX |
| **Owl Carousel** | Carruseles de imágenes interactivos |
| **SimpleLightbox** | Galería de imágenes con lightbox |
| **WOW.js** | Animaciones de scroll |
| **Animate.css** | Biblioteca de animaciones CSS |
| **Font Awesome** | v4.7.0 - Iconografía |
| **Bootstrap Icons** | v1.5.0 - Iconos adicionales |
| **TweenMax/GreenSock** | Animaciones avanzadas JavaScript |

### Backend
| Tecnología | Función |
|------------|---------|
| **PHP** | Procesamiento de formularios de contacto |
| **cURL** | Integración con Zapier para automatización |

### Integraciones de Marketing
- **Google Analytics** (GA4) - ID: G-7WJZDMKK6G
- **Google Tag Manager** - ID: GTM-NR3GDJR8
- **Meta Pixel (Facebook)** - ID: 550576749984059
- **Trengo Widget** - Chat en vivo
- **Zapier** - Automatización de leads

---

## 📁 Estructura del Proyecto

```
we2t-100225/
│
├── 📄 index.html              # Página principal
├── 📄 departamentos.html      # Catálogo de departamentos
├── 📄 amenidades.html         # Sección de amenidades
├── 📄 ubicacion.html          # Información de ubicación
├── 📄 contacto.html           # Formulario de contacto
├── 📄 skyliving.html          # Página Sky Living
├── 📄 gracias.html            # Página de agradecimiento (post-form)
│
├── 📁 assets/
│   ├── 📄 contact_form.php    # Procesador de formularios
│   ├── 📄 script.js           # Scripts personalizados
│   ├── 📄 style.css           # Estilos adicionales
│   ├── 📁 img/                # Imágenes del sitio
│   │   ├── 📁 icons/          # Iconografía
│   │   ├── 📁 portfolio/      # Galería de proyectos
│   │   └── 📁 tipologias/     # Planos de departamentos
│   └── 📁 video/              # Videos promocionales
│
├── 📁 css/
│   ├── 📄 styles.css          # Estilos principales (~16,699 líneas)
│   ├── 📄 animate2.css        # Animaciones personalizadas
│   ├── 📄 owl.carousel.min.css
│   ├── 📄 owl.theme.default.min.css
│   └── 📄 style2.css          # Estilos secundarios
│
├── 📁 js/
│   ├── 📄 scripts.js          # Scripts principales
│   ├── 📄 main.js             # Configuración Owl Carousel
│   ├── 📄 wow.js              # Animaciones scroll
│   ├── 📄 bootstrap.min.js
│   ├── 📄 jquery.min.js
│   ├── 📄 owl.carousel.min.js
│   └── 📄 popper.js
│
├── 📁 images/
│   ├── 📁 Amenidades/         # Fotos de amenidades
│   ├── 📁 Departamento/       # Fotos de departamentos
│   └── 📁 WE2T_Amenidades-Fotos/
│
└── 📁 landing/
    ├── 📄 index.html          # Landing page de preventa
    └── 📁 assets/             # Recursos de landing
```

---

## 🎨 Características de Diseño

### Sistema de Colores
```css
:root {
  --yellow: #E99E2C;        /* Amarillo principal */
  --orange: #BE6128;        /* Naranja corporativo */
  --red: #BF6128;           /* Rojo acento */
  --beige: rgb(212, 207, 193);  /* Beige fondo */
  --gray: #E1DACA;          /* Gris suave */
  --light-gray: #EFE9D8;    /* Gris claro */
  --white: #FFFFFF;         /* Blanco */
}
```

### Tipografías Personalizadas
- **Nexa Light** - Texto principal
- **Nexa Bold** - Títulos y énfasis
- **Nexa Heavy** - Destacados
- **Nexa Thin** - Textos sutiles
- **Gilroy Regular/Medium/Semibold** - Texto alternativo

### Diseño Responsivo
El sitio implementa un diseño **mobile-first** con breakpoints para:
- 📱 Móvil (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

---

## 📱 Páginas y Funcionalidades

### 1. Página Principal (`index.html`)
**Funcionalidades:**
- ✅ Video de fondo autoplay (versiones móvil y desktop)
- ✅ Sección hero con animaciones WOW.js
- ✅ Mapa interactivo de masterplan con 3 torres
- ✅ Lista de 38+ amenidades con tooltips
- ✅ Galería de amenidades con animaciones
- ✅ Puntos de interés cercanos
- ✅ Formulario de contacto integrado
- ✅ Botón flotante de WhatsApp

### 2. Departamentos (`departamentos.html`)
**Funcionalidades:**
- ✅ Navegación por tipologías con tabs
- ✅ Filtros por número de recámaras
- ✅ Filtros por funcionalidad (cuarto de servicio, estancia)
- ✅ Visor de planos interactivo
- ✅ Slider de imágenes por departamento
- ✅ 12+ tipologías de departamento:
  - Tipo D-E (79.12 m²) - 1 Recámara
  - Tipo A-H (116.90 m²) - 2 Recámaras
  - Tipo C-F (130.29 m²) - 2-3 Recámaras
  - Tipo K-M (142.12 m²) - 2-3 Recámaras
  - Tipo B-G (155.82 m²) - 2-3 Recámaras
  - Tipo L (158.47 m²) - 2-3 Recámaras
  - Tipo I (164.15 m²) - 2-3 Recámaras
  - Tipo J-N (180.89 m²) - 2-3 Recámaras
  - Residencia A-D (238.50 m²) - 3 Recámaras
  - Residencia B-C (245.59 m²) - 3 Recámaras
  - Penthouse A-D (397.75 m²) - 3 Recámaras
  - Penthouse B-C (395.47 m²) - 3 Recámaras

### 3. Amenidades (`amenidades.html`)
**Funcionalidades:**
- ✅ Header hero con carrusel de imágenes
- ✅ Mapa interactivo de amenidades por torre
- ✅ Collage de fotos con tours virtuales
- ✅ Integración con tours 360° externos

**Amenidades destacadas:**
- Fitness Center / Gym
- Flow Center (Yoga/Pilates)
- The French Room
- Lounges múltiples (Hole 19, T3, T4, T5, 21, 8 Ball)
- Paw Trails (áreas para mascotas)
- Albercas (Pool T3, T5)
- Kids Yards
- Arcade / Ludoteca
- Cinema
- Spa
- Simulador de Golf
- Poker Room
- Centro Culinario
- Padel Court
- Multiuse Court
- Y más...

### 4. Ubicación (`ubicacion.html`)
**Funcionalidades:**
- ✅ Mapa de puntos de interés
- ✅ Iconos de servicios cercanos
- ✅ Enlace a Google Maps
- ✅ Formulario de contacto

**Puntos de interés cercanos:**
- Comercios
- Cines
- Instituciones educativas
- Supermercados
- Consulado Americano

### 5. Contacto (`contacto.html`)
**Funcionalidades:**
- ✅ Formulario completo de lead generation
- ✅ Campos: Nombre, Email, Teléfono
- ✅ Selector de fuente de tráfico
- ✅ Campo de mensaje
- ✅ Validación de campos

### 6. Landing Page (`landing/index.html`)
**Funcionalidades:**
- ✅ Diseño minimalista de alto impacto
- ✅ Información de preventa
- ✅ CTA directo a WhatsApp
- ✅ Precios desde $9.4 MDP

---

## ⚙️ Sistema de Formularios

### Procesamiento PHP (`contact_form.php`)
```php
// Flujo de procesamiento:
1. Recepción de datos POST
2. Validación de campos
3. Envío de email a múltiples destinatarios
4. Integración con Zapier para CRM
5. Redirección a página de gracias
```

**Destinatarios configurados:**
- tere@nest.com.mx
- info@nest.com.mx
- Heidy.Gonzalez@nest.com.mx
- cesar.trevino@nest.com.mx
- natalia.armijo@nest.com.mx

**Campos del formulario:**
| Campo | Tipo | Requerido |
|-------|------|-----------|
| Nombre | text | ✅ |
| Email | email | ✅ |
| Teléfono | tel | ✅ |
| Fuente de tráfico | select | ✅ |
| Mensaje | textarea | ❌ |
| Otro | textarea | ❌ |

**Fuentes de tráfico rastreadas:**
- Anuncio en Desarrollo
- Anuncio Panorámico
- Anuncio Impreso en Periódico
- CHIC Magazine
- Sierra Madre Magazine
- Búsqueda en Google
- Facebook / Instagram
- Soy Cliente de NEST
- Evento Nest
- Recomendación
- Corredor Externo
- Email recibido
- YouTube / TikTok
- Otro

---

## 🎬 Animaciones y Efectos

### WOW.js Animaciones
- `slideInLeft` - Elementos entrando desde la izquierda
- `slideInRight` - Elementos entrando desde la derecha
- `slideInDown` - Elementos entrando desde arriba
- `slideInUp` - Elementos entrando desde abajo
- `bounceInUp` - Efecto rebote desde abajo

### Slideshow Personalizado
El archivo `script.js` implementa un slideshow avanzado con:
- Transiciones suaves entre slides
- Efecto parallax en scroll
- Navegación con flechas
- Paginación con dots
- Auto-play con pausa en hover

### Carrusel Owl Carousel
Configuración para galería de amenidades:
- Loop infinito
- Autoplay activo
- Navegación con flechas
- Indicadores de puntos
- Animaciones fade in/out

---

## 📊 Tracking y Analytics

### Google Analytics 4
```javascript
gtag('config', 'G-7WJZDMKK6G');
```

### Google Tag Manager
```javascript
GTM-NR3GDJR8
```

### Meta Pixel
```javascript
fbq('init', '550576749984059');
fbq('track', 'PageView');
```

---

## 📞 Integraciones de Comunicación

### WhatsApp Business
**Número:** +52 81 8660 1191
**Mensaje predeterminado:**
> "Hola, estuve viendo su página web y me interesa saber más acerca de los departamentos de WE2T!"

### Trengo Chat Widget
```javascript
window.Trengo.key = 'xPk1UDbhMyrJA1RKX9uu';
```

### Teléfono de contacto
**T.** 81 8378 0050

### Email
**info@nest.com.mx**

---

## 🌐 Información del Desarrollo

### Ubicación del Proyecto
**Dirección:** Prol. Alfonso Reyes No. 100, Valle Poniente
**Ciudad:** Monterrey, Nuevo León, México
**Coordenadas:** 25.662149, -100.442872

### Desarrolladores
- **NEST** - Desarrollador inmobiliario
- **GR** - Socio/Grupo

### Características del Desarrollo
- **Torres:** 5 torres (3, 4 y 5 en WE2T)
- **Niveles:** Hasta 26 pisos
- **Amenidades exteriores:** 6,204 m²
- **Amenidades interiores:** 3,104 m²
- **Parque:** 1,963 m²
- **Total de amenidades:** 38+

---

## 🚀 Características Técnicas Destacadas

### SEO Implementado
- ✅ Meta descriptions optimizadas
- ✅ Keywords relevantes para el mercado inmobiliario
- ✅ URLs amigables
- ✅ Estructura semántica HTML5
- ✅ Alt texts en imágenes

### Rendimiento
- ✅ Videos con `preload="none"` para carga diferida
- ✅ Imágenes con `loading="lazy"`
- ✅ CSS y JS minificados
- ✅ CDN para librerías externas

### Accesibilidad
- ✅ Labels en formularios
- ✅ Atributos ARIA
- ✅ Navegación por teclado
- ✅ Contraste de colores adecuado

### Seguridad
- ✅ CORS configurado para formularios
- ✅ Validación de inputs
- ✅ Sanitización de datos en PHP

---

## 📋 Mantenimiento y Actualizaciones

### Archivos de Configuración Principales
1. `css/styles.css` - Estilos globales
2. `assets/contact_form.php` - Configuración de emails
3. Scripts de tracking en headers HTML

### Variables a Actualizar Regularmente
- Precios de departamentos
- Disponibilidad de unidades
- Fotos de avance de obra
- Tours virtuales

---

## 👥 Créditos

**Cliente:** NEST Desarrollos  
**Ubicación:** Monterrey, N.L., México  
**Año:** 2022-2025  
**Copyright:** NEST / GR

---

## 📝 Notas Adicionales

- El proyecto utiliza múltiples videos optimizados para diferentes dispositivos
- Los tours virtuales están hospedados en plataformas externas (vrto.me, topsidefront.com, scannen.mx)
- El sistema de filtros de departamentos funciona con JavaScript vanilla
- El mapa interactivo de amenidades usa posicionamiento CSS absoluto con áreas clicables

---

*Documentación generada para portafolio de software*  
*Última actualización: Enero 2026*
