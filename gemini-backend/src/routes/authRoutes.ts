import { Router } from 'express';
import { login, getCurrentUser, updatePassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.put('/password', authenticate, updatePassword);

export default router;
