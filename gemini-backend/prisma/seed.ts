import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Real projects from Gemini Software portfolio documentation
const projects = [
  {
    slug: 'gemini-software-portfolio',
    title: 'Gemini Software - Portafolio Web con IA',
    subtitle: 'Sitio corporativo full-stack con asistente AI conversacional y búsqueda semántica',
    category: 'Desarrollo Web',
    client: 'Gemini Software (Proyecto Propio)',
    description: 'Portafolio web empresarial con arquitectura moderna full-stack, integrando IA conversacional con Gemini 2.0 Flash, búsqueda semántica de proyectos, animaciones 3D con Three.js y panel de administración completo.',
    longDescription: JSON.stringify([
      {
        type: 'text',
        content: `<h3>🎯 El Desafío</h3>
        <p>Crear la presencia digital de Gemini Software con tecnologías de vanguardia, demostrando capacidades técnicas mientras se ofrece una experiencia de usuario excepcional con herramientas de IA integradas.</p>`
      },
      {
        type: 'highlight',
        content: `<p>Sitio web full-stack con <strong>Astro + React</strong>, <strong>asistente AI conversacional</strong> con Gemini 2.0 Flash, <strong>búsqueda semántica inteligente</strong>, y <strong>panel de administración</strong> completo.</p>`
      },
      {
        type: 'two-column',
        left: `<h3>✨ Funcionalidades AI</h3>
        <ul>
          <li><strong>AI Chat:</strong> Asistente conversacional con historial de sesión</li>
          <li><strong>AI Search:</strong> Búsqueda semántica de proyectos con IA</li>
          <li><strong>Recomendaciones:</strong> Proyectos sugeridos contextualmente</li>
          <li><strong>3D Background:</strong> Animaciones con Three.js y React Three Fiber</li>
        </ul>`,
        right: `<h3>📊 Panel de Administración</h3>
        <ul>
          <li><strong>CRUD Proyectos:</strong> Gestión completa con imágenes múltiples</li>
          <li><strong>Editor de Bloques:</strong> Contenido estructurado en JSON</li>
          <li><strong>Gestión de Contactos:</strong> Estados y seguimiento de leads</li>
          <li><strong>Autenticación JWT:</strong> Login seguro con roles</li>
        </ul>`
      },
      {
        type: 'cards',
        card1Title: 'Frontend Moderno',
        card1Content: `<ul>
          <li>Astro 5.x + React 18</li>
          <li>TypeScript 5.x</li>
          <li>Tailwind CSS 3.x</li>
          <li>GSAP + Framer Motion</li>
          <li>Three.js + React Three Fiber</li>
          <li>Google Gemini AI SDK</li>
        </ul>`,
        card2Title: 'Backend Robusto',
        card2Content: `<ul>
          <li>Node.js 20 + Express</li>
          <li>Prisma ORM + SQLite</li>
          <li>Google Gemini 2.0 Flash API</li>
          <li>JWT Auth + bcrypt</li>
          <li>Sharp + Multer</li>
          <li>Nodemailer</li>
        </ul>`,
        card3Title: 'Deployment',
        card3Content: `<ul>
          <li>Frontend: Vercel (SSR)</li>
          <li>Backend: Fly.io</li>
          <li>SSL automático</li>
          <li>CI/CD GitHub</li>
          <li>Score 95+ Lighthouse</li>
        </ul>`
      }
    ]),
    tags: JSON.stringify(['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Prisma', 'Gemini AI', 'Three.js', 'GSAP', 'Framer Motion']),
    results: JSON.stringify([
      { label: 'Performance', value: 'Score 95+' },
      { label: 'AI Features', value: 'Chat + Search' },
      { label: 'Tech Stack', value: '11 tecnologías' },
      { label: 'Architecture', value: 'Full-Stack' }
    ]),
    year: '2024-2026',
    duration: '3 meses',
    website: 'https://www.geminisoftware.mx',
    featured: true,
    published: true,
    order: 0,
  },
  {
    slug: 'anida-sitio-inmobiliario',
    title: 'ANIDA - Sitio Web Inmobiliario',
    subtitle: 'Portal de marketing inmobiliario premium para desarrollo residencial de lujo',
    category: 'Desarrollo Web',
    client: 'NEST Real Estate Development',
    description: 'Sitio web moderno y de alto rendimiento para marketing inmobiliario, presentando propiedades residenciales de lujo con experiencias visuales inmersivas, recorridos virtuales interactivos y funcionalidad de contacto fluida.',
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
          <li><strong>Recorridos Virtuales 3D:</strong> Exploración inmersiva de propiedades</li>
          <li><strong>Animaciones Fluidas:</strong> Framer Motion para transiciones elegantes</li>
          <li><strong>CMS Headless:</strong> Prismic para actualizaciones sin código</li>
          <li><strong>Diseño Responsivo:</strong> Experiencia optimizada en todos los dispositivos</li>
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
    tags: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Prismic CMS', 'Framer Motion', 'SendGrid', 'Swiper']),
    results: JSON.stringify([
      { label: 'Rendimiento', value: 'Score 95+' },
      { label: 'Conversión', value: '+180%' },
      { label: 'Experiencia', value: 'Recorridos 3D' },
      { label: 'SEO', value: 'Top 3 Google' }
    ]),
    year: '2024',
    duration: '3 meses',
    website: 'https://www.anida.mx',
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: 'we2t-desarrollo-inmobiliario',
    title: 'WE2T - Sitio Web Inmobiliario Premium',
    subtitle: 'Experiencia digital de alto impacto para desarrollo residencial de lujo en Valle Poniente',
    category: 'Desarrollo Web',
    client: 'NEST Desarrolladora Inmobiliaria',
    description: 'Sitio web inmobiliario de alto impacto para presentar el desarrollo residencial WE2T, permitiendo a prospectos explorar departamentos, amenidades y ubicación con experiencia visual premium.',
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
          <li><strong>Animaciones GSAP:</strong> Transiciones fluidas y profesionales</li>
          <li><strong>Galerías Interactivas:</strong> Owl Carousel + SimpleLightbox</li>
          <li><strong>Catálogo Completo:</strong> Tipologías detalladas con planos</li>
          <li><strong>Showcase de Amenidades:</strong> Visualización inmersiva</li>
        </ul>`,
        right: `<h3>🚀 Conversión y Marketing</h3>
        <ul>
          <li><strong>Chat en Vivo:</strong> Widget Trengo integrado</li>
          <li><strong>Automatización Zapier:</strong> Leads en tiempo real</li>
          <li><strong>Analytics GA4:</strong> Seguimiento avanzado</li>
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
    tags: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'jQuery', 'GSAP', 'PHP', 'Google Analytics']),
    results: JSON.stringify([
      { label: 'Leads generados', value: '+200%' },
      { label: 'Tiempo en sitio', value: '+45%' },
      { label: 'Bounce rate', value: '-30%' },
      { label: 'Conversiones', value: '+150%' }
    ]),
    year: '2024',
    duration: '2 meses',
    website: 'https://we2t.mx',
    featured: true,
    published: true,
    order: 2,
  },
  {
    slug: 'w3st-desarrollo-residencial',
    title: 'W3ST - Portal Inmobiliario de Lujo',
    subtitle: 'Sitio web de marketing para desarrollo residencial de 3 torres en Valle Poniente',
    category: 'Desarrollo Web',
    client: 'GRUPO NEST, S.C.',
    description: 'Portal web profesional para W3ST, exclusivo proyecto residencial de NEST con 3 torres residenciales de 13, 16 y 21 niveles, 110,000 m² de construcción y más de 11,800 m² de amenidades.',
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
          <li><strong>110,000 m²</strong> construcción</li>
          <li><strong>5 tipologías</strong> de deptos</li>
        </ul>`,
        card2Title: 'Amenidades',
        card2Content: `<ul>
          <li><strong>3,800 m²</strong> interiores</li>
          <li><strong>8,000 m²</strong> exteriores</li>
          <li><strong>1,000 m²</strong> parque natural</li>
          <li>Club deportivo completo</li>
        </ul>`,
        card3Title: 'Resultados',
        card3Content: `<ul>
          <li><strong>300+</strong> leads/mes</li>
          <li><strong>4.2%</strong> conversión</li>
          <li>Tasa de contacto alta</li>
          <li>ROI positivo desde mes 1</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>✨ Funcionalidades Clave</h3>
        <ul>
          <li><strong>Sliders Interactivos:</strong> Presentación dinámica de propiedades</li>
          <li><strong>WhatsApp Business:</strong> Contacto directo instantáneo</li>
          <li><strong>Email Transaccional:</strong> Notificaciones automáticas con SendGrid</li>
          <li><strong>Diseño Responsivo:</strong> Optimizado para todos los dispositivos</li>
        </ul>`,
        right: `<h3>🔒 Seguridad y Analítica</h3>
        <ul>
          <li><strong>reCAPTCHA v2:</strong> Protección anti-spam en formularios</li>
          <li><strong>Google Tag Manager:</strong> Seguimiento avanzado</li>
          <li><strong>Google Analytics:</strong> Métricas en tiempo real</li>
          <li><strong>Google Ads:</strong> Optimización de campañas</li>
        </ul>`
      },
      {
        type: 'highlight',
        content: `<p>Portal desarrollado con tecnologías clásicas pero efectivas: <strong>HTML5, CSS3, JavaScript Vanilla</strong> y <strong>PHP</strong>, demostrando que la simplicidad técnica puede generar resultados extraordinarios cuando se combina con estrategia digital sólida.</p>`
      }
    ]),
    tags: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'PHP', 'SendGrid', 'reCAPTCHA', 'Google Ads']),
    results: JSON.stringify([
      { label: 'Tipologías', value: '5 tipos' },
      { label: 'Amenidades', value: '11,800m²' },
      { label: 'Leads/mes', value: '300+' },
      { label: 'Conversión', value: '4.2%' }
    ]),
    year: '2024',
    duration: '2.5 meses',
    website: 'https://w3st.mx',
    featured: true,
    published: true,
    order: 3,
  },
  {
    slug: 'rise-tower-landing',
    title: 'RISE TOWER - Landing Page Premium',
    subtitle: 'Presencia digital para la torre residencial más alta de Latinoamérica',
    category: 'Landing Page',
    client: 'Ancore Group / NEST',
    description: 'Landing page moderna y elegante para RISE, el proyecto inmobiliario más ambicioso de Latinoamérica: torre residencial de 475 metros de altura en Monterrey, México.',
    longDescription: JSON.stringify([
      {
        type: 'highlight',
        content: `<p><strong>RISE TOWER</strong> es la torre residencial más alta de Latinoamérica con <strong>475 metros de altura</strong>. Un proyecto monumental que requirió una landing page igual de impresionante.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Dimensiones',
        card1Content: `<ul>
          <li><strong>475m</strong> de altura</li>
          <li><strong>34 niveles</strong> oficinas</li>
          <li><strong>8 niveles</strong> hotel</li>
          <li><strong>21 niveles</strong> deptos</li>
          <li><strong>4 niveles</strong> comercio</li>
        </ul>`,
        card2Title: 'Amenidades',
        card2Content: `<ul>
          <li><strong>8,000+ m²</strong> amenidades</li>
          <li><strong>4,300+ m²</strong> áreas verdes</li>
          <li>Gimnasio de clase mundial</li>
          <li>Sky lounge</li>
          <li>Business center</li>
        </ul>`,
        card3Title: 'Ubicación',
        card3Content: `<ul>
          <li>Monterrey, México</li>
          <li>Zona premium</li>
          <li>Conexión vías principales</li>
          <li>Vista panorámica 360°</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>🎨 Diseño y Experiencia</h3>
        <ul>
          <li><strong>Paleta Premium:</strong> Neutros (#E4DDD7) con acentos dorados (#DC9B28)</li>
          <li><strong>Animaciones AOS:</strong> Efectos al hacer scroll</li>
          <li><strong>Scroll Snap:</strong> Navegación fluida con anclaje automático</li>
          <li><strong>Cursor Custom:</strong> Experiencia visual única</li>
          <li><strong>Tipografía Origin:</strong> Familia exclusiva para branding</li>
        </ul>`,
        right: `<h3>✨ Características Técnicas</h3>
        <ul>
          <li><strong>Carrusel Swiper:</strong> Galería responsiva y fluida</li>
          <li><strong>Animación Palabras:</strong> LIVE, REACH, DREAM, GO, HIGHER</li>
          <li><strong>CSS Variables:</strong> Tema dinámico</li>
          <li><strong>Grid Layout:</strong> Diseño moderno</li>
          <li><strong>Keyframe Animations:</strong> Movimientos suaves</li>
        </ul>`
      },
      {
        type: 'text',
        content: `<h3>🚀 Resultados Impresionantes</h3>
        <p>La landing page logró un <strong>+12% en CTR</strong> y genera más de <strong>150 leads premium al mes</strong>. El diseño minimalista combinado con animaciones elegantes crea una experiencia que refleja perfectamente la exclusividad del proyecto.</p>
        <p>Desarrollada con tecnologías modernas pero eficientes: <strong>HTML5, CSS3, JavaScript Vanilla</strong>, <strong>Swiper.js</strong> y <strong>AOS Library</strong>, demostrando que menos puede ser más cuando se ejecuta con maestría.</p>`
      }
    ]),
    tags: JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Swiper.js', 'AOS', 'PHP', 'CSS Animations']),
    results: JSON.stringify([
      { label: 'Altura', value: '475m' },
      { label: 'Amenidades', value: '8,000m²' },
      { label: 'CTR', value: '+12%' },
      { label: 'Leads premium', value: '150+/mes' }
    ]),
    year: '2025',
    duration: '1.5 meses',
    website: 'https://risetower.mx',
    featured: true,
    published: true,
    order: 4,
  },
  {
    slug: 'nest-sitio-corporativo',
    title: 'NEST - Sitio Web Corporativo',
    subtitle: 'Portal corporativo moderno con CMS headless para desarrolladora inmobiliaria',
    category: 'Desarrollo Web',
    client: 'NEST Desarrollo Inmobiliario',
    description: 'Sitio web corporativo moderno con portafolio completo de propiedades, información institucional y herramientas de contacto, desarrollado con Next.js y CMS Headless.',
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
          <li><strong>Next.js 13.2.4:</strong> SSR/SSG para SEO óptimo</li>
          <li><strong>React 18.2.0:</strong> UI dinámica y reactiva</li>
          <li><strong>TypeScript 5.0.3:</strong> Código type-safe</li>
          <li><strong>Tailwind CSS 3.3.1:</strong> Diseño utility-first</li>
          <li><strong>Framer Motion:</strong> Animaciones de alto rendimiento</li>
        </ul>`,
        right: `<h3>📊 CMS y Backend</h3>
        <ul>
          <li><strong>Contentful:</strong> CMS Headless flexible</li>
          <li><strong>Supabase:</strong> PostgreSQL serverless</li>
          <li><strong>SendGrid:</strong> Email transaccional</li>
          <li><strong>Next.js API Routes:</strong> Backend integrado</li>
          <li><strong>Next SEO:</strong> Meta tags dinámicos</li>
        </ul>`
      },
      {
        type: 'highlight',
        content: `<p>Performance <strong>98/100</strong> y SEO Score <strong>95/100</strong> en Lighthouse. El sitio gestíona <strong>12+ proyectos</strong> activos y generó un incremento del <strong>+250% en leads</strong> gracias a su arquitectura optimizada.</p>`
      },
      {
        type: 'cards',
        card1Title: 'Características',
        card1Content: `<ul>
          <li>Portafolio dinámico</li>
          <li>Carruseles interactivos</li>
          <li>Sistema de feedback</li>
          <li>Portal de cliente</li>
        </ul>`,
        card2Title: 'UI/UX',
        card2Content: `<ul>
          <li>Swiper carousels</li>
          <li>React Slick</li>
          <li>React Waypoint</li>
          <li>Masonry layouts</li>
        </ul>`,
        card3Title: 'Optimización',
        card3Content: `<ul>
          <li>Image optimization</li>
          <li>Code splitting</li>
          <li>Lazy loading</li>
          <li>Cache strategies</li>
        </ul>`
      }
    ]),
    tags: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Contentful', 'Supabase', 'Framer Motion', 'SendGrid']),
    results: JSON.stringify([
      { label: 'Performance', value: '98/100' },
      { label: 'SEO Score', value: '95/100' },
      { label: 'Proyectos', value: '12+' },
      { label: 'Leads', value: '+250%' }
    ]),
    year: '2023',
    duration: '4 meses',
    website: 'https://nest.mx',
    featured: true,
    published: true,
    order: 5,
  },
  {
    slug: 'crm-ventas-inmobiliario',
    title: 'CRM Ventas - Sistema de Gestión Inmobiliaria',
    subtitle: 'Aplicación web completa de CRM para el sector inmobiliario',
    category: 'Software Empresarial',
    client: 'NEST / Desarrollo Interno',
    description: 'Sistema CRM completo para gestión de relaciones con clientes del sector inmobiliario: proyectos, inventario, cotizaciones, separaciones y seguimiento de ventas.',
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
          <li>Roles Admin/Comercial</li>
          <li>CRUD proyectos</li>
          <li>Inventario en tiempo real</li>
          <li>Gestión documental</li>
        </ul>`,
        card2Title: 'Pipeline de Ventas',
        card2Content: `<ul>
          <li>Seguimiento de etapas</li>
          <li>Cotizaciones automáticas</li>
          <li>Separaciones de inmuebles</li>
          <li>Historial completo</li>
          <li>Múltiples contactos</li>
        </ul>`,
        card3Title: 'Integraciones',
        card3Content: `<ul>
          <li>Less Annoying CRM</li>
          <li>Sincronización bidireccional</li>
          <li>APIs externas</li>
          <li>Webhooks</li>
          <li>Export/Import datos</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>⚙️ Frontend Robusto</h3>
        <ul>
          <li><strong>React 18.3:</strong> UI moderna y reactiva</li>
          <li><strong>TypeScript:</strong> Type safety completo</li>
          <li><strong>Vite:</strong> Build ultrarrrápido</li>
          <li><strong>Zustand 5.0:</strong> State management simple</li>
          <li><strong>React Router 6.30:</strong> Navegación fluida</li>
        </ul>`,
        right: `<h3>🛡️ Backend Escalable</h3>
        <ul>
          <li><strong>Node.js + Express 5.1:</strong> API RESTful</li>
          <li><strong>PostgreSQL:</strong> Base de datos enterprise</li>
          <li><strong>Kysely 0.28:</strong> Query builder type-safe</li>
          <li><strong>JWT + Bcrypt:</strong> Seguridad multicapa</li>
          <li><strong>Multer:</strong> Manejo de archivos</li>
        </ul>`
      }
    ]),
    tags: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Zustand', 'Vite']),
    results: JSON.stringify([
      { label: 'Usuarios', value: '50+' },
      { label: 'Proyectos', value: '15+' },
      { label: 'Eficiencia', value: '+60%' },
      { label: 'Clientes gestionados', value: '5,000+' }
    ]),
    year: '2024',
    duration: '6 meses',
    featured: false,
    published: true,
    order: 6,
  },
  {
    slug: 'sistema-entregas-nest',
    title: 'Sistema de Gestión de Entregas NEST',
    subtitle: 'Aplicación web empresarial para gestión de entregas inmobiliarias',
    category: 'Software Empresarial',
    client: 'NEST Desarrollo Inmobiliario',
    description: 'Sistema de gestión integral de entregas de proyectos inmobiliarios con portal de clientes, gestión de garantías y administración documental.',
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
          <li>Información fragmentada de proyectos</li>
          <li>Seguimiento manual de entregas</li>
          <li>Garantías post-venta dispersas</li>
          <li>Comunicación ineficiente con clientes</li>
          <li>Archivos desorganizados</li>
        </ul>`,
        right: `<h3>✅ Solución Implementada</h3>
        <ul>
          <li>Base de datos centralizada</li>
          <li>Dashboard en tiempo real</li>
          <li>Sistema de garantías automatizado</li>
          <li>Portal de cliente personalizado</li>
          <li>Gestión documental inteligente</li>
        </ul>`
      },
      {
        type: 'cards',
        card1Title: 'Funcionalidades Core',
        card1Content: `<ul>
          <li>CRUD completo</li>
          <li>Roles diferenciados</li>
          <li>Dashboard estadístico</li>
          <li>Búsqueda AJAX</li>
          <li>Filtros dinámicos</li>
        </ul>`,
        card2Title: 'Garantías',
        card2Content: `<ul>
          <li>Folios automáticos</li>
          <li>Seguimiento de estados</li>
          <li>Historial completo</li>
          <li>Notificaciones email</li>
          <li><strong>1,200+</strong> gestionadas</li>
        </ul>`,
        card3Title: 'Documentos',
        card3Content: `<ul>
          <li>Carga masiva</li>
          <li>Clasificación auto</li>
          <li>Optimización PDFs</li>
          <li>Planos y manuales</li>
          <li>Videos tutoriales</li>
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
    tags: JSON.stringify(['PHP', 'MySQL', 'MVC', 'SASS', 'JavaScript', 'jQuery', 'Gulp', 'SendGrid']),
    results: JSON.stringify([
      { label: 'Proyectos', value: '8+' },
      { label: 'Departamentos', value: '500+' },
      { label: 'Garantías', value: '1,200+' },
      { label: 'Tiempo respuesta', value: '-50%' }
    ]),
    year: '2023',
    duration: '5 meses',
    featured: false,
    published: true,
    order: 7,
  },
  {
    slug: 'natures-factory-ecommerce',
    title: "Nature's Factory - E-Commerce Shopify",
    subtitle: 'Tienda en línea de suplementos alimenticios y productos naturales',
    category: 'E-Commerce',
    client: "Nature's Factory",
    description: 'Personalización y desarrollo de tienda Shopify para venta de suplementos alimenticios, vitaminas y productos naturales con experiencia de compra superior.',
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
          <li><strong>Carrito AJAX:</strong> Sin recargas</li>
          <li><strong>QuickShop:</strong> Vista rápida</li>
          <li><strong>Búsqueda en Vivo:</strong> Instantánea</li>
          <li>Autocompletado inteligente</li>
          <li>Filtros avanzados</li>
        </ul>`,
        card2Title: 'Funcionalidades',
        card2Content: `<ul>
          <li><strong>Sistema de Videos:</strong> Tipo Reels</li>
          <li><strong>Recompensas:</strong> Fidelización</li>
          <li><strong>Cuentas:</strong> Portal cliente</li>
          <li>Multiidioma ES/EN</li>
          <li>Wishlist & Comparar</li>
        </ul>`,
        card3Title: 'Optimización',
        card3Content: `<ul>
          <li>InstantPage.js precarga</li>
          <li>Imágenes WebP</li>
          <li>Lazy loading</li>
          <li>CDN Shopify</li>
          <li>Cache optimizado</li>
        </ul>`
      },
      {
        type: 'two-column',
        left: `<h3>🛍️ Catálogo y Productos</h3>
        <ul>
          <li><strong>200+ Productos:</strong> Catálogo extenso y variado</li>
          <li><strong>Variantes:</strong> Tamaños, sabores, presentaciones</li>
          <li><strong>Inventario:</strong> Control en tiempo real</li>
          <li><strong>Precios Dinámicos:</strong> Descuentos y promociones</li>
          <li><strong>Imágenes HD:</strong> Múltiples vistas por producto</li>
        </ul>`,
        right: `<h3>📊 Analytics y Marketing</h3>
        <ul>
          <li><strong>Shopify Analytics:</strong> Dashboard completo</li>
          <li><strong>Google Analytics:</strong> Comportamiento de usuarios</li>
          <li><strong>Email Marketing:</strong> Campañas automatizadas</li>
          <li><strong>SEO Optimizado:</strong> Meta tags dinámicos</li>
          <li><strong>Integraciones:</strong> Redes sociales y más</li>
        </ul>`
      },
      {
        type: 'text',
        content: `<h3>🎨 Personalización del Tema</h3>
        <p>Basado en <strong>Empire Theme v7.0.1</strong> de Pixel Union, altamente personalizado con <strong>Liquid</strong> (motor de plantillas de Shopify), <strong>JavaScript ES6+</strong> para funcionalidades interactivas y <strong>CSS3/SCSS</strong> para estilos modulares. La tienda incluye características premium como sistema de videos estilo Instagram Reels, programa de recompensas para clientes frecuentes y experiencia multiidioma fluida.</p>`
      }
    ]),
    tags: JSON.stringify(['Shopify', 'Liquid', 'JavaScript', 'CSS3', 'E-commerce', 'Empire Theme']),
    results: JSON.stringify([
      { label: 'Ventas', value: '+180%' },
      { label: 'Conversión', value: '3.8%' },
      { label: 'Productos', value: '200+' },
      { label: 'Clientes', value: '10,000+' }
    ]),
    year: '2023-2026',
    duration: 'Mantenimiento continuo',
    website: 'https://www.naturesfactory.com',
    featured: false,
    published: true,
    order: 8,
  },
];

// Real services from Gemini Software
const services = [
  {
    slug: 'desarrollo-web',
    title: 'Desarrollo Web',
    subtitle: 'Sitios web y aplicaciones web empresariales de alto rendimiento',
    description: 'Desarrollamos sitios web y aplicaciones empresariales con arquitecturas escalables, código auditado y protocolos de seguridad empresarial. Certificaciones SSL/TLS, encriptación de datos y cumplimiento de estándares OWASP.',
    icon: 'code',
    features: JSON.stringify([
      'Arquitectura escalable y segura',
      'Código auditado y versionado (Git)',
      'Protección HTTPS/SSL incluida',
      'Cumplimiento OWASP Top 10',
      'Testing automatizado (Jest, Cypress)',
      'Monitoreo y respaldos automáticos',
      'Documentación técnica completa',
      'Optimización SEO empresarial',
    ]),
    technologies: JSON.stringify(['Next.js', 'React', 'Astro', 'TypeScript', 'Tailwind CSS', 'Node.js']),
    order: 1,
    published: true,
  },
  {
    slug: 'apps-moviles',
    title: 'Aplicaciones Móviles',
    subtitle: 'Apps que tus usuarios amarán usar',
    description: 'Creamos aplicaciones móviles con excelente experiencia de usuario y alto engagement. Garantizamos aprobación en App Store y Google Play en el primer intento. Incluye testing con usuarios reales, optimización de rendimiento y análisis de comportamiento para mejora continua.',
    icon: 'mobile',
    features: JSON.stringify([
      'Diseño intuitivo y fácil de usar',
      'Rendimiento optimizado (sin lag)',
      'Aprobación garantizada en App Store/Play Store',
      'Funciona offline cuando es necesario',
      'Notificaciones push efectivas',
      'Analítica de comportamiento de usuarios',
      'Testing en dispositivos reales',
      'Actualizaciones sin interrupciones',
    ]),
    technologies: JSON.stringify(['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase']),
    order: 2,
    published: true,
  },
  {
    slug: 'software-empresarial',
    title: 'Software Empresarial',
    subtitle: 'Sistemas que automatizan y optimizan tu negocio',
    description: 'Desarrollamos software empresarial a medida que reduce tiempos, elimina errores y aumenta la productividad de tu equipo. Garantizamos ROI medible en los primeros 6 meses. Incluye capacitación completa, integración con sistemas existentes y soporte prioritario.',
    icon: 'software',
    features: JSON.stringify([
      'Automatización de procesos repetitivos',
      'Reducción de errores humanos',
      'Reportes y dashboards en tiempo real',
      'Integración con sistemas existentes',
      'Escalable según tu crecimiento',
      'Capacitación completa para tu equipo',
      'ROI medible y demostrable',
      'Soporte prioritario y actualizaciones',
    ]),
    technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Express', 'Prisma']),
    order: 3,
    published: true,
  },
  {
    slug: 'e-commerce',
    title: 'E-Commerce',
    subtitle: 'Tiendas online que venden 24/7',
    description: 'Creamos tiendas en línea optimizadas para maximizar ventas y reducir carritos abandonados. Garantizamos proceso de compra fluido, pagos seguros y experiencia de usuario excepcional. Incluye estrategia de conversión, optimización SEO y análisis de ventas detallado.',
    icon: 'shopping-cart',
    features: JSON.stringify([
      'Checkout optimizado (menos carritos abandonados)',
      'Proceso de compra rápido y sencillo',
      'Pagos seguros (tarjeta, PayPal, transferencia)',
      'Optimización para conversión',
      'SEO para aparecer en búsquedas de productos',
      'Gestión de inventario automatizada',
      'Análisis de ventas y comportamiento',
      'Estrategias para aumentar ticket promedio',
    ]),
    technologies: JSON.stringify(['Shopify', 'WooCommerce', 'Next.js', 'Stripe', 'PayPal']),
    order: 4,
    published: true,
  },
  {
    slug: 'marketing-digital',
    title: 'Marketing Digital',
    subtitle: 'Estrategias que generan leads y ventas reales',
    description: 'Implementamos estrategias de marketing digital con resultados medibles. Garantizamos incremento en tráfico cualificado y generación de leads. Incluye optimización SEO, campañas pagadas, análisis de competencia y reportes mensuales con KPIs claros.',
    icon: 'marketing',
    features: JSON.stringify([
      'Posicionamiento SEO en Google',
      'Incremento de tráfico cualificado',
      'Generación de leads efectivos',
      'Campañas en Google Ads y Redes Sociales',
      'Análisis de competencia',
      'Estrategia de contenidos',
      'Optimización de conversión',
      'Reportes mensuales con resultados claros',
    ]),
    technologies: JSON.stringify(['Google Analytics', 'Google Search Console', 'SEMrush', 'Ahrefs']),
    order: 5,
    published: true,
  },
  {
    slug: 'mantenimiento-soporte',
    title: 'Mantenimiento y Soporte',
    subtitle: 'Tu proyecto funcionando perfectamente, siempre',
    description: 'Mantenemos tu sitio o aplicación funcionando sin interrupciones. Garantizamos 99.9% de disponibilidad y respuesta rápida ante cualquier incidente. Incluye actualizaciones, respaldos automáticos, monitoreo 24/7 y optimización continua de rendimiento.',
    icon: 'maintenance',
    features: JSON.stringify([
      'Disponibilidad garantizada 99.9%',
      'Respuesta rápida ante incidentes',
      'Actualizaciones mensuales',
      'Respaldos automáticos diarios',
      'Monitoreo 24/7',
      'Optimización de velocidad',
      'Reportes mensuales de rendimiento',
      'Soporte técnico prioritario',
    ]),
    technologies: JSON.stringify(['Hosting administrado', 'Cloudflare', 'SSL', 'CDN']),
    order: 6,
    published: true,
  },
];

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Create admin user
  const adminEmail = 'admin@geminisoftware.mx';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('GeminiAdmin2024!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('⏭️  Admin user already exists');
  }

  // Create/Update projects
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        longDescription: project.longDescription,
      },
      create: project,
    });
    console.log(`✅ Project updated: ${project.title}`);
  }

  // Create services
  for (const service of services) {
    const existing = await prisma.service.findUnique({ where: { slug: service.slug } });
    if (!existing) {
      await prisma.service.create({ data: service });
      console.log(`✅ Service created: ${service.title}`);
    } else {
      console.log(`⏭️  Service exists: ${service.title}`);
    }
  }

  console.log('\n✨ Seed completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
