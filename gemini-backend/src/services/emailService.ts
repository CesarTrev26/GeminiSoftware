import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface HotLeadNotificationData {
  visitorName?: string;
  visitorEmail?: string;
  sessionId: string;
  lastMessage: string;
  messageCount: number;
  conversationUrl: string;
}

export async function sendHotLeadNotification(data: HotLeadNotificationData): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'cesar.trevino@geminisoftware.mx';
    const fromEmail = process.env.EMAIL_FROM || 'Gemini Software <contact@geminisoftware.mx>';

    const visitorInfo = data.visitorName || 'Visitante Anónimo';
    const emailInfo = data.visitorEmail ? `<br>📧 Email: <strong>${data.visitorEmail}</strong>` : '';
    
    const mailOptions = {
      from: fromEmail,
      to: adminEmail,
      subject: '🔥 NUEVO LEAD CALIENTE - Alguien está interesado en tus servicios!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <meta name="x-apple-disable-message-reformatting">
          <style>
            /* Prevent dark mode transformation */
            :root { color-scheme: light only !important; }
            body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
            
            /* Force light backgrounds */
            [data-ogsc] { background-color: #ffffff !important; }
            [data-ogsc] * { color: inherit !important; }
            
            /* Prevent Gmail dark mode override */
            u + .email-body .gmail-fix { background: #ffffff; }
            u + .email-body .gmail-blend-screen { background: #ffffff; mix-blend-mode: screen; }
            u + .email-body .gmail-blend-difference { background: #ffffff; mix-blend-mode: difference; }
            
            /* Dark mode media query override */
            @media (prefers-color-scheme: dark) {
              body, table, td, div, p, span, h1, h2, h3 { color-scheme: light only !important; }
              .email-body { background-color: #f0f4f8 !important; }
              .email-container { background-color: #ffffff !important; }
              .email-header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8C42 50%, #FFC107 100%) !important; }
              .email-text { color: #333333 !important; }
              .email-heading { color: #01183D !important; }
              .email-white-bg { background-color: #ffffff !important; }
            }
          </style>
        </head>
        <body class="email-body" bgcolor="#f0f4f8" style="margin: 0; padding: 0; background-color: #f0f4f8 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
          <!-- Gmail fix -->
          <span class="gmail-fix" style="display: none; opacity: 0; color: transparent; height: 0; width: 0; line-height: 0; font-size: 0;">&#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;</span>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f4f8" style="background-color: #f0f4f8 !important;">
            <tr>
              <td align="center" bgcolor="#f0f4f8" style="padding: 20px 10px; background-color: #f0f4f8 !important;">
                <div class="gmail-blend-screen">
                  <div class="gmail-blend-difference">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="email-container email-white-bg" bgcolor="#ffffff" style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,55,153,0.08);">
                      
                      <!-- Header -->
                      <tr>
                        <td class="email-header" bgcolor="#FF6B6B" style="background: linear-gradient(135deg, #FF6B6B 0%, #FF8C42 50%, #FFC107 100%) !important; padding: 35px 20px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 10px;">🔥</div>
                      <h1 style="color: white !important; margin: 0 0 8px; font-size: 26px; font-weight: 600; line-height: 1.2;">¡LEAD CALIENTE DETECTADO!</h1>
                      <p style="color: rgba(255,255,255,0.95) !important; margin: 0; font-size: 14px; line-height: 1.4;">Alguien está muy interesado en tus servicios</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <!-- Visitor Info -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); background-color: #f8f9ff !important; border-radius: 10px; margin-bottom: 18px; border-left: 4px solid #FF6B6B;">
                        <tr>
                          <td style="padding: 22px 20px; background-color: transparent !important;">
                            <h2 style="color: #01183D !important; margin: 0 0 16px; font-size: 18px; font-weight: 600; line-height: 1.3;">👤 Información del Visitante</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Nombre</div>
                                  <div style="color: #01183D !important; font-size: 17px; font-weight: 600; line-height: 1.4;">${visitorInfo}</div>
                                </td>
                              </tr>
                              ${emailInfo ? `
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Email</div>
                                  <div style="color: #003799 !important; font-size: 15px; font-weight: 500; line-height: 1.5;"><a href="mailto:${data.visitorEmail}" style="color: #003799 !important; text-decoration: none;">${data.visitorEmail}</a></div>
                                </td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Mensajes Intercambiados</div>
                                  <div style="color: #01183D !important; font-size: 15px; font-weight: 600; line-height: 1.5;">
                                    <span style="display: inline-block; background: linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%); color: white; padding: 4px 12px; border-radius: 15px; font-size: 13px;">${data.messageCount} mensajes</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Session ID</div>
                                  <div style="color: #666 !important; font-size: 12px; font-family: monospace; line-height: 1.5;">${data.sessionId.substring(0, 30)}...</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Last Message -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 18px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 18px 20px; background-color: #ffffff !important;">
                            <h3 class="email-heading" style="color: #01183D !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">💬 Último Mensaje</h3>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 3px solid #003799; font-style: italic; color: #333 !important; line-height: 1.6; font-size: 14px;">
                              "${data.lastMessage.substring(0, 200)}${data.lastMessage.length > 200 ? '...' : ''}"
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="padding: 10px 0 20px 0;">
                            <a href="${data.conversationUrl}" style="display: inline-block; background: linear-gradient(135deg, #00D3FF 0%, #003799 100%); color: white !important; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; line-height: 1.4;">📊 Ver Conversación Completa</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Action Recommendations -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); background-color: #fff5e6 !important; border-radius: 10px; border-left: 4px solid #FFC107;">
                        <tr>
                          <td style="padding: 18px 20px; background-color: transparent !important;">
                            <h3 style="color: #92400e !important; margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.3;">⚡ Acción Recomendada</h3>
                            <p style="margin: 0; line-height: 1.6; color: #92400e !important; font-size: 14px;">
                              Este lead mostró interés real en tus servicios. Te recomendamos:
                            </p>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #92400e !important; line-height: 1.8; font-size: 14px;">
                              <li>Revisar la conversación completa en el admin panel</li>
                              <li>Contactarlo lo antes posible ${data.visitorEmail ? `vía email: <a href="mailto:${data.visitorEmail}" style="color: #92400e !important; font-weight: 600;">${data.visitorEmail}</a>` : ''}</li>
                              <li>Preparar una propuesta personalizada</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa !important; padding: 20px 25px; text-align: center; border-top: 1px solid #e8f4ff;">
                      <p style="margin: 0 0 8px; color: #01183D !important; font-weight: 600; font-size: 14px; line-height: 1.4;">Gemini Software</p>
                      <p style="margin: 0; color: #666 !important; font-size: 13px; line-height: 1.4;">
                        Sistema de Notificación de Leads<br>
                        <a href="https://geminisoftware.mx/admin" style="color: #003799 !important; text-decoration: none; font-weight: 500;">Panel de Administración →</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de lead caliente enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de lead:', error);
    return false;
  }
}

interface PotentialLeadNotificationData {
  visitorName?: string;
  visitorEmail?: string;
  sessionId: string;
  messageCount: number;
}

export async function sendPotentialLeadNotification(data: PotentialLeadNotificationData): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'cesar.trevino@geminisoftware.mx';
    const fromEmail = process.env.EMAIL_FROM || 'Gemini Software <contact@geminisoftware.mx>';

    const visitorInfo = data.visitorName || 'Visitante Anónimo';
    const emailInfo = data.visitorEmail ? ` (${data.visitorEmail})` : '';
    
    const mailOptions = {
      from: fromEmail,
      to: adminEmail,
      subject: '⭐ Lead Potencial - Nueva conversación interesante',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light only">
          <meta name="supported-color-schemes" content="light">
          <meta name="x-apple-disable-message-reformatting">
          <style>
            /* Prevent dark mode transformation */
            :root { color-scheme: light only !important; }
            body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
            
            /* Force light backgrounds */
            [data-ogsc] { background-color: #ffffff !important; }
            [data-ogsc] * { color: inherit !important; }
            
            /* Prevent Gmail dark mode override */
            u + .email-body .gmail-fix { background: #ffffff; }
            u + .email-body .gmail-blend-screen { background: #ffffff; mix-blend-mode: screen; }
            u + .email-body .gmail-blend-difference { background: #ffffff; mix-blend-mode: difference; }
            
            /* Dark mode media query override */
            @media (prefers-color-scheme: dark) {
              body, table, td, div, p, span, h1, h2, h3 { color-scheme: light only !important; }
              .email-body { background-color: #f0f4f8 !important; }
              .email-container { background-color: #ffffff !important; }
              .email-header { background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%) !important; }
              .email-text { color: #333333 !important; }
              .email-heading { color: #01183D !important; }
              .email-white-bg { background-color: #ffffff !important; }
            }
          </style>
        </head>
        <body class="email-body" bgcolor="#f0f4f8" style="margin: 0; padding: 0; background-color: #f0f4f8 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
          <!-- Gmail fix -->
          <span class="gmail-fix" style="display: none; opacity: 0; color: transparent; height: 0; width: 0; line-height: 0; font-size: 0;">&#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;</span>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f4f8" style="background-color: #f0f4f8 !important;">
            <tr>
              <td align="center" bgcolor="#f0f4f8" style="padding: 20px 10px; background-color: #f0f4f8 !important;">
                <div class="gmail-blend-screen">
                  <div class="gmail-blend-difference">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="email-container email-white-bg" bgcolor="#ffffff" style="max-width: 600px; background-color: #ffffff !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,55,153,0.08);">
                      
                      <!-- Header -->
                      <tr>
                        <td class="email-header" bgcolor="#FFC107" style="background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%) !important; padding: 30px 20px; text-align: center;">
                      <div style="font-size: 40px; margin-bottom: 8px;">⭐</div>
                      <h1 style="color: white !important; margin: 0 0 6px; font-size: 22px; font-weight: 600; line-height: 1.2;">Lead Potencial Detectado</h1>
                      <p style="color: rgba(255,255,255,0.95) !important; margin: 0; font-size: 13px; line-height: 1.4;">Nueva conversación que podría ser interesante</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 25px 25px;">
                      
                      <!-- Visitor Info -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); background-color: #fff5e6 !important; border-radius: 10px; margin-bottom: 16px; border-left: 4px solid #FFC107;">
                        <tr>
                          <td style="padding: 18px 20px; background-color: transparent !important;">
                            <h2 style="color: #01183D !important; margin: 0 0 14px; font-size: 16px; font-weight: 600; line-height: 1.3;">👤 Información del Visitante</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-bottom: 10px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Nombre</div>
                                  <div style="color: #01183D !important; font-size: 16px; font-weight: 600; line-height: 1.4;">${visitorInfo}</div>
                                </td>
                              </tr>
                              ${emailInfo ? `
                              <tr>
                                <td style="padding-bottom: 10px;">
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Email</div>
                                  <div style="color: #003799 !important; font-size: 14px; font-weight: 500; line-height: 1.5;"><a href="mailto:${data.visitorEmail}" style="color: #003799 !important; text-decoration: none;">${data.visitorEmail}</a></div>
                                </td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td>
                                  <div style="color: #666 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; line-height: 1.4;">Mensajes</div>
                                  <div style="color: #01183D !important; font-size: 14px; font-weight: 600; line-height: 1.5;">
                                    <span style="display: inline-block; background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%); color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px;">${data.messageCount} mensajes</span>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Info Box -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background-color: #ffffff !important; border: 2px solid #e8f4ff; border-radius: 10px; margin-bottom: 16px;">
                        <tr>
                          <td bgcolor="#ffffff" style="padding: 16px 18px; background-color: #ffffff !important;">
                            <p style="margin: 0; line-height: 1.6; color: #333 !important; font-size: 14px;">
                              Este visitante ha mostrado interés en tus servicios. Revisa la conversación en tu panel de administración para evaluar si vale la pena hacer seguimiento.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="padding: 10px 0;">
                            <a href="https://geminisoftware.mx/admin#conversations" style="display: inline-block; background: linear-gradient(135deg, #00D3FF 0%, #003799 100%); color: white !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; line-height: 1.4;">📊 Ver en Admin Panel</a>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa !important; padding: 16px 25px; text-align: center; border-top: 1px solid #e8f4ff;">
                      <p style="margin: 0 0 6px; color: #01183D !important; font-weight: 600; font-size: 13px; line-height: 1.4;">Gemini Software</p>
                      <p style="margin: 0; color: #666 !important; font-size: 12px; line-height: 1.4;">
                        Sistema de Notificación de Leads
                      </p>
                    </td>
                  </tr>
                  
                </table>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de lead potencial enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error enviando email de lead potencial:', error);
    return false;
  }
}

// Test function
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error verificando conexión SMTP:', error);
    return false;
  }
}
