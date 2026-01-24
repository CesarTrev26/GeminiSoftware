import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
- Si detectas interés de compra, sugiere agendar una llamada
- Responde en español a menos que te escriban en otro idioma

## Reglas importantes:
- NO inventes información que no esté en tu contexto
- Si no sabes algo, ofrece conectar con el equipo humano
- Cuando menciones proyectos, incluye detalles técnicos relevantes
- Si el usuario está interesado, pide su email para contacto
- Mantén respuestas cortas y al punto`;

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
    return 'Los precios varían según el proyecto. Para darte una cotización precisa, ¿podrías contarme más sobre lo que necesitas? También puedes dejarnos tu email y te contactamos para agendar una llamada. 📞';
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
    } catch (geminiError) {
      console.error('Gemini Error:', geminiError);
      isAIAvailable = false;
      assistantMessage = generateFallbackResponse(message, relatedProjects);
    }

    // Guardar respuesta del asistente
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantMessage,
        projects: relatedProjects.length > 0 ? JSON.stringify(relatedProjects.map(p => p.slug)) : null,
      }
    });

    return res.json({
      success: true,
      data: {
        message: assistantMessage,
        projects: relatedProjects.length > 0 ? relatedProjects : undefined,
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
