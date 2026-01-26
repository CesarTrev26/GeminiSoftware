import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Email transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure, // true for 465, false for 587
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    rejectUnauthorized: false // Para desarrollo
  }
});

// ============================================
// CREATE CONTACT (Public)
// ============================================
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y mensaje son requeridos',
      });
    }
    
    // Create contact in database
    await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        service,
        message,
        source: req.headers.referer || 'direct',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });
    
    // Send notification email to admin
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; background: #f0f4f8; font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,55,153,0.1);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%); padding: 40px 30px; text-align: center; position: relative;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"/%3E%3Cpath d=\"M0 0h1v1H0zM19 19h1v1h-1z\" fill=\"rgba(255,255,255,0.1)\"/%3E%3C/svg%3E'); opacity: 0.3;"></div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; position: relative; z-index: 1;">💬 Nuevo Contacto</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; position: relative; z-index: 1;">Formulario de Contacto Web</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Contact Info Card -->
              <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #00D3FF;">
                <h2 style="color: #01183D; margin: 0 0 20px; font-size: 20px; font-weight: 600;">👤 Información del Cliente</h2>
                
                <div style="margin-bottom: 15px;">
                  <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Nombre Completo</div>
                  <div style="color: #01183D; font-size: 16px; font-weight: 500;">${name}</div>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Email</div>
                  <div><a href="mailto:${email}" style="color: #003799; font-size: 16px; text-decoration: none; font-weight: 500;">${email}</a></div>
                </div>
                
                ${phone ? `
                <div style="margin-bottom: 15px;">
                  <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Teléfono</div>
                  <div><a href="tel:${phone}" style="color: #003799; font-size: 16px; text-decoration: none; font-weight: 500;">${phone}</a></div>
                </div>
                ` : ''}
                
                ${service ? `
                <div>
                  <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Servicio de Interés</div>
                  <div style="display: inline-block; background: #00D3FF; color: #01183D; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${service}</div>
                </div>
                ` : ''}
              </div>
              
              <!-- Message Card -->
              <div style="background: white; border: 2px solid #e8f4ff; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <h3 style="color: #01183D; margin: 0 0 15px; font-size: 16px; font-weight: 600;">💬 Mensaje:</h3>
                <p style="color: #333; line-height: 1.8; margin: 0; font-size: 15px;">${message}</p>
              </div>
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin-bottom: 25px;">
                ${phone ? `
                <a href="https://wa.me/52${phone.replace(/\D/g, '')}" 
                   style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                  📱 WhatsApp
                </a>
                ` : ''}
                <a href="mailto:${email}" 
                   style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #003799 0%, #00D3FF 100%); color: white; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(0,55,153,0.3);">
                  📧 Email
                </a>
                <a href="${process.env.FRONTEND_URL || 'https://geminisoftware.mx'}/admin" 
                   style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #01183D 0%, #003799 100%); color: white; text-decoration: none; border-radius: 8px; margin: 5px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(1,24,61,0.3);">
                  🎛️ Admin Panel
                </a>
              </div>
              
              <!-- Timestamp -->
              <div style="text-align: center; padding: 15px; background: #f8f9ff; border-radius: 8px;">
                <p style="margin: 0; color: #666; font-size: 13px;">
                  <strong>Recibido:</strong> ${new Date().toLocaleString('es-MX', { 
                    dateStyle: 'full', 
                    timeStyle: 'short' 
                  })}
                </p>
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
      
      await transporter.sendMail({
        from: `"Gemini Software" <${config.email.from}>`,
        to: `${config.email.user}, ${config.admin.email}`,
        subject: `🚀 Nuevo Contacto: ${name} - ${service || 'Consulta General'}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: '¡Gracias por contactar a Gemini Software!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">¡Gracias por contactarnos!</h1>
            </div>
            <div style="padding: 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Hola <strong>${name}</strong>,
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Hemos recibido tu mensaje y nos pondremos en contacto contigo en menos de 24 horas.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Si tienes alguna urgencia, no dudes en contactarnos directamente por WhatsApp:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/528136600062" 
                   style="display: inline-block; padding: 15px 30px; background: #25D366; color: white; text-decoration: none; border-radius: 30px; font-weight: bold;">
                  📱 WhatsApp: +52 81 3660 0062
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                Saludos cordiales,<br>
                El equipo de <strong>Gemini Software</strong>
              </p>
            </div>
            <div style="padding: 20px; background: #f5f5f5; text-align: center; color: #666; font-size: 12px;">
              <p>Monterrey, Nuevo León, México</p>
              <p>
                <a href="https://geminisoftware.mx" style="color: #003799;">geminisoftware.mx</a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: '¡Mensaje enviado con éxito! Te contactaremos pronto.',
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
    });
  }
};

// ============================================
// GET ALL CONTACTS (Admin)
// ============================================
export const getAllContacts = async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit, page = '1' } = req.query;
    
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    const take = limit ? parseInt(limit as string, 10) : 20;
    const skip = (parseInt(page as string, 10) - 1) * take;
    
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          assignedTo: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.contact.count({ where }),
    ]);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los contactos',
    });
  }
};

// ============================================
// UPDATE CONTACT STATUS (Admin)
// ============================================
export const updateContactStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedToId } = req.body;
    
    const contact = await prisma.contact.update({
      where: { id },
      data: {
        status,
        notes,
        assignedToId,
      },
    });
    
    res.json({
      success: true,
      data: contact,
      message: 'Contacto actualizado',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto',
    });
  }
};

// ============================================
// DELETE CONTACT (Admin)
// ============================================
export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.contact.delete({ where: { id } });
    
    res.json({
      success: true,
      message: 'Contacto eliminado',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contacto',
    });
  }
};
