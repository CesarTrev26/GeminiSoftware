import { Router } from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCategories,
  addProjectImage,
  deleteProjectImage,
} from '../controllers/projectController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/categories', getCategories);
router.get('/:slug', getProject);

// Admin routes
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), createProject);
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateProject);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProject);

// Image routes
router.post('/:id/images', authenticate, authorize('ADMIN', 'EDITOR'), addProjectImage);
router.delete('/images/:imageId', authenticate, authorize('ADMIN', 'EDITOR'), deleteProjectImage);

export default router;
