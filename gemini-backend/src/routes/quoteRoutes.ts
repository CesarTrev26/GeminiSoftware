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
          <style>
            body { margin: 0; padding: 0; }
            table { border-spacing: 0; border-collapse: collapse; }
            img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="padding: 20px 10px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,55,153,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%); padding: 35px 20px; text-align: center;">
                      <h1 style="color: white; margin: 0 0 8px; font-size: 26px; font-weight: 600; line-height: 1.2;">💼 Nueva Cotización</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px; line-height: 1.4;">Solicitud desde el formulario web</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <!-- Company Info -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #00D3FF;">
                        <tr>
                          <td style="padding: 22px 20px;">
                            <h2 style="color: #01183D; margin: 0 0 16px; font-size: 18px; font-weight: 600; line-height: 1.3;">🏢 Información de la Empresa</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Empresa</div>
                                  <div style="color: #01183D; font-size: 17px; font-weight: 600; line-height: 1.4;">${companyName}</div>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Giro del Negocio</div>
                                  <div style="color: #01183D; font-size: 15px; font-weight: 500; line-height: 1.5;">${businessType}</div>
                                </td>
                              </tr>
                              ${websiteGoal ? `
                              <tr>
                                <td>
                                  <div style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Objetivo del Sitio</div>
                                  <div style="color: #333; font-size: 14px; line-height: 1.5;">${websiteGoal}</div>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Contact Info -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">📞 Información de Contacto</h3>
                            ${contactEmail ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;">📧 <a href="mailto:${contactEmail}" style="color: #003799; text-decoration: none; font-weight: 500;">${contactEmail}</a></p>` : ''}
                            ${contactPhone ? `<p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;">📱 <a href="tel:${contactPhone}" style="color: #003799; text-decoration: none; font-weight: 500;">${contactPhone}</a></p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Platform -->
                      ${platform ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🖥️ Plataforma</h3>
                            <p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Preferencia:</strong> <span style="display: inline-block; background: #00D3FF; color: #01183D; padding: 4px 12px; border-radius: 15px; font-size: 13px; font-weight: 600; line-height: 1.4;">${platform}</span></p>
                            ${platformReason ? `<p style="margin: 0; line-height: 1.6; color: #555; font-size: 14px;">Razón: ${platformReason}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Design -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🎨 Diseño</h3>
                            <p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">¿Tiene diseño?</strong> ${hasDesign || 'No especificado'}</p>
                            ${visualIdentity ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Identidad Visual:</strong> ${safeJsonParse(visualIdentity).join(', ')}</p>` : ''}
                            ${inspirationUrls ? `<p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Referencias:</strong> ${inspirationUrls}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Content & Pages -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">📄 Contenido del Sitio</h3>
                            ${pageCount ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Cantidad de páginas:</strong> ${pageCount}</p>` : ''}
                            ${pages ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Páginas solicitadas:</strong><br>${safeJsonParse(pages).map((p: string) => `<span style="display: inline-block; background: #f0f4f8; color: #333; padding: 4px 10px; border-radius: 12px; margin: 3px 3px 3px 0; font-size: 13px; line-height: 1.4;">${p}</span>`).join('')}</p>` : ''}
                            ${features ? `<p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Funcionalidades:</strong><br>${safeJsonParse(features).map((f: string) => `<span style="display: inline-block; background: #e8f4ff; color: #01183D; padding: 4px 10px; border-radius: 12px; margin: 3px 3px 3px 0; font-size: 13px; line-height: 1.4;">✓ ${f}</span>`).join('')}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Store -->
                      ${hasStore ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #F59E0B;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🛒 Tienda en Línea</h3>
                            ${productCount ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Cantidad de productos:</strong> ${productCount}</p>` : ''}
                            ${storeFeatures ? `<p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Características de la tienda:</strong><br>${safeJsonParse(storeFeatures).map((f: string) => `<span style="display: inline-block; background: white; color: #333; padding: 4px 10px; border-radius: 12px; margin: 3px 3px 3px 0; font-size: 13px; line-height: 1.4;">🛍️ ${f}</span>`).join('')}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Support & Training -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🎓 Soporte y Capacitación</h3>
                            ${contentProvider ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Proveedor de contenido:</strong> ${contentProvider}</p>` : ''}
                            ${needsTraining ? `<p style="margin: 0 0 8px; line-height: 1.6; color: #333; font-size: 14px;">✅ Requiere capacitación</p>` : ''}
                            ${supportPeriod ? `<p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;"><strong style="color: #01183D;">Periodo de soporte:</strong> ${supportPeriod}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Timeline -->
                      ${launchDate ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #e6f7ff 0%, #cceeff 100%); border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #003799;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">⏰ Tiempos</h3>
                            <p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;">📅 <strong style="color: #01183D;">Fecha de lanzamiento deseada:</strong> ${launchDate}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Additional Info -->
                      ${additionalInfo ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <h3 style="color: #01183D; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">💬 Información Adicional</h3>
                            <p style="color: #333; line-height: 1.6; margin: 0; font-size: 14px;">${additionalInfo}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Request ID & Timestamp -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); border-radius: 10px; margin-bottom: 22px; border-left: 4px solid #00D3FF;">
                        <tr>
                          <td style="padding: 18px 20px;">
                            <p style="margin: 0 0 10px; line-height: 1.6; color: #01183D; font-size: 14px;"><strong>🆔 ID de Solicitud:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace; color: #01183D; font-size: 13px;">${quoteRequest.id}</code></p>
                            <p style="margin: 0; line-height: 1.6; color: #666; font-size: 14px;"><strong>📅 Recibido:</strong> ${new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Action Buttons -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="padding: 10px 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                ${contactPhone ? `
                                <td style="padding: 0 5px;">
                                  <a href="https://wa.me/52${contactPhone.replace(/\D/g, '')}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.4;">📱 WhatsApp</a>
                                </td>
                                ` : ''}
                                ${contactEmail ? `
                                <td style="padding: 0 5px;">
                                  <a href="mailto:${contactEmail}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #003799 0%, #00D3FF 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.4;">📧 Email</a>
                                </td>
                                ` : ''}
                              </tr>
                              <tr>
                                <td colspan="2" align="center" style="padding: 10px 5px 0;">
                                  <a href="${process.env.FRONTEND_URL || 'https://geminisoftware.mx'}/admin" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #01183D 0%, #003799 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.4;">🎛️ Ver en Admin Panel</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #01183D 0%, #003799 100%); padding: 22px 20px; text-align: center;">
                      <p style="color: rgba(255,255,255,0.95); margin: 0 0 4px; font-size: 14px; font-weight: 500; line-height: 1.4;">Gemini Software</p>
                      <p style="color: rgba(0,211,255,0.9); margin: 0; font-size: 13px; font-weight: 400; line-height: 1.4;">Desarrollo de Software y Sitios Web Profesionales</p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
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
