import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Helper to parse JSON strings safely
const parseJSON = (str: string | null | undefined, fallback: any = []) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// ============================================
// GET ALL PROJECTS (Public)
// ============================================
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { category, featured, limit, page = '1' } = req.query;
    
    // Check if user is authenticated (for admin panel)
    const isAuthenticated = req.headers.authorization;
    
    // Only filter by published if not authenticated (public view)
    const where: any = isAuthenticated ? {} : { published: true };
    
    if (category && category !== 'Todos') {
      where.category = category as string;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    const take = limit ? parseInt(limit as string, 10) : undefined;
    const skip = take ? (parseInt(page as string, 10) - 1) * take : undefined;
    
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
        take,
        skip,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);
    
    // Parse JSON fields
    const formattedProjects = projects.map(project => ({
      ...project,
      tags: parseJSON(project.tags),
      results: parseJSON(project.results),
    }));
    
    res.json({
      success: true,
      data: formattedProjects,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        pages: take ? Math.ceil(total / take) : 1,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los proyectos',
    });
  }
};

// ============================================
// GET SINGLE PROJECT (Public)
// ============================================
export const getProject = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const project = await prisma.project.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
        published: true,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado',
      });
    }
    
    res.json({
      success: true,
      data: {
        ...project,
        tags: parseJSON(project.tags),
        results: parseJSON(project.results),
      },
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el proyecto',
    });
  }
};

// ============================================
// CREATE PROJECT (Admin)
// ============================================
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      subtitle,
      category,
      client,
      description,
      longDescription,
      tags,
      results,
      images,
      year,
      duration,
      website,
      projectType,
      inProgress,
      featured,
      published,
      order,
    } = req.body;
    
    // Generate slug
    let slug = slugify(title, { lower: true, strict: true });
    
    // Check if slug exists
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const project = await prisma.project.create({
      data: {
        slug,
        title,
        subtitle,
        category,
        client,
        description,
        longDescription,
        tags: JSON.stringify(tags || []),
        results: JSON.stringify(results || []),
        year,
        duration,
        website,
        projectType,
        inProgress: inProgress || false,
        featured: featured || false,
        published: published !== false,
        order: order || 0,
        authorId: req.user?.id,
        publishedAt: published !== false ? new Date() : null,
      },
    });
    
    // Handle images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.projectImage.createMany({
        data: images.map((img: any, index: number) => ({
          projectId: project.id,
          url: img.url,
          alt: img.alt || null,
          order: index,
        })),
      });
    }
    
    // Fetch created project with images
    const createdProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
    
    res.status(201).json({
      success: true,
      data: {
        ...createdProject,
        tags: parseJSON(createdProject!.tags),
        results: parseJSON(createdProject!.results),
      },
      message: 'Proyecto creado exitosamente',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el proyecto',
    });
  }
};

// ============================================
// UPDATE PROJECT (Admin)
// ============================================
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      category,
      client,
      description,
      longDescription,
      tags,
      results,
      images,
      year,
      duration,
      website,
      projectType,
      inProgress,
      featured,
      published,
      order,
    } = req.body;
    
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado',
      });
    }
    
    // Generate new slug if title changed
    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = slugify(title, { lower: true, strict: true });
      const slugExists = await prisma.project.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }
    
    await prisma.project.update({
      where: { id },
      data: {
        slug,
        title,
        subtitle,
        category,
        client,
        description,
        longDescription,
        tags: tags ? JSON.stringify(tags) : undefined,
        results: results ? JSON.stringify(results) : undefined,
        year,
        duration,
        website,
        projectType,
        inProgress,
        featured,
        published,
        order,
        publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
      include: {
        images: true,
      },
    });
    
    // Handle images if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await prisma.projectImage.deleteMany({
        where: { projectId: id },
      });
      
      // Create new images
      if (images.length > 0) {
        await prisma.projectImage.createMany({
          data: images.map((img: any, index: number) => ({
            projectId: id,
            url: img.url,
            alt: img.alt || null,
            order: index,
          })),
        });
      }
    }
    
    // Fetch updated project with images
    const updatedProject = await prisma.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
    
    res.json({
      success: true,
      data: {
        ...updatedProject,
        tags: parseJSON(updatedProject!.tags),
        results: parseJSON(updatedProject!.results),
      },
      message: 'Proyecto actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el proyecto',
    });
  }
};

// ============================================
// DELETE PROJECT (Admin)
// ============================================
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado',
      });
    }
    
    await prisma.project.delete({ where: { id } });
    
    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el proyecto',
    });
  }
};

// ============================================
// GET CATEGORIES
// ============================================
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.project.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ['category'],
    });
    
    res.json({
      success: true,
      data: categories.map(c => c.category),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las categorías',
    });
  }
};

// ============================================
// ADD PROJECT IMAGE (Admin)
// ============================================
export const addProjectImage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { url, alt, caption, order } = req.body;
    
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado',
      });
    }
    
    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url,
        alt,
        caption,
        order: order || 0,
      },
    });
    
    res.status(201).json({
      success: true,
      data: image,
      message: 'Imagen agregada exitosamente',
    });
  } catch (error) {
    console.error('Error adding project image:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar la imagen',
    });
  }
};

// ============================================
// DELETE PROJECT IMAGE (Admin)
// ============================================
export const deleteProjectImage = async (req: AuthRequest, res: Response) => {
  try {
    const { imageId } = req.params;
    
    await prisma.projectImage.delete({ where: { id: imageId } });
    
    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error deleting project image:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la imagen',
    });
  }
};
