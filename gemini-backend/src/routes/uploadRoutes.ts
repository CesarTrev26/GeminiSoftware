import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/projects');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Responsive image sizes
const RESPONSIVE_SIZES = [
  { width: 400, suffix: '-sm' },
  { width: 800, suffix: '-md' },
  { width: 1200, suffix: '-lg' },
  { width: 1920, suffix: '' } // Original/largest size
];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Helper function to generate responsive images
async function generateResponsiveImages(filePath: string): Promise<{ [key: string]: string }> {
  const ext = path.extname(filePath);
  const nameWithoutExt = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const responsiveUrls: { [key: string]: string } = {};

  try {
    // Convert to WebP and generate responsive sizes
    for (const size of RESPONSIVE_SIZES) {
      const outputFilename = `${nameWithoutExt}${size.suffix}.webp`;
      const outputPath = path.join(dir, outputFilename);
      
      await sharp(filePath)
        .resize(size.width, null, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const sizeKey = size.suffix ? size.suffix.replace('-', '') : 'original';
      responsiveUrls[sizeKey] = `/uploads/projects/${outputFilename}`;
    }
    
    // Delete original file if it's not WebP
    if (ext.toLowerCase() !== '.webp') {
      fs.unlinkSync(filePath);
    }
    
    return responsiveUrls;
  } catch (error) {
    console.error('Error generating responsive images:', error);
    throw error;
  }
}

// Upload single image
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const filePath = path.join(uploadsDir, req.file.filename);
    
    // Generate responsive versions
    const responsiveUrls = await generateResponsiveImages(filePath);
    
    res.json({
      success: true,
      message: 'Imagen subida exitosamente con versiones responsivas',
      data: {
        url: responsiveUrls.original, // Main URL (largest size)
        responsive: responsiveUrls, // All versions
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir la imagen'
    });
  }
});

// Delete image and all its responsive versions
router.delete('/upload/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    
    // Delete all responsive versions
    const suffixes = ['', '-sm', '-md', '-lg'];
    let deletedCount = 0;
    
    suffixes.forEach(suffix => {
      const fileToDelete = `${nameWithoutExt}${suffix}.webp`;
      const filePath = path.join(uploadsDir, fileToDelete);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    // Also try to delete original if it exists
    const originalPath = path.join(uploadsDir, filename);
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
      deletedCount++;
    }
    
    if (deletedCount > 0) {
      res.json({
        success: true,
        message: `Eliminadas ${deletedCount} versiones de la imagen`
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la imagen'
    });
  }
});

export default router;
