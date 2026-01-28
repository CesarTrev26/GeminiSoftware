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
      customPages,
      features,
      customFeatures,
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
        customPages,
        features: normalizeArray(features),
        customFeatures,
        hasStore: hasStore === 'Sí',
        productCount,
        storeFeatures: normalizeArray(storeFeatures),
        contentProvider,
        needsTraining: needsTraining === 'Sí',
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
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <style>
            body { margin: 0; padding: 0; }
            table { border-spacing: 0; border-collapse: collapse; }
            img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
            [data-ogsc] { background-color: #ffffff !important; }
            [data-ogsc] * { color: inherit !important; }
            @media (prefers-color-scheme: dark) {
              .email-body, .email-body * { background-color: #f0f4f8 !important; }
              .email-container, .email-container * { background-color: #ffffff !important; }
              .email-text { color: #333333 !important; }
              .email-heading { color: #01183D !important; }
            }
          </style>
        </head>
        <body class="email-body" bgcolor="#f0f4f8" style="margin: 0; padding: 0; background-color: #f0f4f8 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f4f8">
            <tr>
              <td align="center" bgcolor="#f0f4f8" style="padding: 20px 10px; background-color: #f0f4f8 !important;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="email-container" bgcolor="#ffffff" style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,55,153,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%); padding: 35px 20px; text-align: center;">
                      <h1 style="color: white !important; margin: 0 0 8px; font-size: 26px; font-weight: 600; line-height: 1.2;">💼 Nueva Cotización</h1>
                      <p style="color: rgba(255,255,255,0.9) !important; margin: 0; font-size: 14px; line-height: 1.4;">Solicitud desde el formulario web</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <!-- Company Info -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); background-color: #f8f9ff !important; border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #00D3FF;">
                        <tr>
                          <td style="padding: 22px 20px; background-color: transparent !important;">
                            <h2 style="color: #01183D !important; margin: 0 0 16px; font-size: 18px; font-weight: 600; line-height: 1.3;">🏢 Información de la Empresa</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Empresa</div>
                                  <div style="color: #01183D !important; font-size: 17px; font-weight: 600; line-height: 1.4;">${companyName}</div>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Giro del Negocio</div>
                                  <div style="color: #01183D !important; font-size: 15px; font-weight: 500; line-height: 1.5;">${businessType}</div>
                                </td>
                              </tr>
                              ${websiteGoal ? `
                              <tr>
                                <td>
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Objetivo del Sitio</div>
                                  <div style="color: #333 !important; font-size: 14px; line-height: 1.5;">${websiteGoal}</div>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Contact Info -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">📞 Información de Contacto</h3>
                            ${contactEmail ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;">📧 <a href="mailto:${contactEmail}" style="color: #003799 !important; text-decoration: none; font-weight: 500;">${contactEmail}</a></p>` : ''}
                            ${contactPhone ? `<p class="email-text" style="margin: 0; line-height: 1.6; color: #333333 !important; font-size: 14px;">📱 <a href="tel:${contactPhone}" style="color: #003799 !important; text-decoration: none; font-weight: 500;">${contactPhone}</a></p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Platform -->
                      ${platform ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🖥️ Plataforma</h3>
                            <p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Preferencia:</strong> <span bgcolor="#00D3FF" style="display: inline-block; background-color: #00D3FF !important; color: #01183D !important; padding: 4px 12px; border-radius: 15px; font-size: 13px; font-weight: 600; line-height: 1.4;">${platform}</span></p>
                            ${platformReason ? `<p class="email-text" style="margin: 0; line-height: 1.6; color: #555555 !important; font-size: 14px;">Razón: ${platformReason}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Design -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🎨 Diseño</h3>
                            <p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">¿Tiene diseño?</strong> ${hasDesign || 'No especificado'}</p>
                            ${visualIdentity ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Identidad Visual:</strong> ${safeJsonParse(visualIdentity).join(', ')}</p>` : ''}
                            ${inspirationUrls ? `<p class="email-text" style="margin: 0; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Referencias:</strong> ${inspirationUrls}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Content & Pages -->
                      ${(pageCount || pages || customPages || features || customFeatures) ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">📄 Contenido del Sitio</h3>
                            ${pageCount ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Cantidad de páginas:</strong> ${pageCount}</p>` : ''}
                            ${pages ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Páginas solicitadas:</strong><br>${safeJsonParse(pages).map((p: string) => `<span bgcolor="#f0f4f8" style="display: inline-block; background-color: #f0f4f8 !important; color: #333333 !important; padding: 4px 10px; border-radius: 12px; margin: 3px 3px 3px 0; font-size: 13px; line-height: 1.4;">${p}</span>`).join('')}</p>` : ''}
                            ${customPages ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Páginas personalizadas:</strong><br><span bgcolor="#fffbeb" style="display: block; background-color: #fffbeb !important; color: #92400e !important; padding: 10px; border-radius: 8px; margin-top: 6px; font-size: 13px; border-left: 3px solid #f59e0b;">${customPages}</span></p>` : ''}
                            ${features ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Funcionalidades:</strong><br>${safeJsonParse(features).map((f: string) => `<span bgcolor="#e8f4ff" style="display: inline-block; background-color: #e8f4ff !important; color: #01183D !important; padding: 4px 10px; border-radius: 12px; margin: 3px 3px 3px 0; font-size: 13px; line-height: 1.4;">✓ ${f}</span>`).join('')}</p>` : ''}
                            ${customFeatures ? `<p class="email-text" style="margin: 0; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Funcionalidades personalizadas:</strong><br><span bgcolor="#fffbeb" style="display: block; background-color: #fffbeb !important; color: #92400e !important; padding: 10px; border-radius: 8px; margin-top: 6px; font-size: 13px; border-left: 3px solid #f59e0b;">${customFeatures}</span></p>` : ''}
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Store -->
                      ${hasStore ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff5e6" style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); background-color: #fff5e6 !important; border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #F59E0B;">
                        <tr>
                          <td bgcolor="#fff5e6" style="padding: 18px 20px; background-color: #fff5e6 !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🛒 Tienda en Línea</h3>
                            ${productCount ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Cantidad de productos:</strong> ${productCount}</p>` : ''}
                            ${storeFeatures ? `<p class="email-text" style="margin: 0; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Características de la tienda:</strong><br>${safeJsonParse(storeFeatures).map((f: string) => `<span bgcolor="#ffffff" style="display: inline-block; background-color: #ffffff !important; color: #333333 !important; padding: 4px 10px; border-radius: 12px; margin: 3px 3px 3px 0; font-size: 13px; line-height: 1.4;">🛍️ ${f}</span>`).join('')}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Support & Training -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">🎓 Soporte y Capacitación</h3>
                            ${contentProvider ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Proveedor de contenido:</strong> ${contentProvider}</p>` : ''}
                            ${needsTraining ? `<p class="email-text" style="margin: 0 0 8px; line-height: 1.6; color: #333333 !important; font-size: 14px;">✅ Requiere capacitación</p>` : ''}
                            ${supportPeriod ? `<p class="email-text" style="margin: 0; line-height: 1.6; color: #333333 !important; font-size: 14px;"><strong style="color: #01183D !important;">Periodo de soporte:</strong> ${supportPeriod}</p>` : ''}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Timeline -->
                      ${launchDate ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e6f7ff" style="background: linear-gradient(135deg, #e6f7ff 0%, #cceeff 100%); background-color: #e6f7ff !important; border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #003799;">
                        <tr>
                          <td bgcolor="#e6f7ff" style="padding: 18px 20px; background-color: #e6f7ff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">⏰ Tiempos</h3>
                            <p class="email-text" style="margin: 0; line-height: 1.6; color: #333333 !important; font-size: 14px;">📅 <strong style="color: #01183D !important;">Fecha de lanzamiento deseada:</strong> ${launchDate}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Additional Info -->
                      ${additionalInfo ? `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">💬 Información Adicional</h3>
                            <p class="email-text" style="color: #333333 !important; line-height: 1.6; margin: 0; font-size: 14px;">${additionalInfo}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Request ID & Timestamp -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8f9ff" style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); background-color: #f8f9ff !important; border-radius: 10px; margin-bottom: 22px; border-left: 4px solid #00D3FF;">
                        <tr>
                          <td bgcolor="#f8f9ff" style="padding: 18px 20px; background-color: #f8f9ff !important;">
                            <p class="email-text" style="margin: 0 0 10px; line-height: 1.6; color: #01183D !important; font-size: 14px;"><strong>🆔 ID de Solicitud:</strong> <code bgcolor="#ffffff" style="background-color: #ffffff !important; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace; color: #01183D !important; font-size: 13px;">${quoteRequest.id}</code></p>
                            <p class="email-text" style="margin: 0; line-height: 1.6; color: #666666 !important; font-size: 14px;"><strong>📅 Recibido:</strong> ${new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })}</p>
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
                                  <a href="https://geminisoftware.mx/admin" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #01183D 0%, #003799 100%); color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.4;">🎛️ Ver en Admin Panel</a>
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

