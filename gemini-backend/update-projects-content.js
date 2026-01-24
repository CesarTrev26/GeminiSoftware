// Script to update projects with enhanced content from documentation
// Run with: node update-projects-content.js

const projectUpdates = [
  {
    slug: 'anida-sitio-inmobiliario',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🎯 El Desafío</h3>
        <p>Crear una presencia digital premium que refleje la exclusividad del desarrollo residencial ANIDA en Monterrey, México. El sitio debía combinar elegancia visual con funcionalidad avanzada para generar leads cualificados y ofrecer una experiencia de usuario excepcional.</p>`
      },
      {
        type: 'highlight',
        content: `<p>Portal inmobiliario de alto impacto con <strong>recorridos virtuales 3D</strong>, optimización de conversión y tiempos de carga ultrarrápidos que logró un <strong>+180% en generación de leads</strong>.</p>`
      },
      {
        type: 'two-column',
        left: `<h3>✨ Experiencia Premium</h3>
        <ul>
          <li><strong>Recorridos Virtuales 3D:</strong> Exploración inmersiva de cada tipología</li>
          <li><strong>Animaciones Fluidas:</strong> Framer Motion para transiciones elegantes</li>
          <li><strong>CMS Headless:</strong> Prismic para actualizaciones sin código</li>
          <li><strong>Diseño Responsivo:</strong> Experiencia optimizada móvil y desktop</li>
        </ul>`,
        right: `<h3>📊 Optimización y Analítica</h3>
        <ul>
          <li><strong>Performance 95+:</strong> Tiempos de carga ultrarrápidos</li>
          <li><strong>Conversión Optimizada:</strong> Formularios estratégicamente ubicados</li>
          <li><strong>Tracking Avanzado:</strong> GTM, Facebook Pixel, Zapier</li>
          <li><strong>SEO Top 3:</strong> Posicionamiento premium en Google</li>
        </ul>`
      },
      {
        type: 'cards',
        card1Title: 'Frontend Moderno',
        card1Content: `<ul>
          <li>Next.js 12.2.3</li>
          <li>React 18.2.0</li>
          <li>TypeScript 4.7.4</li>
          <li>Tailwind CSS + SASS</li>
          <li>Framer Motion</li>
        </ul>`,
        card2Title: 'CMS & Backend',
        card2Content: `<ul>
          <li>Prismic CMS</li>
          <li>SendGrid API</li>
          <li>Google Tag Manager</li>
          <li>Zapier Integration</li>
        </ul>`,
        card3Title: 'Performance',
        card3Content: `<ul>
          <li>Score 95+ Lighthouse</li>
          <li>Swiper Carousels</li>
          <li>Image Optimization</li>
          <li>SEO Avanzado</li>
        </ul>`
      }
    ]),
  },
  {
    slug: 'we2t-desarrollo-inmobiliario',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🏢 Desarrollo de Alto Impacto</h3>
        <p>WE2T es un desarrollo residencial premium ubicado en Valle Poniente, San Pedro Garza García. El reto era crear una experiencia digital que reflejara la exclusividad del proyecto y capturara leads cualificados a través de una experiencia visual impactante.</p>`
      },
      {
        type: 'two-column',
        left: `<h3>✨ Experiencia Visual Premium</h3>
        <ul>
          <li><strong>Video Autoplay:</strong> Hero sections con video de fondo</li>
          <li><strong>Animaciones GSAP:</strong> Transiciones fluidas y profesionales</li>
          <li><strong>Galerías Interactivas:</strong> Owl Carousel + SimpleLightbox</li>
          <li><strong>Catálogo Completo:</strong> 12+ tipologías con planos detallados</li>
        </ul>`,
        right: `<h3>🚀 Conversión y Marketing</h3>
        <ul>
          <li><strong>Chat en Vivo:</strong> Widget Trengo integrado</li>
          <li><strong>Automatización Zapier:</strong> Leads en tiempo real al CRM</li>
          <li><strong>Analytics GA4:</strong> Seguimiento avanzado de conversiones</li>
          <li><strong>Meta Pixel:</strong> Remarketing estratégico</li>
        </ul>`
      },
      {
        type: 'highlight',
        content: `<p>Portal inmobiliario que logró <strong>+200% en generación de leads</strong>, <strong>+45% en tiempo en sitio</strong> y una reducción del <strong>-30% en bounce rate</strong> gracias a su diseño cautivador y funcionalidad estratégica.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Frontend & UI',
        card1Content: `<ul>
          <li>HTML5 + CSS3</li>
          <li>Bootstrap 5.1.3</li>
          <li>jQuery 3.6.0</li>
          <li>WOW.js + Animate.css</li>
        </ul>`,
        card2Title: 'Animaciones',
        card2Content: `<ul>
          <li>GSAP/TweenMax</li>
          <li>Owl Carousel</li>
          <li>SimpleLightbox</li>
          <li>Scroll Animations</li>
        </ul>`,
        card3Title: 'Backend & Analytics',
        card3Content: `<ul>
          <li>PHP + cURL</li>
          <li>Zapier Integration</li>
          <li>Google Analytics GA4</li>
          <li>GTM + Meta Pixel</li>
        </ul>`
      }
    ]),
  },
  {
    slug: 'nest-sitio-corporativo',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🏢 Sitio Corporativo Premium</h3>
        <p>NEST es el sitio web corporativo de una desarrolladora inmobiliaria mexicana líder. El proyecto presenta un portafolio completo de propiedades con navegación intuitiva, animaciones fluidas y arquitectura escalable que soporta crecimiento continuo.</p>`
      },
      {
        type: 'two-column',
        left: `<h3>🚀 Tecnología de Vanguardia</h3>
        <ul>
          <li><strong>Next.js 13.2:</strong> SSR/SSG para máximo rendimiento</li>
          <li><strong>TypeScript 5.0:</strong> Código robusto y mantenible</li>
          <li><strong>Framer Motion:</strong> Animaciones fluidas y elegantes</li>
          <li><strong>Tailwind CSS:</strong> Diseño responsivo utility-first</li>
        </ul>`,
        right: `<h3>📊 CMS y Backend</h3>
        <ul>
          <li><strong>Contentful CMS:</strong> Gestión de contenido headless</li>
          <li><strong>Supabase:</strong> Backend as a Service robusto</li>
          <li><strong>SendGrid:</strong> Transactional emails confiables</li>
          <li><strong>API Routes:</strong> Endpoints serverless optimizados</li>
        </ul>`
      },
      {
        type: 'highlight',
        content: `<p>Performance <strong>98/100</strong> y SEO Score <strong>95/100</strong> en Lighthouse. El sitio gestiona <strong>12+ proyectos</strong> activos y generó un incremento del <strong>+250% en leads</strong> gracias a su arquitectura optimizada.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Características',
        card1Content: `<ul>
          <li>Portafolio dinámico</li>
          <li>Carruseles interactivos</li>
          <li>Sistema de encuestas</li>
          <li>Blog y noticias</li>
          <li>Nest Living concept</li>
        </ul>`,
        card2Title: 'UI/UX Premium',
        card2Content: `<ul>
          <li>Swiper carousels</li>
          <li>React Slick</li>
          <li>React Waypoint</li>
          <li>Masonry layouts</li>
          <li>Google Maps integration</li>
        </ul>`,
        card3Title: 'Optimización',
        card3Content: `<ul>
          <li>Image optimization</li>
          <li>Code splitting</li>
          <li>Lazy loading</li>
          <li>Cache strategies</li>
          <li>SEO avanzado</li>
        </ul>`
      }
    ]),
  },
  {
    slug: 'sistema-entregas-nest',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🏛️ Sistema de Gestión Inmobiliaria</h3>
        <p>Aplicación web empresarial que centraliza la gestión de entregas de proyectos inmobiliarios, transformando un proceso fragmentado en un sistema integrado y eficiente para NEST Desarrollo Inmobiliario.</p>`
      },
      {
        type: 'two-column',
        left: `<h3>🔴 Problemática Resuelta</h3>
        <ul>
          <li>Gestión fragmentada de información</li>
          <li>Dificultad en seguimiento de entregas</li>
          <li>Administración dispersa de garantías</li>
          <li>Comunicación ineficiente con compradores</li>
          <li>Control deficiente de archivos y planos</li>
        </ul>`,
        right: `<h3>✅ Solución Implementada</h3>
        <ul>
          <li>Dashboard centralizado con estadísticas</li>
          <li>Portal de clientes personalizado</li>
          <li>Gestión automatizada de garantías</li>
          <li>Sistema de notificaciones email</li>
          <li>Carga masiva y organización de archivos</li>
        </ul>`
      },
      {
        type: 'cards',
        card1Title: 'Funcionalidades Core',
        card1Content: `<ul>
          <li>CRUD completo de entidades</li>
          <li>Roles diferenciados Admin/Cliente</li>
          <li>Dashboard estadístico en tiempo real</li>
          <li>Búsqueda AJAX instantánea</li>
          <li>Filtros dinámicos avanzados</li>
        </ul>`,
        card2Title: 'Sistema de Garantías',
        card2Content: `<ul>
          <li>Folios automáticos por proyecto</li>
          <li>Seguimiento de estados</li>
          <li>Historial completo de reportes</li>
          <li>Notificaciones por email</li>
          <li><strong>1,200+</strong> garantías gestionadas</li>
        </ul>`,
        card3Title: 'Gestión Documental',
        card3Content: `<ul>
          <li>Carga masiva de archivos</li>
          <li>Clasificación automática</li>
          <li>Optimización de PDFs</li>
          <li>Planos y manuales digitales</li>
          <li>Videos tutoriales por depto</li>
        </ul>`
      },
      {
        type: 'highlight',
        content: `<p>Sistema que gestiona <strong>8+ proyectos</strong>, <strong>500+ departamentos</strong> y <strong>1,200+ garantías</strong>, reduciendo el tiempo de respuesta en <strong>-50%</strong> y mejorando significativamente la satisfacción del cliente.</p>`
      },
      {
        type: 'text',
        content: `<h3>🛠️ Arquitectura Técnica</h3>
        <p><strong>Backend:</strong> Desarrollado en <strong>PHP 8+</strong> con arquitectura <strong>MVC</strong> limpia, <strong>MySQL</strong> para persistencia, y <strong>Composer</strong> para gestión de dependencias. Integra <strong>SendGrid</strong> para notificaciones y <strong>PHPDotenv</strong> para configuración segura.</p>
        <p><strong>Frontend:</strong> Construido con <strong>HTML5, CSS3, SASS/SCSS</strong> para estilos modulares, <strong>JavaScript ES6+</strong> y <strong>jQuery</strong> para interactividad. <strong>Gulp</strong> automatiza la compilación de assets y optimización de recursos.</p>`
      }
    ]),
  },
  {
    slug: 'natures-factory-ecommerce',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🌿 E-Commerce de Productos Naturales</h3>
        <p>Tienda en línea robusta y escalable construida sobre Shopify para venta de suplementos alimenticios, vitaminas y productos naturales. Proyecto de largo plazo con mantenimiento continuo desde 2023.</p>`
      },
      {
        type: 'highlight',
        content: `<p>Plataforma que logró <strong>+180% en ventas</strong>, maneja <strong>200+ productos</strong>, sirve a <strong>10,000+ clientes</strong> y mantiene una tasa de conversión del <strong>3.8%</strong> - superior al promedio de la industria.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Experiencia de Compra',
        card1Content: `<ul>
          <li><strong>Carrito AJAX:</strong> Sin recargas de página</li>
          <li><strong>QuickShop:</strong> Vista rápida de productos</li>
          <li><strong>Búsqueda en Vivo:</strong> Resultados instantáneos</li>
          <li>Autocompletado inteligente</li>
          <li>Filtros avanzados por categoría</li>
        </ul>`,
        card2Title: 'Funcionalidades Premium',
        card2Content: `<ul>
          <li><strong>Sistema de Videos:</strong> Tipo Instagram Reels</li>
          <li><strong>Nature Rewards:</strong> Programa de puntos</li>
          <li><strong>Portal de Cliente:</strong> Dashboard personalizado</li>
          <li>Multiidioma ES/EN</li>
          <li>Wishlist y Comparar productos</li>
        </ul>`,
        card3Title: 'Optimización',
        card3Content: `<ul>
          <li>InstantPage.js precarga</li>
          <li>Imágenes WebP optimizadas</li>
          <li>Lazy loading inteligente</li>
          <li>CDN Shopify global</li>
          <li>Cache optimizado</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>🛍️ Catálogo y Productos</h3>
        <ul>
          <li>Gestión avanzada de variantes</li>
          <li>Control de inventario en tiempo real</li>
          <li>Colecciones dinámicas</li>
          <li>Productos relacionados inteligentes</li>
          <li>Badges de promociones automáticos</li>
        </ul>`,
        right: `<h3>📊 Analytics y Marketing</h3>
        <ul>
          <li>Klaviyo Email Marketing & SMS</li>
          <li>Yoast SEO optimizado</li>
          <li>Facebook Pixel para remarketing</li>
          <li>Google Analytics avanzado</li>
          <li>Flujos de abandono de carrito</li>
        </ul>`
      },
      {
        type: 'text',
        content: `<h3>🎨 Personalización del Tema</h3>
        <p>Basado en <strong>Empire Theme v7.0.1</strong> de Pixel Union, altamente personalizado con <strong>Liquid</strong> (motor de plantillas de Shopify), <strong>JavaScript ES6+</strong> para funcionalidades interactivas y <strong>CSS3/SCSS</strong> para estilos modulares. La tienda incluye características premium como sistema de videos estilo Instagram Reels, programa de recompensas para clientes frecuentes y experiencia multiidioma fluida.</p>`
      }
    ]),
  },
  {
    slug: 'rise-tower-landing',
    longDescription: JSON.stringify([
      {
        type: 'highlight',
        content: `<p><strong>RISE TOWER</strong> es la torre residencial más alta de Latinoamérica con <strong>475 metros de altura</strong>. Un proyecto monumental que requirió una landing page igual de impresionante.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Dimensiones del Proyecto',
        card1Content: `<ul>
          <li><strong>475m</strong> de altura total</li>
          <li><strong>34 niveles</strong> de oficinas</li>
          <li><strong>8 niveles</strong> de hotel</li>
          <li><strong>21 niveles</strong> de departamentos</li>
          <li><strong>4 niveles</strong> de comercio</li>
        </ul>`,
        card2Title: 'Amenidades World-Class',
        card2Content: `<ul>
          <li><strong>8,000+ m²</strong> de amenidades</li>
          <li><strong>4,300+ m²</strong> de áreas verdes</li>
          <li>Gimnasio de clase mundial</li>
          <li>Sky lounge panorámico</li>
          <li>Business center premium</li>
        </ul>`,
        card3Title: 'Ubicación Premium',
        card3Content: `<ul>
          <li>Monterrey, México</li>
          <li>Zona de máximo prestigio</li>
          <li>Conexión vías principales</li>
          <li>Vista panorámica 360°</li>
          <li>Acceso transporte ejecutivo</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>🎨 Diseño y Experiencia</h3>
        <ul>
          <li><strong>Paleta Premium:</strong> Neutros (#E4DDD7) con acentos dorados (#DC9B28)</li>
          <li><strong>Animaciones AOS:</strong> Efectos elegantes al scroll</li>
          <li><strong>Scroll Snap:</strong> Navegación fluida con anclaje</li>
          <li><strong>Cursor Custom:</strong> Experiencia visual única</li>
          <li><strong>Tipografía Origin:</strong> Familia exclusiva para branding</li>
        </ul>`,
        right: `<h3>✨ Características Técnicas</h3>
        <ul>
          <li><strong>Carrusel Swiper:</strong> Galería responsiva y fluida</li>
          <li><strong>Animación Palabras:</strong> LIVE, REACH, DREAM, HIGHER</li>
          <li><strong>CSS Variables:</strong> Tema dinámico y mantenible</li>
          <li><strong>Grid Layout:</strong> Diseño moderno responsivo</li>
          <li><strong>Keyframe Animations:</strong> Movimientos suaves 13s loop</li>
        </ul>`
      },
      {
        type: 'text',
        content: `<h3>🚀 Resultados Impresionantes</h3>
        <p>La landing page logró un <strong>+12% en CTR</strong> y genera más de <strong>150 leads premium al mes</strong>. El diseño minimalista combinado con animaciones elegantes crea una experiencia que refleja perfectamente la exclusividad del proyecto.</p>
        <p>Desarrollada con tecnologías modernas pero eficientes: <strong>HTML5, CSS3, JavaScript Vanilla</strong>, <strong>Swiper.js</strong> y <strong>AOS Library</strong>, demostrando que menos puede ser más cuando se ejecuta con maestría.</p>`
      }
    ]),
  },
  {
    slug: 'w3st-desarrollo-residencial',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🏗️ El Proyecto</h3>
        <p>W3ST representa "el último destello de un resplandeciente concepto de vida". Un desarrollo residencial exclusivo en Valle Poniente con 3 torres, 110,000 m² de construcción y más de 11,800 m² de amenidades que requería un portal web profesional para capturar leads premium.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Infraestructura',
        card1Content: `<ul>
          <li><strong>3 torres</strong> residenciales</li>
          <li>13, 16 y 21 niveles</li>
          <li><strong>110,000 m²</strong> de construcción</li>
          <li><strong>5 tipologías</strong> de departamentos</li>
          <li>Departamentos de 98m² a 135m²</li>
        </ul>`,
        card2Title: 'Amenidades Premium',
        card2Content: `<ul>
          <li><strong>3,800 m²</strong> amenidades interiores</li>
          <li><strong>8,000 m²</strong> amenidades exteriores</li>
          <li><strong>1,000 m²</strong> de parque natural</li>
          <li>Club deportivo completo</li>
          <li>Áreas sociales exclusivas</li>
        </ul>`,
        card3Title: 'Resultados Medibles',
        card3Content: `<ul>
          <li><strong>300+</strong> leads por mes</li>
          <li><strong>4.2%</strong> tasa de conversión</li>
          <li>Tiempo en sitio +3 min promedio</li>
          <li>ROI positivo desde mes 1</li>
          <li>Preventa exitosa</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>✨ Funcionalidades Clave</h3>
        <ul>
          <li><strong>Slider Tipologías:</strong> Navegación por tabs interactiva</li>
          <li><strong>Mapa Amenidades:</strong> Highlights por torre (A, B, C)</li>
          <li><strong>Puntos de Interés:</strong> Comercios, educación, servicios</li>
          <li><strong>Header Sticky:</strong> Navegación inteligente al scroll</li>
          <li><strong>Mobile-First:</strong> Menú hamburger optimizado</li>
        </ul>`,
        right: `<h3>🔒 Seguridad y Analítica</h3>
        <ul>
          <li><strong>reCAPTCHA v2:</strong> Protección anti-spam</li>
          <li><strong>Google Tag Manager:</strong> Gestión de scripts</li>
          <li><strong>Google Ads:</strong> Tracking de conversiones</li>
          <li><strong>WhatsApp Business:</strong> Contacto directo</li>
          <li><strong>SendGrid:</strong> Emails transaccionales</li>
        </ul>`
      },
      {
        type: 'highlight',
        content: `<p>Portal desarrollado con tecnologías clásicas pero efectivas: <strong>HTML5, CSS3, JavaScript Vanilla</strong> y <strong>PHP</strong>, demostrando que la simplicidad técnica puede generar resultados extraordinarios cuando se combina con estrategia digital sólida.</p>`
      }
    ]),
  },
  {
    slug: 'crm-ventas-inmobiliario',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>💼 Sistema CRM Empresarial</h3>
        <p>CRM Ventas es una aplicación web empresarial completa desarrollada específicamente para el sector inmobiliario. Gestiona todo el ciclo de ventas desde el primer contacto hasta la firma del contrato, integrando proyectos, inventario, cotizaciones y seguimiento de clientes en una sola plataforma.</p>`
      },
      {
        type: 'highlight',
        content: `<p>Sistema que gestiona <strong>5,000+ clientes</strong> activos, <strong>15+ proyectos</strong> simultáneos, y logró un incremento del <strong>+60% en eficiencia operativa</strong> del equipo de ventas.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Gestión Completa',
        card1Content: `<ul>
          <li><strong>Autenticación JWT</strong> segura</li>
          <li>Roles Admin y Comercial</li>
          <li>CRUD de proyectos completo</li>
          <li>Inventario en tiempo real</li>
          <li>Gestión documental avanzada</li>
        </ul>`,
        card2Title: 'Pipeline de Ventas',
        card2Content: `<ul>
          <li>Seguimiento de etapas visual</li>
          <li>Cotizaciones automáticas</li>
          <li>Separaciones de inmuebles</li>
          <li>Historial completo de cambios</li>
          <li>Múltiples contactos por cliente</li>
        </ul>`,
        card3Title: 'Integraciones',
        card3Content: `<ul>
          <li>Less Annoying CRM sync</li>
          <li>Sincronización bidireccional</li>
          <li>APIs externas conectadas</li>
          <li>Webhooks en tiempo real</li>
          <li>Export/Import de datos</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>⚙️ Frontend Robusto</h3>
        <ul>
          <li><strong>React 18.3:</strong> Biblioteca UI moderna</li>
          <li><strong>TypeScript:</strong> Código type-safe</li>
          <li><strong>Vite:</strong> Build ultrarrápido</li>
          <li><strong>Zustand 5.0:</strong> Estado global eficiente</li>
          <li><strong>React Router 6:</strong> Navegación SPA</li>
        </ul>`,
        right: `<h3>🛡️ Backend Escalable</h3>
        <ul>
          <li><strong>Node.js + Express 5.1:</strong> API robusta</li>
          <li><strong>PostgreSQL:</strong> Base de datos relacional</li>
          <li><strong>Kysely:</strong> Query builder type-safe</li>
          <li><strong>JWT:</strong> Autenticación stateless</li>
          <li><strong>Multer:</strong> Upload de archivos</li>
        </ul>`
      },
      {
        type: 'text',
        content: `<h3>📊 Funcionalidades Avanzadas</h3>
        <p>El sistema incluye <strong>detección automática de clientes duplicados</strong>, <strong>historial de cambios</strong> en toda la información, <strong>sistema de archivos y documentos</strong> por cliente, y <strong>notas de seguimiento</strong> de interacciones. La integración con <strong>Less Annoying CRM</strong> permite sincronización bidireccional de contactos, manteniendo los datos actualizados en ambas plataformas automáticamente.</p>`
      }
    ]),
  }
];

async function updateProjects() {
  const API_URL = 'https://gemini-backend.fly.dev/api';
  
  // First, login to get token
  console.log('🔐 Logging in...');
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@geminisoftware.mx',
      password: 'GeminiAdmin2024!'
    })
  });
  
  const loginData = await loginResponse.json();
  if (!loginData.success) {
    console.error('❌ Login failed:', loginData.message);
    return;
  }
  
  const token = loginData.data.token;
  console.log('✅ Logged in successfully');
  
  // Get current projects to find IDs
  const projectsResponse = await fetch(`${API_URL}/projects`);
  const projectsData = await projectsResponse.json();
  
  if (!projectsData.success) {
    console.error('❌ Failed to fetch projects');
    return;
  }
  
  // Update each project
  for (const update of projectUpdates) {
    const existingProject = projectsData.data.find(p => p.slug === update.slug);
    
    if (!existingProject) {
      console.log(`⚠️ Project not found: ${update.slug}`);
      continue;
    }
    
    console.log(`📝 Updating: ${existingProject.title}...`);
    
    const response = await fetch(`${API_URL}/projects/${existingProject.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        longDescription: update.longDescription
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Updated: ${existingProject.title}`);
    } else {
      console.log(`❌ Failed to update ${existingProject.title}: ${result.message}`);
    }
  }
  
  console.log('\n🎉 All projects updated!');
}

updateProjects().catch(console.error);
