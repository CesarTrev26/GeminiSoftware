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
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
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
      await transporter.sendMail({
        from: config.email.from,
        to: config.admin.email,
        subject: `🚀 Nuevo contacto: ${name} - ${service || 'General'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #01183D 0%, #003799 50%, #00D3FF 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Nuevo Contacto</h1>
            </div>
            <div style="padding: 30px; background: #f5f5f5;">
              <h2 style="color: #01183D;">Información del contacto</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ` : ''}
                ${service ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Servicio:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${service}</td>
                </tr>
                ` : ''}
              </table>
              <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px;">
                <h3 style="color: #01183D; margin-top: 0;">Mensaje:</h3>
                <p style="color: #333; line-height: 1.6;">${message}</p>
              </div>
              <div style="margin-top: 20px; text-align: center;">
                <a href="https://wa.me/52${phone?.replace(/\D/g, '')}" 
                   style="display: inline-block; padding: 12px 24px; background: #25D366; color: white; text-decoration: none; border-radius: 25px; margin-right: 10px;">
                  Responder por WhatsApp
                </a>
                <a href="mailto:${email}" 
                   style="display: inline-block; padding: 12px 24px; background: #003799; color: white; text-decoration: none; border-radius: 25px;">
                  Responder por Email
                </a>
              </div>
            </div>
            <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
              <p>Gemini Software - Panel de Administración</p>
            </div>
          </div>
        `,
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
