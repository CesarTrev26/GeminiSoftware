import { Router } from 'express';
import projectRoutes from './projectRoutes';
import contactRoutes from './contactRoutes';
import authRoutes from './authRoutes';
import serviceRoutes from './serviceRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/contacts', contactRoutes);
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/', uploadRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gemini Software API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
