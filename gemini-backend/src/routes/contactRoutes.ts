import { Router } from 'express';
import {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', createContact);

// Admin routes
router.get('/', authenticate, authorize('ADMIN', 'EDITOR'), getAllContacts);
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateContactStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteContact);

export default router;
