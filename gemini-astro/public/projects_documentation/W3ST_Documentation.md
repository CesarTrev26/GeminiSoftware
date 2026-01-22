# 📋 Documentación del Proyecto - W3ST Website

## 🏢 Información General del Proyecto

| Campo | Descripción |
|-------|-------------|
| **Nombre del Proyecto** | W3ST - Sitio Web Inmobiliario |
| **Cliente** | GRUPO NEST, S.C. |
| **Tipo de Proyecto** | Sitio Web de Marketing Inmobiliario / Landing Page |
| **Industria** | Desarrollo Inmobiliario / Bienes Raíces |
| **Ubicación del Desarrollo** | Valle Poniente, Monterrey, Nuevo León, México |

---

## 📝 Descripción del Proyecto

Sitio web profesional desarrollado para **W3ST**, un exclusivo proyecto residencial de **NEST** ubicado en Valle Poniente, Monterrey. El sitio funciona como herramienta principal de marketing digital para la preventa de departamentos de lujo, integrando un diseño visual premium con funcionalidades interactivas que facilitan la generación de leads y la presentación del proyecto inmobiliario.

### Concepto del Proyecto Inmobiliario
W3ST representa "el último destello de un resplandeciente concepto de vida", un desarrollo que incluye:
- **3 torres residenciales** de 13, 16 y 21 niveles
- **110,000 m²** de construcción total
- **5 tipologías de departamentos** (98m² a 135m²)
- **3,800 m²** de amenidades interiores
- **8,000 m²** de amenidades exteriores
- **1,000 m²** de parque natural exclusivo

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica del sitio |
| **CSS3** | Estilos, animaciones y diseño responsive |
| **JavaScript (Vanilla)** | Interactividad, sliders, navegación dinámica |
| **Bootstrap Icons** | Iconografía |
| **Font Awesome** | Iconos adicionales (WhatsApp, redes sociales) |

### Backend
| Tecnología | Uso |
|------------|-----|
| **PHP** | Procesamiento del formulario de contacto |
| **SendGrid API** | Envío de correos electrónicos transaccionales |
| **PHPMailer** | Librería alternativa para envío de emails |

### Integraciones de Terceros
| Servicio | Función |
|----------|---------|
| **Google Tag Manager** | Gestión de etiquetas y scripts |
| **Google Analytics** | Análisis de tráfico y conversiones |
| **Google Ads** | Seguimiento de conversiones publicitarias |
| **Google reCAPTCHA v2** | Protección anti-spam en formularios |
| **WhatsApp Business API** | Botón de contacto directo |

---

## 📁 Estructura del Proyecto

```
W3ST Website/
├── 📄 index.html              # Página principal (Home)
├── 📄 Departamentos.html      # Catálogo de tipologías de departamentos
├── 📄 Amenidades.html         # Showcase de amenidades del proyecto
├── 📄 tetecoloh.html          # Landing page promocional (colaboración)
├── 📄 mail.php                # Backend para procesamiento de formularios
│
├── 📁 css/
│   ├── styles.css             # Estilos principales (3,147 líneas)
│   ├── normalize.css          # Reset CSS para consistencia cross-browser
│   └── landing.css            # Estilos específicos para landing pages
│
├── 📁 js/
│   └── js.js                  # JavaScript principal (522 líneas)
│
├── 📁 img/                    # Recursos gráficos (+120 archivos)
│   ├── landing-slider/        # Imágenes del carrusel
│   └── orientacion/           # Planos de orientación de departamentos
│
├── 📁 fonts/                  # Tipografías personalizadas
│   ├── Garet Book.ttf
│   ├── Garet-Bold.otf
│   └── NexaHeavyRegular.woff2
│
├── 📁 pdf/                    # Documentos descargables
│
├── 📁 sendgrid-php/           # SDK de SendGrid para PHP
│
└── 📁 srcphp/                 # Clases PHP adicionales (PHPMailer)
```

---

## 🎨 Características de Diseño

### Paleta de Colores
| Variable CSS | Color | Uso |
|--------------|-------|-----|
| `--dark-green` | #0D3831 | Color primario (textos, acentos) |
| `--green` | #6BA038 | Color secundario (CTA, detalles) |
| `--gray` | #F4EFEE | Fondo principal |
| `--white` | #FFFFFF | Fondos alternativos, textos |

### Tipografías
- **Garet Book** - Tipografía principal para textos
- **Garet Bold** - Encabezados y énfasis
- **Nexa Heavy** - Elementos destacados

### Diseño Responsive
El sitio implementa un diseño adaptativo completo:
- **Desktop**: Experiencia completa con navegación horizontal
- **Tablet**: Adaptaciones intermedias
- **Mobile**: Navegación hamburger, layouts verticales

---

## ⚙️ Funcionalidades Principales

### 1. Navegación Inteligente
- Header sticky con efecto de scroll
- Navegación hamburger para móviles
- Smooth scrolling hacia secciones
- Cambio dinámico de colores según posición

### 2. Slider de Tipologías de Departamentos
```javascript
// Sistema de pestañas para mostrar diferentes tipologías
- Tipo 02 y 04 (98m², 2 recámaras, 2 baños)
- Tipo 07 y 08 (98m², 2 recámaras, 2 baños)
- Tipo 03 (características específicas)
- Tipo 05 y 06 (características específicas)
- Tipo 01 y 09 (características específicas)
```

### 3. Mapa Interactivo de Amenidades
- Visualización del plano del conjunto
- Highlights interactivos por torre (A, B, C)
- Numeración de amenidades interiores y exteriores
- Listado categorizado de servicios

### 4. Sección de Ubicación
- Mapa personalizado del área
- Puntos de interés cercanos categorizados:
  - Comercios
  - Educación
  - Supermercados
  - Otros servicios

### 5. Formulario de Contacto con CRM Integration
- Campos capturados:
  - Nombre completo
  - Correo electrónico
  - Teléfono
  - Fuente de adquisición (tracking de marketing)
  - Mensaje personalizado
- Protección con reCAPTCHA
- Envío automático a múltiples destinatarios vía SendGrid

### 6. Integración de WhatsApp Business
- Botón flotante permanente
- Mensaje predefinido para inicio de conversación
- Conexión directa con equipo de ventas

### 7. Carrusel de Imágenes (Landing Tetecoloh)
- Navegación con flechas
- Indicadores de posición (dots)
- Lazy loading para optimización
- Accesibilidad con ARIA labels

---

## 📊 Tracking y Analytics

### Eventos de Conversión Configurados
```javascript
// Google Ads Conversion Tracking
gtag('event', 'conversion', {
    'send_to': 'AW-16840788811/5r8uCJjj55UaEMuWqN4-',
    'value': 1.0,
    'currency': 'MXN'
});
```

### KPIs Monitoreados
- Envío de formularios de contacto
- Clics en botón de WhatsApp
- Navegación entre secciones
- Tiempo de permanencia
- Interacciones con sliders y tipologías

---

## 🔧 Configuración del Backend (mail.php)

### Proceso de Envío de Correos
1. Validación de método POST
2. Sanitización de datos del formulario
3. Construcción del mensaje con template
4. Envío mediante SendGrid API
5. Distribución a múltiples destinatarios:
   - Equipo de ventas
   - Administración
   - Marketing

### Estructura del Email Generado
```
Cliente: [Nombre]
Email: [Correo]
Número de teléfono: [Teléfono]
¿Cómo te enteraste del proyecto?: [Fuente]
Mensaje: [Contenido]

Formulario de Contacto - Página Web - W3ST
```

---

## 🖼️ Recursos Multimedia

### Renders 3D Incluidos
- Vistas exteriores del desarrollo
- Área de asadores
- Piscina
- Gimnasio
- Áreas lounge
- Plantas arquitectónicas de cada tipología

### Elementos Gráficos
- Logotipos (W3ST, NEST, GR)
- Iconos de redes sociales
- Mapas personalizados
- Planos de orientación
- Imágenes de amenidades

---

## 📱 Secciones del Sitio

### Página Principal (index.html)
1. **Hero Section** - Banner principal con CTA
2. **Información del Proyecto** - Estadísticas clave
3. **Galería de Renders** - Visualización del desarrollo
4. **Mapa de Ubicación** - Localización y puntos de interés
5. **NEST Living** - Concepto de vida
6. **Formulario de Contacto** - Generación de leads
7. **Footer** - Información de contacto y redes sociales

### Departamentos (Departamentos.html)
- Sistema de pestañas por tipología
- Slider de plantas arquitectónicas 3D
- Especificaciones técnicas por tipo
- CTAs directos a WhatsApp para cotización

### Amenidades (Amenidades.html)
- Plano interactivo del conjunto
- Amenidades por torre:
  - **Torre A**: Gimnasio, Family dining, Salas de reserva, Lounge/Cowork
  - **Torre B**: Amenidades específicas
  - **Torre C**: Amenidades específicas
- Amenidades exteriores

### Landing Tetecoloh (tetecoloh.html)
- Colaboración promocional con cafetería Tetecoloh
- Carrusel de imágenes del proyecto
- CTAs a sitio principal y WhatsApp

---

## 🚀 Optimizaciones Implementadas

### Performance
- **Preload** de recursos críticos (CSS, imágenes hero)
- **Lazy loading** de imágenes secundarias
- Formatos de imagen optimizados (WebP con fallback a JPG)
- CSS minificado y organizado por secciones

### SEO
- Meta tags optimizados para búsquedas locales
- Keywords específicas del sector inmobiliario
- Estructura semántica HTML5
- Alt text descriptivo en imágenes

### Accesibilidad
- ARIA labels en elementos interactivos
- Navegación por teclado
- Contraste de colores adecuado
- Textos alternativos en imágenes

---

## 📞 Información de Contacto del Proyecto

| Canal | Información |
|-------|-------------|
| **Teléfono** | 81 8387 0050 |
| **Email** | info@nest.com.mx |
| **WhatsApp** | +52 81 8660 1191 |
| **Dirección** | Av. Morones Prieto no. 1050, Valle Poniente |
| **Instagram** | @west3.mx |
| **Facebook** | W3ST |
| **YouTube** | @nest.living |

---

## 🏆 Resultados y Métricas de Éxito

### Objetivos del Sitio
- ✅ Generación de leads calificados para el equipo de ventas
- ✅ Presentación profesional del proyecto inmobiliario
- ✅ Facilitar el contacto directo con prospectos
- ✅ Tracking completo del embudo de conversión
- ✅ Experiencia de usuario premium acorde al producto

---

## 👨‍💻 Créditos de Desarrollo

**Desarrollado por:** César Treviño  
**Para:** GRUPO NEST, S.C.  
**Año:** 2025

---

## 📋 Notas Técnicas para Mantenimiento

### Actualización de Contenido
- Imágenes en `/img/` - Mantener nomenclatura existente
- Textos editables directamente en HTML
- Estilos en `/css/styles.css`

### Formulario de Contacto
- API Key de SendGrid configurada en `mail.php`
- Lista de destinatarios editable en el archivo PHP
- reCAPTCHA site key configurable en HTML

### Analytics
- Google Tag Manager ID: `GTM-5W8WHPWC`
- Google Ads ID: `AW-16840788811`

---

*Documentación generada para portafolio de desarrollo web - Enero 2026*
