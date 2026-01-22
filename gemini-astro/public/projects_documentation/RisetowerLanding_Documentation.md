# RISE TOWER - Landing Page

## 📋 Descripción del Proyecto

**RISE TOWER** es una landing page moderna y elegante diseñada para promocionar el proyecto inmobiliario más ambicioso de Latinoamérica: la torre residencial más alta del continente con 475 metros de altura ubicada en Monterrey, México.

Este sitio web presenta una experiencia visual impactante que combina animaciones fluidas, diseño responsivo y un formulario de contacto funcional para capturar leads de potenciales compradores interesados en departamentos de lujo.

## 🎯 Objetivo

Crear una presencia digital premium que refleje la exclusividad y magnificencia del proyecto RISE, proporcionando información clave sobre el desarrollo inmobiliario y facilitando el contacto directo con prospectos interesados.

## ✨ Características Principales

### 🎨 Diseño y Experiencia de Usuario
- **Diseño Minimalista y Elegante**: Paleta de colores neutros (#E4DDD7) con acentos dorados (#DC9B28)
- **Animaciones Suaves**: Implementación de AOS (Animate On Scroll) para efectos visuales al hacer scroll
- **Scroll Snap**: Experiencia de navegación fluida con anclaje automático de secciones
- **Cursor Personalizado**: Icono circular amarillo que mejora la experiencia visual
- **Tipografía Custom**: Familia tipográfica "Origin" (Light, Regular, Bold, Heavy) para una identidad visual única

### 📱 Tecnologías Implementadas
- **HTML5**: Estructura semántica y optimizada
- **CSS3**: Estilos avanzados con variables CSS, animaciones keyframes y grid layout
- **JavaScript Vanilla**: Funcionalidades interactivas sin dependencias pesadas
- **PHP**: Backend para procesamiento de formularios de contacto
- **Swiper.js**: Carrusel de imágenes fluido y responsivo
- **AOS Library**: Animaciones al hacer scroll

### 🏢 Secciones del Sitio

#### 1. **Header Fijo**
- Logo de RISE
- Eslogan bilingüe: "Experience the highest tower in latin america"
- Información de metros cuadrados disponibles (50-200m²)
- Enlaces de navegación: "Más información" y "Contacto"

#### 2. **Hero Section con Animación de Palabras**
Texto animado que alterna entre:
- LIVE
- REACH
- DREAM
- GO
- **HIGHER** (palabra principal)

Incluye imagen del edificio con efecto fade-up y botón scroll down animado.

#### 3. **Sección Informativa**
Presenta el concepto del proyecto:
- "Un nuevo ícono se eleva en Monterrey"
- Descripción del proyecto como la torre residencial más alta de Latinoamérica
- Call-to-action: "Vive más alto"

#### 4. **Carrusel de Lifestyle** 
Palabras animadas que alternan:
- FLOW
- TASTE
- AIM
- **HIGHER**

Carrusel Swiper con imágenes de estilo de vida y amenidades.

#### 5. **Especificaciones Técnicas**
Información detallada del proyecto:
- 475m de altura
- 34 niveles de oficinas
- 8 niveles de hotel
- 21 niveles de departamentos
- 4 niveles de comercio
- Más de 4,300m² de áreas verdes
- Más de 8,000m² de amenidades

#### 6. **Formulario de Contacto**
Campos del formulario:
- Nombre (requerido)
- Correo electrónico (requerido)
- Teléfono (requerido)
- ¿Cómo te enteraste del proyecto? (select con múltiples opciones)
- Campo condicional "Otro" que aparece dinámicamente
- Mensaje (textarea)
- Checkbox de aceptación de privacidad (requerido)
- Botón de envío con animación

#### 7. **Footer**
- Logos de Ancore Group y NEST
- Enlaces de contacto: RiseTower.mx y número telefónico (81 8378 0050)

### 🔧 Funcionalidades JavaScript

#### Efecto Parallax Responsivo
```javascript
window.addEventListener('scroll', () => {
    // Calcula la visibilidad del hero basado en el scroll
    // Diferentes breakpoints para móvil, tablet, desktop y pantallas anchas
    // Oculta/muestra elementos según el scroll del usuario
});
```

#### Formulario Dinámico
```javascript
function showHide(elm) {
    // Muestra campo de texto adicional si el usuario selecciona "Otro"
    // Gestiona el atributo 'required' dinámicamente
}
```

### 📧 Sistema de Envío de Correos (PHP)

El archivo `mail.php` procesa los datos del formulario y:
- Captura información del prospecto (nombre, email, teléfono, mensaje)
- Registra la fuente de referencia (cómo conoció el proyecto)
- Envía email a múltiples destinatarios:
  - tere@nest.com.mx
  - info@nest.com.mx
  - Heidy.Gonzalez@nest.com.mx
  - cesar.trevino@nest.com.mx
- Muestra página de confirmación con mensaje de agradecimiento
- Redirige de vuelta al sitio principal

### 🎨 Paleta de Colores

| Color | Código Hex | Uso |
|-------|-----------|-----|
| Beige Principal | `#E4DDD7` | Fondo general |
| Oro/Amarillo | `#DC9B28` | Acentos, CTAs, hover states |
| Negro | `#000000` | Textos principales |
| Gris Oscuro | `#221F1F` (rgb 34,31,31) | Footer, sección de contacto |
| Beige Claro | `#BAAFAA` | Textos secundarios |
| Blanco | `#FFFFFF` | Textos en secciones oscuras |

### 📐 Grid Responsivo

El header utiliza CSS Grid con 3 columnas:
```css
grid-template-columns: 10% 63% 27%;
```
- 10%: Logo
- 63%: Información central
- 27%: Enlaces de navegación

### 🎬 Animaciones CSS

#### Animación de Palabras Rotativas
```css
@keyframes spin_words {
    /* Transiciones suaves entre 4 palabras diferentes */
    /* Duración: 13 segundos en loop infinito */
    /* Dirección: alternate-reverse para efecto fluido */
}
```

#### Swiper Carousel
Configuración personalizada:
- Velocidad de transición: 2500ms
- Autoplay activo
- Loop infinito
- Efecto creativo con slides deslizándose desde la derecha
- Pagination clickeable

### 🔌 Integraciones de Terceros

1. **Trengo Chat Widget**: Sistema de chat en vivo para atención al cliente
2. **AOS (Animate On Scroll)**: Biblioteca para animaciones al hacer scroll
3. **Swiper.js**: Carrusel de imágenes/contenido
4. **Google Fonts Preload**: Optimización de carga de tipografías

## 📂 Estructura de Archivos

```
Risetower-Landing/
│
├── index.html                 # Página principal
├── mail.php                   # Procesador de formulario
├── error_log                  # Log de errores del servidor
│
├── assets/
│   ├── fonts/                 # Tipografía Origin (Light, Regular, Bold, Heavy)
│   │   ├── Origin-Light.ttf
│   │   ├── Origin-Regular.ttf
│   │   ├── Origin-Bold.ttf
│   │   └── Origin-Heavy.ttf
│   │
│   ├── img/                   # Imágenes del proyecto
│   │   ├── NEST_Rise-logo.png
│   │   ├── RISE_2-Low.png
│   │   ├── torre-2-semicut.png
│   │   ├── RISE_5-(low1).jpg
│   │   ├── AIM_DREAM.jpg
│   │   ├── TASTE.jpg
│   │   ├── FLOW-1.jpg
│   │   ├── Ancore-group-.png
│   │   ├── Nest-logo.png
│   │   ├── Rise-favicon.png
│   │   ├── icone-cercle-jaune3.png (cursor personalizado)
│   │   └── Palito y bolita 2.png
│   │
│   └── Js/
│       └── js.js              # JavaScript principal
│
└── styles/
    ├── normalize.css          # CSS reset para consistencia entre navegadores
    └── styles.css             # Estilos principales (1294 líneas)
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Servidor web con soporte PHP (Apache/Nginx)
- PHP 7.0 o superior
- Función `mail()` configurada en el servidor

### Pasos de Instalación

1. **Clonar o descargar el proyecto** en el directorio del servidor web
   ```bash
   /var/www/html/risetower-landing/
   ```

2. **Configurar permisos** para el directorio de archivos
   ```bash
   chmod 755 -R risetower-landing/
   ```

3. **Configurar PHP mail()** 
   Editar `mail.php` si necesitas cambiar los destinatarios de correo:
   ```php
   $recipient = 'tu-email@dominio.com';
   ```

4. **Configurar dominio o subdominio**
   Apuntar al archivo `index.html` como página principal

5. **Verificar funcionamiento**
   - Navegar a `http://tu-dominio.com`
   - Probar formulario de contacto
   - Verificar animaciones y responsive design

## 🌐 Compatibilidad de Navegadores

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Opera 76+

## 📱 Responsive Breakpoints

El sitio está optimizado para los siguientes breakpoints:

- **Móvil**: < 767px
- **Tablet**: 768px - 1024px
- **Desktop**: 1025px - 1400px
- **Wide Screen**: > 1400px

## ⚡ Optimizaciones Implementadas

1. **Preload de CSS**: `<link rel="preload">` para carga más rápida
2. **Lazy Loading**: Animaciones AOS solo se ejecutan cuando son visibles
3. **CSS Grid**: Layout eficiente y moderno
4. **Scroll Behavior Smooth**: Navegación fluida entre secciones
5. **Overscroll Behavior**: Evita rebote en móviles
6. **Cursor personalizado**: Mejora la experiencia visual

## 🎯 Métricas de Conversión

El formulario captura las siguientes fuentes de tráfico:
- Anuncio en Desarrollo
- Anuncio Panorámico
- Anuncio Impreso en Periódico/Revista
- Búsqueda en Google
- Facebook
- Instagram
- Soy Cliente de NEST
- Evento Nest
- Recomendación
- Corredor Externo
- Recibí un email
- YouTube
- Otro (campo de texto libre)

## 🔒 Seguridad

- Validación de formularios en frontend (HTML5 required attributes)
- Codificación UTF-8 para caracteres especiales
- Sanitización básica de inputs en PHP
- HTTPS recomendado para producción

## 🎨 Créditos de Diseño

- **Desarrollador**: NEST / Ancore Group
- **Tipografía**: Origin (Custom Font Family)
- **Bibliotecas**: AOS, Swiper.js
- **Chat Widget**: Trengo

## 📞 Información de Contacto

- **Website**: [risetower.mx](https://risetower.mx)
- **Teléfono**: +52 81 8378 0050
- **Email**: info@nest.com.mx

## 🏆 Características Destacadas para Portfolio

1. ✨ **Diseño Premium**: Estética minimalista con animaciones sofisticadas
2. 🎬 **Animaciones Complejas**: Keyframes CSS personalizados y AOS integration
3. 📱 **100% Responsivo**: Adaptado a todos los dispositivos
4. 🎨 **Branding Consistente**: Identidad visual coherente en todo el sitio
5. 🚀 **Performance**: Optimizado para carga rápida
6. 📧 **Funcional**: Sistema de contacto completamente operativo
7. 🎯 **UX Excelente**: Navegación intuitiva con scroll snap
8. 💼 **Caso Real**: Proyecto inmobiliario de alto valor (475m de altura)

## 📝 Notas Técnicas Adicionales

### Cursor Personalizado
```css
cursor: url("../assets/img/icone-cercle-jaune3.png") 25 25, auto;
```

### Scroll Snap
```css
scroll-snap-type: y mandatory;
scroll-snap-align: start/center;
```

### Variables CSS
```css
:root {
  --swiper-theme-color: #FFFFFF!important;
}
```

## 🔄 Actualizaciones Futuras Sugeridas

- [ ] Implementar Google Analytics para tracking
- [ ] Agregar validación backend más robusta en PHP
- [ ] Implementar reCAPTCHA para prevenir spam
- [ ] Optimizar imágenes con WebP y lazy loading nativo
- [ ] Agregar meta tags para SEO y redes sociales
- [ ] Implementar PWA (Progressive Web App)
- [ ] Agregar tour virtual 360° del edificio
- [ ] Integrar CRM para gestión automática de leads

---

## 📄 Licencia

© 2025 NEST / Ancore Group. Todos los derechos reservados.

---

**Desarrollado para el proyecto inmobiliario más ambicioso de Latinoamérica** 🏙️✨
