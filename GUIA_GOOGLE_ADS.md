# Guía Completa: Promoción Perfecta con Google Ads para Gemini Software

## 📋 Fase 1: Preparación (Días 1-3)

### Paso 1: Configurar Google Analytics 4 y Conversiones
```
1. Ir a https://analytics.google.com
2. Crear cuenta → Propiedad "Gemini Software"
3. Instalar etiqueta en BaseLayout.astro (antes de </head>):
```
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXX');
</script>
```

### Paso 2: Definir Conversiones (Eventos Clave)
En Google Analytics 4, marcar como conversiones:
- ✅ **chat_opened** - Usuario abre el chat
- ✅ **message_sent** - Usuario envía mensaje al chat IA
- ✅ **whatsapp_click** - Clic en botón de WhatsApp
- ✅ **form_submit** - Envío de formulario de contacto
- ✅ **phone_click** - Clic en número telefónico

**Código para rastrear eventos** (agregar a AIChat.tsx):
```typescript
// Cuando el chat se abre
useEffect(() => {
  if (isOpen && window.gtag) {
    window.gtag('event', 'chat_opened', {
      event_category: 'engagement',
      event_label: 'AI Chat Widget'
    });
  }
}, [isOpen]);

// Cuando se envía un mensaje
const handleSubmit = async (e: React.FormEvent) => {
  // ... código existente ...
  if (window.gtag) {
    window.gtag('event', 'message_sent', {
      event_category: 'engagement',
      event_label: 'AI Chat Message'
    });
  }
};
```

### Paso 3: Vincular Google Ads
1. Ir a https://ads.google.com
2. Herramientas → Medición → Conversiones
3. Importar desde Google Analytics 4
4. Seleccionar eventos: message_sent, whatsapp_click, form_submit

---

## 🎯 Fase 2: Estructura de Campaña (Días 4-5)

### Campaña 1: Búsqueda - Servicios Específicos
**Presupuesto sugerido:** $40 USD/día

#### Grupo de Anuncios 1.1: Desarrollo Web
**Palabras clave (Concordancia exacta):**
- [desarrollo web profesional]
- [empresa desarrollo web méxico]
- [desarrollo sitios web a medida]
- [programación web personalizada]
- [desarrollo web responsive]

**CPC máximo inicial:** $2.50 USD

**Anuncios (3 variaciones para A/B testing):**

**Anuncio A - Enfoque en Velocidad:**
```
Título 1: Desarrollo Web Ultra Rápido
Título 2: Sitios con Performance Score 83+
Título 3: Chat IA Incluido | Gemini Software
Descripción 1: Desarrollo web profesional con GSAP, React y tecnologías modernas. Sitios optimizados que cargan en menos de 1 segundo.
Descripción 2: Garantizamos velocidad excepcional y UX perfecta. Cotización instantánea con nuestro asistente IA 24/7.
```

**Anuncio B - Enfoque en Tecnología:**
```
Título 1: Desarrollo Web con React y Astro
Título 2: Tecnología de Vanguardia
Título 3: Asistente IA 24/7 | Gemini Software
Descripción 1: Expertos en React, Astro, Node.js y GSAP. Creamos experiencias web modernas con animaciones fluidas.
Descripción 2: Chat con IA para cotización inmediata. Desarrollamos tu proyecto con las mejores prácticas del 2026.
```

**Anuncio C - Enfoque en Resultados:**
```
Título 1: Desarrollo Web que Convierte
Título 2: SEO Score 100 Garantizado
Título 3: Consulta Gratis | Gemini Software
Descripción 1: Sitios web optimizados para conversión y posicionamiento. Performance excepcional en mobile y desktop.
Descripción 2: Portfolio comprobado. Habla con nuestro asistente IA ahora y recibe propuesta en 24 hrs.
```

**URL Final:** https://geminisoftware.mx/servicios
**URL para Mostrar:** geminisoftware.mx/desarrollo-web

#### Grupo de Anuncios 1.2: Desarrollo de Apps Móviles
**Palabras clave:**
- [desarrollo aplicaciones móviles]
- [empresa desarrollo apps méxico]
- [desarrollo app ios android]
- [aplicaciones móviles a medida]

**CPC máximo:** $3.00 USD

**Anuncio:**
```
Título 1: Desarrollo de Apps iOS y Android
Título 2: React Native | Flutter Expertos
Título 3: Chat IA 24/7 | Gemini Software
Descripción 1: Aplicaciones móviles nativas y multiplataforma. UX excepcional, performance optimizado, integración API completa.
Descripción 2: Consulta gratis con nuestro asistente IA. Tu app lista en tiempo récord con metodología ágil.
```

#### Grupo de Anuncios 1.3: Consultoría y Soporte
**Palabras clave:**
- [consultoría desarrollo software]
- [optimización performance web]
- [soporte técnico desarrollo web]
- [auditoría código software]

**CPC máximo:** $2.00 USD

---

### Campaña 2: Display Remarketing
**Presupuesto:** $10 USD/día

**Audiencias:**
- Visitantes del sitio (últimos 30 días)
- Usuarios que abrieron el chat pero no enviaron mensaje
- Visitantes de /servicios que no convirtieron

**Formato de anuncios:**
- Banner responsive 300x250, 728x90, 160x600
- Mensaje: "¿Aún tienes dudas? Nuestro asistente IA está listo para ayudarte"
- CTA: "Hablar con IA Ahora"

---

## 📊 Fase 3: Extensiones y Optimización (Día 6)

### Extensiones de Anuncios (Obligatorias)

**1. Enlaces de Sitio:**
```
Servicios → geminisoftware.mx/servicios
"Desarrollo web, apps móviles y software a medida"

Portfolio → geminisoftware.mx/portfolio  
"Proyectos reales con resultados medibles"

Chat con IA → geminisoftware.mx/#chat
"Cotización instantánea 24/7"

Contacto → geminisoftware.mx/#contacto
"WhatsApp, email o formulario directo"
```

**2. Textos destacados:**
- Chat con IA disponible 24/7
- Desarrollo con React, Astro, Node.js
- Performance Score 83+ garantizado
- Metodología ágil Scrum
- Soporte post-lanzamiento incluido
- SEO optimizado desde el inicio

**3. Fragmentos estructurados:**
```
Servicios:
- Desarrollo Web
- Aplicaciones Móviles  
- Consultoría Técnica
- Optimización Performance

Tecnologías:
- React 19
- Astro 5
- Node.js
- GSAP
```

**4. Extensión de llamada:**
- Número de WhatsApp Business
- Disponible: Lun-Vie 9am-7pm

**5. Extensión de ubicación:**
- Si tienes oficina física, agregar dirección

---

## 💰 Fase 4: Estrategia de Puja y Presupuesto (Día 7)

### Presupuesto Total Recomendado

**Arranque (Primeras 2 semanas):**
- Total: $50 USD/día ($1,500/mes)
- Búsqueda: $40/día (80%)
- Display Remarketing: $10/día (20%)

**Después de optimización (Semana 3+):**
- Total: $70-100 USD/día según resultados
- Escalar lo que funcione, pausar lo que no

### Estrategia de Puja por Fase

**Días 1-14: Manual CPC**
```
Objetivo: Recopilar datos y encontrar mejores keywords
Configuración:
- CPC máximo por grupo de anuncios (ver arriba)
- Ajustes de puja:
  * Mobile: +20% (tu sitio es mobile-first)
  * Desktop: 0%
  * Tablet: -10%
  * Horario 9am-8pm: +15%
  * Horario 8pm-9am: -30%
```

**Días 15-30: Maximizar Conversiones**
```
Cambiar a estrategia automática cuando tengas:
- Mínimo 30 conversiones en 30 días
- Configurar CPA objetivo: $50 USD
```

**Mes 2+: Maximizar Valor de Conversión**
```
Cuando tengas datos de calidad:
- Asignar valores a conversiones:
  * message_sent: $10
  * whatsapp_click: $30
  * form_submit: $50
- Maximizar ROAS objetivo: 300%
```

---

## 📈 Fase 5: Seguimiento y Optimización (Semanal)

### KPIs Críticos a Monitorear

**Semana 1:**
- ✅ Impresiones > 1,000/día
- ✅ CTR > 3% (industria promedio: 2%)
- ✅ Quality Score > 6/10
- ✅ CPC < $3.50 USD
- ✅ Conversiones > 5/semana

**Acciones si no se cumplen:**

| Problema | Solución |
|----------|----------|
| CTR bajo (<2%) | Reescribir anuncios, agregar emojis sutiles, probar nuevos títulos |
| CPC alto (>$4) | Mejorar Quality Score, agregar keywords negativas |
| Quality Score bajo | Mejorar relevancia landing page ↔ keywords, aumentar CTR |
| Sin conversiones | Revisar tracking, simplificar formularios, agregar más CTAs |

### Rutina de Optimización Semanal

**Lunes:** Revisar métricas del fin de semana
```
1. Pausar keywords con CPC > $5 y 0 conversiones
2. Aumentar puja +10% en keywords con conversiones
3. Revisar términos de búsqueda → agregar negativos
```

**Miércoles:** A/B Testing
```
1. Comparar rendimiento de 3 anuncios
2. Pausar el de menor CTR
3. Crear variación nueva del ganador
```

**Viernes:** Análisis de conversiones
```
1. Ver qué keywords generan más message_sent
2. Revisar calidad de leads (¿usuarios reales o bots?)
3. Ajustar valores de conversión si es necesario
```

---

## 🎨 Fase 6: Landing Pages Optimizadas

### Modificaciones Recomendadas

**1. Página de Servicios (/servicios)**
Agregar sección específica para tráfico pagado:

```astro
---
// En servicios.astro, después del hero
---

{Astro.url.searchParams.get('utm_source') === 'google' && (
  <section class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-8">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl font-bold mb-4">
        🎯 Oferta Especial para Visitantes de Google Ads
      </h2>
      <p class="text-lg mb-4">
        Primera consultoría técnica GRATIS (valor $200 USD)
      </p>
      <button onclick="document.querySelector('#chat-button').click()" 
              class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:scale-105 transition">
        Hablar con Asistente IA Ahora →
      </button>
    </div>
  </section>
)}
```

**2. URLs con parámetros UTM**
Configurar en todas las campañas:
```
URL Final: https://geminisoftware.mx/servicios?utm_source=google&utm_medium=cpc&utm_campaign=desarrollo_web&utm_content=anuncio_a
```

**3. Página de Gracias (Thank You Page)**
Crear `/gracias` para después de conversión:

```astro
---
// src/pages/gracias.astro
---
<Layout title="¡Gracias por contactarnos!">
  <section class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">✅ ¡Mensaje Recibido!</h1>
      <p class="text-xl mb-8">
        Nuestro equipo te responderá en menos de 2 horas
      </p>
      <a href="/portfolio" class="btn-primary">
        Ver Nuestro Portfolio →
      </a>
    </div>
  </section>
</Layout>

<script>
  // Conversión de Google Ads
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXX'
    });
  }
</script>
```

---

## 🚀 Fase 7: Lanzamiento (Día 8)

### Checklist Final Antes de Activar

- [ ] Google Analytics 4 instalado y funcionando
- [ ] Conversiones configuradas y testeadas
- [ ] 3 anuncios por grupo (mínimo 2)
- [ ] Extensiones de anuncios todas activas
- [ ] Keywords negativas básicas agregadas
- [ ] Presupuesto diario configurado ($50/día inicial)
- [ ] Método de pago agregado con saldo
- [ ] Alertas de presupuesto configuradas
- [ ] Dashboard de seguimiento preparado

### Activar Campañas
```
1. Ir a Google Ads → Campañas
2. Seleccionar "Campaña 1: Búsqueda - Servicios"
3. Cambiar estado a "Activo"
4. Verificar que aparezca en "Estado: Elegible"
5. Esperar 24-48 hrs para primeras impresiones
```

---

## 📱 Fase 8: Monitoreo Día a Día (Primera Semana)

### Día 1
**9:00 AM** - Verificar que anuncios estén activos y sirviendo
**2:00 PM** - Primera revisión de impresiones y clics
**6:00 PM** - Verificar si hay conversiones

**Métricas esperadas Día 1:**
- Impresiones: 500-1,000
- Clics: 15-30
- CTR: 3-5%
- Conversiones: 0-2

### Día 2-3
- Revisar términos de búsqueda → agregar 10-20 keywords negativas
- Identificar keyword con mejor CTR → aumentar puja +20%
- Pausar keywords con 50+ impresiones y CTR < 1%

### Día 4-5
- Comparar rendimiento de 3 anuncios
- Pausar anuncio con menor CTR
- Crear variación del anuncio ganador

### Día 6-7
- Analizar Quality Score de cada keyword
- Keywords con QS < 5 → mejorar relevancia o pausar
- Revisar landing page bounce rate en Analytics

---

## 💡 Keywords Negativas Esenciales (Agregar desde Día 1)

```
gratis, free, curso, tutorial, descargar, download, 
pdf, manual, aprender, estudiar, escuela, universidad,
freelance, trabajo, empleo, vacante, plantilla, 
template, wordpress, wix, ejemplo, demo, prueba gratis,
barato, económico, low cost, diy, hazlo tu mismo
```

---

## 🎯 Metas por Etapa

### Mes 1: Aprendizaje
- Objetivo: 50-80 conversiones
- CPA objetivo: < $60 USD
- Quality Score promedio: > 6/10
- ROI esperado: -20% a +50% (es normal, estás aprendiendo)

### Mes 2: Optimización
- Objetivo: 100-150 conversiones
- CPA objetivo: < $50 USD
- Quality Score: > 7/10
- ROI esperado: +100% a +200%

### Mes 3+: Escala
- Objetivo: 200+ conversiones/mes
- CPA objetivo: < $40 USD
- Quality Score: > 8/10
- ROI esperado: +300% o más

---

## 📞 Plan de Contingencia

### Si gastas mucho sin conversiones (Primeros 3 días)

**Acción inmediata:**
1. Pausar todas las campañas
2. Revisar que el tracking funcione (enviar mensaje de prueba al chat)
3. Reducir presupuesto a $20/día
4. Enfocarse SOLO en 5 keywords de mayor intención de compra:
   - [desarrollo web a medida]
   - [empresa desarrollo software méxico]
   - [cotización desarrollo web]

### Si Quality Score < 4 persistentemente

**Problema:** Landing page no relevante para keywords
**Solución:**
1. Crear landing pages específicas por servicio
2. Incluir keyword exacta en H1 y title
3. Mejorar velocidad de carga (ya tienes buen FCP)

### Si CTR < 1.5%

**Problema:** Anuncios no atractivos
**Solución:**
1. Estudiar anuncios de competidores (buscar tus keywords en incógnito)
2. Agregar precio aproximado si es competitivo
3. Usar números: "Sitios desde $2,500 MXN"
4. Agregar urgencia: "Cupo limitado Febrero 2026"

---

## 🔥 Scripts de Automatización (Avanzado)

Una vez con datos suficientes (Semana 3+), agregar scripts automáticos:

### Script 1: Pausar Keywords Caras Sin Conversiones
```javascript
function pauseExpensiveKeywords() {
  var keywords = AdsApp.keywords()
    .withCondition("Cost > 50")
    .withCondition("Conversions = 0")
    .withCondition("Impressions > 100")
    .get();
    
  while (keywords.hasNext()) {
    var keyword = keywords.next();
    keyword.pause();
    Logger.log("Pausada: " + keyword.getText());
  }
}
```

### Script 2: Alertas de Presupuesto
```javascript
function budgetAlert() {
  var campaigns = AdsApp.campaigns()
    .withCondition("Status = ENABLED")
    .get();
    
  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var budget = campaign.getBudget().getAmount();
    var cost = campaign.getStatsFor("TODAY").getCost();
    
    if (cost > budget * 0.8) {
      // Enviar email de alerta
      MailApp.sendEmail({
        to: "tu@email.com",
        subject: "⚠️ Campaña cerca del límite",
        body: campaign.getName() + " gastó $" + cost
      });
    }
  }
}
```

---

## 📊 Dashboard de Seguimiento

Crear reporte semanal con estas columnas en Google Sheets:

| Semana | Impresiones | Clics | CTR | CPC | Conversiones | CPA | ROI |
|--------|-------------|-------|-----|-----|--------------|-----|-----|
| 1      | 7,000       | 210   | 3%  | $2.80 | 5 | $58 | -20% |
| 2      | 8,500       | 272   | 3.2%| $2.50 | 12 | $52 | +80% |
| 3      | 10,200      | 357   | 3.5%| $2.30 | 18 | $46 | +150% |
| 4      | 12,000      | 480   | 4%  | $2.10 | 24 | $42 | +200% |

**Vincular automáticamente:** Google Ads → Google Sheets con complemento oficial

---

## 🎓 Recursos de Aprendizaje

**Certificación Gratis:**
- Google Skillshop → "Certificación Google Ads en Búsqueda"
- Tiempo: 4-6 horas
- Link: https://skillshop.withgoogle.com

**Canales YouTube Recomendados:**
- Surfside PPC (inglés) - Tutoriales paso a paso
- Romuald Fons (español) - Estrategias avanzadas

**Comunidades:**
- r/PPC en Reddit
- Grupo Facebook: "Google Ads México"

---

## ✅ Checklist de Éxito (Mes 1)

- [ ] Al menos 50 conversiones totales
- [ ] Quality Score promedio > 6/10
- [ ] CTR promedio > 3%
- [ ] CPA < $60 USD
- [ ] 2 anuncios probados por grupo
- [ ] 100+ keywords negativas agregadas
- [ ] Remarketing activo con 500+ usuarios
- [ ] GA4 funcionando correctamente
- [ ] Landing pages optimizadas con UTMs
- [ ] Primer cliente cerrado desde Google Ads

---

## 🚨 Errores Comunes a Evitar

❌ **No instalar tracking correctamente** → Pierdes datos valiosos
✅ Solución: Probar conversiones en modo incógnito antes de lanzar

❌ **Usar solo concordancia amplia** → Gastas en búsquedas irrelevantes  
✅ Solución: Empezar con exacta, expandir a frase después

❌ **Un solo anuncio por grupo** → No puedes hacer A/B testing
✅ Solución: Mínimo 3 anuncios variando títulos y descripciones

❌ **No revisar términos de búsqueda** → Pagas por clics inútiles
✅ Solución: Revisar DIARIAMENTE primera semana, luego semanal

❌ **Bajar presupuesto cuando no funciona** → Nunca aprendes
✅ Solución: Mantener mínimo 2 semanas, luego optimizar

❌ **No usar extensiones** → Menos espacio en pantalla, menor CTR
✅ Solución: Activar TODAS las extensiones disponibles

❌ **Landing pages genéricas** → Bajo Quality Score
✅ Solución: Landing específica por servicio principal

---

## 📈 Plan de Escala (Meses 2-6)

### Mes 2: Expandir Keywords
- Agregar concordancia de frase a keywords ganadoras
- Probar variaciones long-tail
- Presupuesto: $70/día

### Mes 3: YouTube Ads
- Video ads de 15-30 segundos mostrando portfolio
- Targeting: Interesados en desarrollo web
- Presupuesto adicional: $20/día

### Mes 4: Google Shopping (si vendes productos)
- Feed de servicios como productos
- Ej: "Sitio Web Básico - $2,500 MXN"

### Mes 5: Campañas de Performance Max
- Automatización total con IA de Google
- Necesitas mínimo 50 conversiones/mes

### Mes 6: Expansión Internacional
- Si tienes clientes en USA/LATAM
- Campañas en inglés
- Targeting geográfico específico

---

## 💰 ROI Esperado - Proyección Realista

**Ejemplo con presupuesto $50/día ($1,500/mes):**

```
Mes 1:
- Inversión: $1,500
- Conversiones: 60 (mix de chat + whatsapp + forms)
- Leads calificados: ~15 (25% de conversiones)
- Clientes cerrados: 2-3 (20% de leads)
- Ticket promedio proyecto: $3,000 USD
- Ingreso: $6,000 - $9,000 USD
- ROI: +300% a +500%

Mes 3 (optimizado):
- Inversión: $2,100 ($70/día)
- Conversiones: 180
- Leads calificados: 45
- Clientes cerrados: 8-10
- Ingreso: $24,000 - $30,000 USD
- ROI: +1,000% a +1,300%
```

**Nota:** Estos números son conservadores. Con tu diferenciador (chat IA) y sitio optimizado, podrías superarlos.

---

## 🎯 Estrategia de Cierre de Leads

Una vez que lleguen leads desde Google Ads:

### Primera Respuesta (menos de 30 min)
```
"Hola [Nombre], gracias por contactarnos desde nuestro chat IA.

Vi que estás interesado en [servicio específico que mencionó].

Te preparo una propuesta personalizada. ¿Podemos agendar 
una videollamada rápida de 15 min esta semana?

Disponibilidad:
- Hoy 5pm
- Mañana 10am o 3pm  
- Jueves 11am

¿Cuál te viene mejor?

César - Gemini Software"
```

### Si no responde en 24 hrs
```
"Hola [Nombre],

Te dejé mensaje ayer sobre [proyecto]. 

Preparé un estimado preliminar basado en lo que 
comentaste: [rango de precio]

¿Te sirve una llamada de 10 min para refinar detalles?

WhatsApp: [tu número]"
```

### Si no responde en 48 hrs
```
"Última oportunidad 😊

Tenemos disponibilidad esta semana para iniciar 
proyectos nuevos.

Si ya encontraste otro proveedor, sin problema.

Si aún estás decidiendo, estoy disponible en 
WhatsApp [número] para resolver dudas.

¡Saludos!"
```

---

## 📞 Soporte y Ajustes

**Primera semana:** Revisar DIARIAMENTE
**Semanas 2-4:** Revisar cada 2-3 días
**Mes 2+:** Revisión semanal con optimizaciones

**¿Necesitas ayuda?**
- Foro de Google Ads: https://support.google.com/google-ads/community
- Chat de soporte en Google Ads (24/7)
- Llamar a Google Ads directamente (cuando gastas +$1,000/mes te asignan representante)

---

## 🎉 ¡Éxito Garantizado Si...

✅ Sigues esta guía al pie de la letra
✅ No pausas campañas los primeros 14 días
✅ Revisas y optimizas semanalmente
✅ Respondes leads en menos de 30 minutos
✅ Iteras anuncios constantemente
✅ Mantienes tracking funcionando 100%

**Tu mayor ventaja:** Chat IA 24/7 que ningún competidor tiene. ¡Úsalo como diferenciador en TODOS los anuncios!

---

**Última actualización:** Enero 2026
**Próxima revisión:** Marzo 2026 (según resultados)

🚀 **¡A por ello! Tu primer cliente desde Google Ads está a una semana de distancia.**
