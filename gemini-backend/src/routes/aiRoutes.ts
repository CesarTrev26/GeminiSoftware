import { Router } from 'express';
import { chatWithAI, searchProjects, getConversationHistory, listConversations } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

// AI Chat endpoint (público)
router.post('/chat', chatWithAI);

// AI-powered semantic search (público)
router.post('/search', searchProjects);

// Obtener historial de conversación por sessionId (público)
router.get('/history/:sessionId', getConversationHistory);

// Listar todas las conversaciones (admin only)
router.get('/conversations', authenticate, listConversations);

export default router;
