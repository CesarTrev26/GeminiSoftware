import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios',
    });
  }
};

// Get single service by slug
export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicio',
    });
  }
};

// Admin: Create service
export const createService = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, icon, features, published, order } = req.body;

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        icon,
        features: features || [],
        published: published ?? true,
        order: order ?? 0,
      },
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear servicio',
    });
  }
};

// Admin: Update service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, description, icon, features, published, order } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        icon,
        features,
        published,
        order,
      },
    });

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar servicio',
    });
  }
};

// Admin: Delete service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Servicio eliminado correctamente',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar servicio',
    });
  }
};
