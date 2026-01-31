import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sendHotLeadNotification, sendPotentialLeadNotification } from '../services/emailService';

const prisma = new PrismaClient();

// Initialize Google Gemini client only if API key is available
let genAI: GoogleGenerativeAI | null = null;
let geminiModel: any = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Usar Gemini 2.0 Flash - rápido, gratuito y potente
  geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

interface ChatRequest {
  message: string;
  sessionId: string;
  visitorName?: string;
  visitorEmail?: string;
}

// System prompt con contexto de Gemini Software
const SYSTEM_PROMPT = `Eres el asistente virtual de Gemini Software, una empresa de desarrollo de software en Monterrey, México.

## Sobre Gemini Software:
- Especialistas en desarrollo web, apps móviles, software empresarial y marketing digital
- +5 años de experiencia en proyectos de alto impacto
- Clientes como NEST Desarrollo Inmobiliario, Nature's Factory, entre otros
- Stack tecnológico moderno: React, Next.js, Astro, Node.js, TypeScript, Prisma, etc.
- Ubicación: Monterrey, Nuevo León, México

## Información de Contacto:
- 📧 Email: contacto@geminisoftware.mx
- 📱 WhatsApp: +52 81 8020 7890
- 🌐 Web: https://geminisoftware.mx
- 📍 Monterrey, Nuevo León, México
- ⏰ Horario: Lun-Vie 9:00-18:00 (GMT-6)

## Servicios principales:
1. **Desarrollo Web**: Sitios corporativos, landing pages, portales - Next.js, Astro, React
2. **E-Commerce**: Tiendas Shopify, WooCommerce, personalizadas
3. **Software Empresarial**: CRM, ERP, sistemas de gestión a medida
4. **Apps Móviles**: React Native, Flutter, nativas iOS/Android
5. **Diseño UI/UX**: Interfaces modernas, wireframes, prototipos
6. **Marketing Digital**: SEO, SEM, redes sociales

## Proyectos destacados:
- ANIDA: Sitio inmobiliario con Next.js, recorridos 3D, Lighthouse 95+
- WE2T: Portal inmobiliario premium con GSAP, Bootstrap, Zapier
- NEST: Sitio corporativo con Contentful CMS, 25+ proyectos mostrados
- Nature's Factory: E-commerce Shopify con 200+ productos
- RISE TOWER: Landing premium para la torre más alta de Latinoamérica (484m)
- CRM Ventas: Sistema React + Node.js para gestión inmobiliaria

## Tu personalidad:
- Amable, profesional pero cercano
- Respuestas concisas pero informativas (máximo 3-4 párrafos)
- Usa emojis ocasionalmente para ser más amigable
- Si el usuario pregunta algo técnico, da detalles relevantes
- Si detectas interés de compra, sugiere contactar y ofrece la información de contacto
- **SIEMPRE proporciona la información de contacto cuando la pidan**
- Responde en español a menos que te escriban en otro idioma

## Límites y Responsabilidades:
⚠️ **NO PUEDES hacer lo siguiente:**
- ❌ NO des precios específicos, tarifas o costos (cada proyecto es único)
- ❌ NO hagas cotizaciones ni presupuestos (requieren análisis detallado)
- ❌ NO prometas fechas de entrega o tiempos exactos
- ❌ NO firmes contratos ni acuerdos en nombre de la empresa
- ❌ NO hagas compromisos contractuales o garantías específicas
- ❌ NO des información legal, fiscal o contable
- ❌ NO compartas información confidencial de clientes

✅ **SÍ PUEDES hacer:**
- Explicar servicios y metodologías de trabajo
- Mostrar ejemplos de proyectos similares del portafolio
- Describir tecnologías y enfoques técnicos utilizados
- Proporcionar información de contacto
- Dirigir al formulario de contacto (geminisoftware.mx/contacto)
- Responder preguntas generales sobre desarrollo web/software

## Reglas importantes:
- NO inventes información que no esté en tu contexto
- Si no sabes algo, ofrece conectar con el equipo humano y proporciona los datos de contacto
- Cuando mencionen proyectos, incluye detalles técnicos relevantes
- **Si preguntan por PRECIOS/COSTOS:** Explica que cada proyecto es único y requiere análisis personalizado. Invita a contactar directamente en geminisoftware.mx/contacto o por WhatsApp/email
- **Si preguntan CUÁNTO TARDA:** Explica que depende del alcance y complejidad. Ofrece agendar llamada para evaluar
- Si preguntan cómo contactar, da la info completa: email, WhatsApp, y horarios
- Mantén respuestas cortas y al punto
- Cuando detectes un lead calificado (interés real en servicios), marca el mensaje como HOT_LEAD`;

// Función para buscar proyectos relacionados en la DB
async function searchRelatedProjects(query: string) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(' ').filter(w => w.length > 2);
  
  // Palabras clave específicas para buscar proyectos
  const hasProjectKeywords = queryLower.match(/proyecto|portafolio|portfolio|ejemplo|muestra|caso|trabajo|web|sitio|app|móvil|mobile|ecommerce|e-commerce|tienda|shop|crm|sistema|desarrollo|next|react|astro|shopify/i);
  
  // Si menciona proyectos explícitamente, buscar todos los destacados
  if (hasProjectKeywords) {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
          { tags: { contains: query } },
          ...keywords.map(k => ({ title: { contains: k } })),
          ...keywords.map(k => ({ description: { contains: k } })),
          ...keywords.map(k => ({ category: { contains: k } })),
          ...keywords.map(k => ({ tags: { contains: k } })),
        ]
      },
      select: {
        slug: true,
        title: true,
        category: true,
        description: true,
      },
      take: 5,
      orderBy: { featured: 'desc' }
    });
    
    // Si no hay coincidencias específicas, mostrar proyectos destacados
    if (projects.length === 0) {
      return await prisma.project.findMany({
        where: { published: true, featured: true },
        select: {
          slug: true,
          title: true,
          category: true,
          description: true,
        },
        take: 3,
        orderBy: { order: 'asc' }
      });
    }
    
    return projects;
  }
  
  // Búsqueda normal por keywords
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { category: { contains: query } },
        { tags: { contains: query } },
        ...keywords.map(k => ({ tags: { contains: k } })),
      ]
    },
    select: {
      slug: true,
      title: true,
      category: true,
      description: true,
    },
    take: 3
  });

  return projects;
}

// Fallback cuando OpenAI no está disponible
function generateFallbackResponse(message: string, projects: Array<{ title: string; slug: string; category: string }>) {
  const messageLower = message.toLowerCase();

  if (messageLower.match(/^(hola|buenas|hi|hello|hey)/)) {
    return '¡Hola! 👋 Soy el asistente de Gemini Software. ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros servicios de desarrollo web, apps móviles, software empresarial o marketing digital.';
  }

  if (messageLower.includes('servicio') || messageLower.includes('qué hacen')) {
    return 'En Gemini Software ofrecemos:\n\n🌐 **Desarrollo Web** - Sitios modernos con React, Next.js, Astro\n🛒 **E-Commerce** - Tiendas Shopify y personalizadas\n💻 **Software a Medida** - CRM, ERP, sistemas empresariales\n📱 **Apps Móviles** - iOS y Android\n🎨 **Diseño UI/UX** - Interfaces profesionales\n\n¿Cuál te interesa?';
  }

  if (messageLower.includes('precio') || messageLower.includes('costo') || messageLower.includes('cotiz')) {
    return 'No puedo darte precios exactos porque cada proyecto es único y requiere análisis personalizado. 💡\n\nPara una cotización precisa:\n📋 Contáctanos: https://www.geminisoftware.mx/contacto\n📧 Escríbenos: contact@geminisoftware.mx\n💬 WhatsApp: +52 477 237 4064\n\n¿Quieres contarme más sobre tu proyecto mientras tanto?';
  }

  if (projects.length > 0) {
    return `Encontré estos proyectos relacionados con tu consulta:\n\n${projects.map(p => `• **${p.title}** - ${p.category}`).join('\n')}\n\n¿Te gustaría saber más detalles de alguno?`;
  }

  return 'Gracias por tu mensaje. ¿Podrías darme más detalles sobre lo que buscas? Puedo ayudarte con desarrollo web, e-commerce, software empresarial o apps móviles.';
}

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, sessionId, visitorName, visitorEmail }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Mensaje inválido'
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'SessionId requerido'
      });
    }

    // Buscar o crear conversación
    let conversation = await prisma.chatConversation.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          sessionId,
          visitorName,
          visitorEmail,
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          source: req.headers.referer,
        },
        include: { messages: true }
      });
    } else if (visitorName || visitorEmail) {
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: {
          visitorName: visitorName || conversation.visitorName,
          visitorEmail: visitorEmail || conversation.visitorEmail,
        }
      });
    }

    // Guardar mensaje del usuario
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      }
    });

    // Buscar proyectos relacionados para contexto
    const relatedProjects = await searchRelatedProjects(message);

    // Construir contexto adicional
    let contextMessage = '';
    if (relatedProjects.length > 0) {
      contextMessage += '\n\n[Contexto: Proyectos relevantes en la base de datos:\n';
      relatedProjects.forEach(p => {
        contextMessage += `- ${p.title} (${p.category}): ${p.description?.substring(0, 150)}...\n`;
      });
      contextMessage += ']';
    }

    // Preparar historial para Gemini
    let conversationHistory = '';
    for (const msg of conversation.messages) {
      conversationHistory += `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}\n\n`;
    }

    // Construir el prompt completo
    const fullPrompt = `${SYSTEM_PROMPT}${contextMessage}

${conversationHistory}Usuario: ${message}

Asistente:`;

    // Llamar a Google Gemini
    let assistantMessage = '';
    let isAIAvailable = true;
    let aiMentionedProjects: Array<{ slug: string; title: string; category: string; description: string }> = [];

    try {
      if (!geminiModel) {
        throw new Error('Gemini API key not configured');
      }

      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 400,
          topP: 0.8,
          topK: 40,
        },
      });

      const response = await result.response;
      assistantMessage = response.text() || 'Lo siento, no pude procesar tu mensaje.';
      
      // Extraer nombres de proyectos mencionados en la respuesta de la IA
      const projectNames = ['ANIDA', 'Nature\'s Factory', 'RISE TOWER', 'NEST', 'WE2T', 'W3ST', 'CRM Ventas', 'Gemini Software'];
      const mentionedProjects = projectNames.filter(name => 
        assistantMessage.includes(name) || assistantMessage.toLowerCase().includes(name.toLowerCase())
      );
      
      // Si la IA menciona proyectos, buscarlos en la DB
      if (mentionedProjects.length > 0) {
        aiMentionedProjects = await prisma.project.findMany({
          where: {
            published: true,
            OR: mentionedProjects.map(name => ({ title: { contains: name } }))
          },
          select: {
            slug: true,
            title: true,
            category: true,
            description: true,
          },
          take: 5
        });
      }
    } catch (geminiError) {
      console.error('Gemini Error:', geminiError);
      isAIAvailable = false;
      assistantMessage = generateFallbackResponse(message, relatedProjects);
    }

    // Combinar proyectos relacionados con los mencionados por la IA
    const allProjects = [...relatedProjects];
    for (const aiProject of aiMentionedProjects) {
      if (!allProjects.find(p => p.slug === aiProject.slug)) {
        allProjects.push(aiProject);
      }
    }

    // Detectar intención del usuario para clasificar el lead
    const messageLower = message.toLowerCase();
    const leadKeywords = ['precio', 'costo', 'cotizar', 'cotización', 'cuanto', 'cuánto', 'contratar', 'necesito', 'proyecto', 'desarrollar', 'hacer', 'crear', 'quiero', 'interesa', 'contacto', 'email', 'teléfono', 'whatsapp', 'llamar', 'reunión', 'junta'];
    const hasLeadIntent = leadKeywords.some(keyword => messageLower.includes(keyword));
    
    // Detectar si es un lead caliente (múltiples señales de interés)
    const isHotLead = (hasLeadIntent && (
      messageLower.includes('precio') || 
      messageLower.includes('costo') ||
      messageLower.includes('cotizar') ||
      messageLower.includes('contratar') ||
      messageLower.includes('necesito') ||
      (conversation.visitorEmail && conversation.messages.length > 3)
    ));

    // Actualizar el estado de la conversación si hay señales de lead
    if (isHotLead && conversation.status === 'ACTIVE') {
      await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { 
          status: 'HOT_LEAD',
          notes: `Lead caliente detectado. Mensaje: "${message.substring(0, 100)}..."`
        }
      });

      // 🔥 ENVIAR EMAIL DE NOTIFICACIÓN PARA LEAD CALIENTE
      console.log('🔥 Lead caliente detectado! Enviando email...');
      try {
        const adminUrl = process.env.NODE_ENV === 'production' 
          ? 'https://geminisoftware.mx/admin'
          : 'http://localhost:4321/admin';
        
        await sendHotLeadNotification({
          visitorName: conversation.visitorName || undefined,
          visitorEmail: conversation.visitorEmail || undefined,
          sessionId: conversation.sessionId,
          lastMessage: message,
          messageCount: conversation.messages.length + 1, // +1 por el mensaje actual
          conversationUrl: `${adminUrl}#conversations`
        });
      } catch (emailError) {
        console.error('❌ Error enviando email de lead caliente:', emailError);
        // No bloqueamos la respuesta por error de email
      }
    } else if (hasLeadIntent && conversation.status === 'ACTIVE' && conversation.messages.length > 2) {
      const updatedConv = await prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { 
          status: 'POTENTIAL_LEAD',
          notes: `Lead potencial. Mostró interés con: "${message.substring(0, 100)}..."`
        }
      });

      // ⭐ ENVIAR EMAIL DE NOTIFICACIÓN PARA LEAD POTENCIAL (solo la primera vez)
      if (conversation.status === 'ACTIVE') { // Solo si es la primera vez que se marca como potencial
        console.log('⭐ Lead potencial detectado! Enviando email...');
        try {
          await sendPotentialLeadNotification({
            visitorName: updatedConv.visitorName || undefined,
            visitorEmail: updatedConv.visitorEmail || undefined,
            sessionId: updatedConv.sessionId,
            messageCount: conversation.messages.length + 1
          });
        } catch (emailError) {
          console.error('❌ Error enviando email de lead potencial:', emailError);
        }
      }
    }

    // Guardar respuesta del asistente
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantMessage,
        projects: allProjects.length > 0 ? JSON.stringify(allProjects.map(p => p.slug)) : null,
      }
    });

    return res.json({
      success: true,
      data: {
        message: assistantMessage,
        projects: allProjects.length > 0 ? allProjects : undefined,
        sessionId,
        isAI: isAIAvailable,
      }
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el mensaje'
    });
  }
};

// Obtener historial de conversación
export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const conversation = await prisma.chatConversation.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.json({
        success: true,
        data: { messages: [] }
      });
    }

    return res.json({
      success: true,
      data: {
        sessionId: conversation.sessionId,
        messages: conversation.messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt,
          projects: m.projects ? JSON.parse(m.projects) : undefined
        }))
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener historial'
    });
  }
};

// Búsqueda de proyectos
export const searchProjects = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Query inválido'
      });
    }

    const projects = await searchRelatedProjects(query);

    return res.json({
      success: true,
      data: {
        projects,
        message: projects.length > 0 ? undefined : 'No se encontraron proyectos con esos términos.'
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al buscar proyectos'
    });
  }
};

// Listar todas las conversaciones (admin)
export const listConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await prisma.chatConversation.findMany({
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { messages: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50
    });

    return res.json({
      success: true,
      data: conversations.map(c => ({
        id: c.id,
        sessionId: c.sessionId,
        visitorName: c.visitorName,
        visitorEmail: c.visitorEmail,
        status: c.status,
        notes: c.notes,
        messageCount: c._count.messages,
        lastMessage: c.messages[0]?.content?.substring(0, 100),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }))
    });
  } catch (error) {
    console.error('List conversations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al listar conversaciones'
    });
  }
};

// Obtener una conversación completa con todos los mensajes (admin)
export const getConversationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversación no encontrada'
      });
    }

    return res.json({
      success: true,
      data: {
        ...conversation,
        messages: conversation.messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          projects: m.projects ? JSON.parse(m.projects) : undefined,
          createdAt: m.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener conversación'
    });
  }
};

// Actualizar estado de conversación (admin)
export const updateConversationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['ACTIVE', 'POTENTIAL_LEAD', 'HOT_LEAD', 'CONVERTED', 'CLOSED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    const conversation = await prisma.chatConversation.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });

    return res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Update conversation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar conversación'
    });
  }
};
