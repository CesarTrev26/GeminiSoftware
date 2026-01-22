import { Router } from 'express';
import {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllServices);
router.get('/:slug', getServiceBySlug);

// Protected routes (admin only)
router.post('/', authenticate, createService);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);

export default router;
