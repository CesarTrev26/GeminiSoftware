import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const router = Router();
const prisma = new PrismaClient();

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Helper function to safely parse JSON or comma-separated strings
const safeJsonParse = (value: string | null | undefined): string[] => {
  if (!value) return [];
  
  // If it's already an array, return it
  if (Array.isArray(value)) return value;
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If JSON parse fails, try splitting by comma
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    // If it's a single value string
    if (typeof value === 'string' && value.trim().length > 0) {
      return [value.trim()];
    }
    return [];
  }
};

// POST /api/quotes - Crear nueva solicitud de cotización
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      companyName,
      businessType,
      websiteGoal,
      platform,
      platformReason,
      hasDesign,
      visualIdentity,
      inspirationUrls,
      pageCount,
      pages,
      features,
      hasStore,
      productCount,
      storeFeatures,
      contentProvider,
      needsTraining,
      supportPeriod,
      launchDate,
      budget,
      additionalInfo,
      contactEmail,
      contactPhone
    } = req.body;

    // Validaciones básicas
    if (!companyName || !businessType) {
      res.status(400).json({ error: 'Company name and business type are required' });
      return;
    }

    // Obtener metadata
    const ip = req.ip || req.headers['x-forwarded-for'] as string || '';
    const userAgent = req.headers['user-agent'] || '';

    // Normalize array fields (handle both JSON arrays and comma-separated strings)
    const normalizeArray = (value: string | null | undefined): string | null => {
      if (!value) return null;
      const parsed = safeJsonParse(value);
      return parsed.length > 0 ? JSON.stringify(parsed) : null;
    };

    // Crear solicitud de cotización
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        companyName,
        businessType,
        websiteGoal,
        platform,
        platformReason,
        hasDesign,
        visualIdentity: normalizeArray(visualIdentity),
        inspirationUrls,
        pageCount,
        pages: normalizeArray(pages),
        features: normalizeArray(features),
        hasStore: hasStore || false,
        productCount,
        storeFeatures: normalizeArray(storeFeatures),
        contentProvider,
        needsTraining: needsTraining || false,
        supportPeriod,
        launchDate,
        budget,
        additionalInfo,
        contactEmail,
        contactPhone,
        ip,
        userAgent,
        source: 'website-form'
      }
    });

    // Enviar email de notificación
    console.log('📧 Preparando envío de email...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? '✅ Set' : '❌ Not set',
      pass: process.env.SMTP_PASS ? '✅ Set' : '❌ Not set',
      from: process.env.SMTP_USER,
      to: `${process.env.SMTP_USER}, ${process.env.ADMIN_EMAIL}`
    });
    
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; background: #f0f4f8; font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,55,153,0.1);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"/%3E%3Cpath d=\"M0 0h1v1H0zM19 19h1v1h-1z\" fill=\"rgba(255,255,255,0.1)\"/%3E%3C/svg%3E'); opacity: 0.3;"></div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; position: relative; z-index: 1;">💼 Nueva Cotización</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; position: relative; z-index: 1;">Solicitud desde el formulario web</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Company Info -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #00D3FF;">
                <h2 style="color: #01183D; margin: 0 0 20px; font-size: 20px; font-weight: 600;">🏢 Información de la Empresa</h2>
                <div style="display: grid; gap: 15px;">
                  <div>
                    <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Empresa</div>
                    <div style="color: #01183D; font-size: 18px; font-weight: 600;">${companyName}</div>
                  </div>
                  <div>
                    <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Giro del Negocio</div>
                    <div style="color: #01183D; font-size: 16px; font-weight: 500;">${businessType}</div>
                  </div>
                  ${websiteGoal ? `
                  <div>
                    <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Objetivo del Sitio</div>
                    <div style="color: #333; font-size: 15px;">${websiteGoal}</div>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Contact Info -->
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">📞 Información de Contacto</h3>
                ${contactEmail ? `<p style="margin: 8px 0;">📧 <a href="mailto:${contactEmail}" style="color: #003799; text-decoration: none; font-weight: 500;">${contactEmail}</a></p>` : ''}
                ${contactPhone ? `<p style="margin: 8px 0;">📱 <a href="tel:${contactPhone}" style="color: #003799; text-decoration: none; font-weight: 500;">${contactPhone}</a></p>` : ''}
              </div>
              
              <!-- Platform -->
              ${platform ? `
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">🖥️ Plataforma</h3>
                <p style="margin: 8px 0;"><strong>Preferencia:</strong> <span style="display: inline-block; background: #00D3FF; color: #01183D; padding: 4px 12px; border-radius: 15px; font-size: 13px; font-weight: 600;">${platform}</span></p>
                ${platformReason ? `<p style="margin: 8px 0; color: #555;">Razón: ${platformReason}</p>` : ''}
              </div>
              ` : ''}
              
              <!-- Design -->
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">🎨 Diseño</h3>
                <p style="margin: 8px 0;"><strong>¿Tiene diseño?</strong> ${hasDesign || 'No especificado'}</p>
                ${visualIdentity ? `<p style="margin: 8px 0;"><strong>Identidad Visual:</strong> ${safeJsonParse(visualIdentity).join(', ')}</p>` : ''}
                ${inspirationUrls ? `<p style="margin: 8px 0;"><strong>Referencias:</strong> ${inspirationUrls}</p>` : ''}
              </div>
              
              <!-- Content & Pages -->
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">📄 Contenido del Sitio</h3>
                ${pageCount ? `<p style="margin: 8px 0;"><strong>Cantidad de páginas:</strong> ${pageCount}</p>` : ''}
                ${pages ? `<p style="margin: 8px 0;"><strong>Páginas solicitadas:</strong><br>${safeJsonParse(pages).map((p: string) => `<span style="display: inline-block; background: #f0f4f8; padding: 4px 10px; border-radius: 12px; margin: 3px; font-size: 13px;">${p}</span>`).join('')}</p>` : ''}
                ${features ? `<p style="margin: 8px 0;"><strong>Funcionalidades:</strong><br>${safeJsonParse(features).map((f: string) => `<span style="display: inline-block; background: #e8f4ff; padding: 4px 10px; border-radius: 12px; margin: 3px; font-size: 13px;">✓ ${f}</span>`).join('')}</p>` : ''}
              </div>
              
              <!-- Store -->
              ${hasStore ? `
              <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">🛒 Tienda en Línea</h3>
                ${productCount ? `<p style="margin: 8px 0;"><strong>Cantidad de productos:</strong> ${productCount}</p>` : ''}
                ${storeFeatures ? `<p style="margin: 8px 0;"><strong>Características de la tienda:</strong><br>${safeJsonParse(storeFeatures).map((f: string) => `<span style="display: inline-block; background: white; padding: 4px 10px; border-radius: 12px; margin: 3px; font-size: 13px;">🛍️ ${f}</span>`).join('')}</p>` : ''}
              </div>
              ` : ''}
              
              <!-- Support & Training -->
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">🎓 Soporte y Capacitación</h3>
                ${contentProvider ? `<p style="margin: 8px 0;"><strong>Proveedor de contenido:</strong> ${contentProvider}</p>` : ''}
                ${needsTraining ? `<p style="margin: 8px 0;">✅ Requiere capacitación</p>` : ''}
                ${supportPeriod ? `<p style="margin: 8px 0;"><strong>Periodo de soporte:</strong> ${supportPeriod}</p>` : ''}
              </div>
              
              <!-- Timeline & Budget -->
              <div style="background: linear-gradient(135deg, #e6f7ff 0%, #cceeff 100%); border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #003799;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">💰 Presupuesto y Tiempos</h3>
                ${launchDate ? `<p style="margin: 8px 0;">📅 <strong>Fecha de lanzamiento deseada:</strong> ${launchDate}</p>` : ''}
                ${budget ? `<p style="margin: 8px 0;">💵 <strong>Presupuesto:</strong> ${budget}</p>` : ''}
              </div>
              
              <!-- Additional Info -->
              ${additionalInfo ? `
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">💬 Información Adicional</h3>
                <p style="color: #333; line-height: 1.6; margin: 0;">${additionalInfo}</p>
              </div>
              ` : ''}
              
              <!-- Request ID & Timestamp -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #00D3FF;">
                <p style="margin: 0 0 10px; color: #01183D;"><strong>🆔 ID de Solicitud:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${quoteRequest.id}</code></p>
                <p style="margin: 0; color: #666;"><strong>📅 Recibido:</strong> ${new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })}</p>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center;">
                ${contactPhone ? `
                <a href="https://wa.me/52${contactPhone.replace(/\D/g, '')}" 
                   style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                  📱 WhatsApp
                </a>
                ` : ''}
                ${contactEmail ? `
                <a href="mailto:${contactEmail}" 
                   style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #003799 0%, #00D3FF 100%); color: white; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(0,55,153,0.3);">
                  📧 Email
                </a>
                ` : ''}
                <a href="${process.env.FRONTEND_URL || 'https://geminisoftware.mx'}/admin" 
                   style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #01183D 0%, #003799 100%); color: white; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(1,24,61,0.3);">
                  🎛️ Ver en Admin Panel
                </a>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #01183D 0%, #003799 100%); padding: 25px 30px; text-align: center;">
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 13px;">Gemini Software</p>
              <p style="color: rgba(0,211,255,0.9); margin: 5px 0 0; font-size: 12px; font-weight: 500;">Desarrollo de Software y Sitios Web Profesionales</p>
            </div>
            
          </div>
        </body>
        </html>
      `;

      const emailInfo = await transporter.sendMail({
        from: `"Gemini Software" <${process.env.SMTP_USER}>`,
        to: `${process.env.SMTP_USER || 'contact@geminisoftware.mx'}, ${process.env.ADMIN_EMAIL || 'cesar.trevino@geminisoftware.mx'}`,
        subject: `💼 Nueva Cotización - ${companyName}`,
        html: emailHtml
      });
      
      console.log('✅ Email enviado exitosamente!');
      console.log('Message ID:', emailInfo.messageId);
      console.log('Response:', emailInfo.response);
    } catch (emailError) {
      console.error('❌ Error sending email:');
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message);
      }
      console.error('Full error:', emailError);
      // No fallar la request si el email falla
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      id: quoteRequest.id
    });
  } catch (error) {
    console.error('Error creating quote request:', error);
    res.status(500).json({ error: 'Failed to submit quote request' });
  }
});

// GET /api/quotes - Obtener todas las solicitudes (requiere auth)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where = status ? { status: status as string } : {};
    
    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.quoteRequest.count({ where })
    ]);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quotes' });
  }
});

// GET /api/quotes/:id - Obtener una solicitud específica
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!quote) {
      res.status(404).json({ error: 'Quote request not found' });
      return;
    }

    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// PATCH /api/quotes/:id - Actualizar estado de solicitud
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes, quotedAmount, assignedToId } = req.body;

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(quotedAmount !== undefined && { quotedAmount }),
        ...(assignedToId !== undefined && { assignedToId })
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

// DELETE /api/quotes/:id - Eliminar solicitud
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.quoteRequest.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Quote request deleted' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

export default router;
