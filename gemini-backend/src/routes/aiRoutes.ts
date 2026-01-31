import { Router } from 'express';
import { chatWithAI, searchProjects, getConversationHistory, listConversations, getConversationById, updateConversationStatus } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
import { testEmailConnection } from '../services/emailService';

const router = Router();

// AI Chat endpoint (público)
router.post('/chat', chatWithAI);

// AI-powered semantic search (público)
router.post('/search', searchProjects);

// Obtener historial de conversación por sessionId (público)
router.get('/history/:sessionId', getConversationHistory);

// Listar todas las conversaciones (admin only)
router.get('/conversations', authenticate, listConversations);

// Obtener conversación completa por ID (admin only)
router.get('/conversations/:id', authenticate, getConversationById);

// Actualizar estado de conversación (admin only)
router.patch('/conversations/:id', authenticate, updateConversationStatus);

// Test email connection (admin only)
router.get('/test-email', authenticate, async (req, res) => {
  try {
    const result = await testEmailConnection();
    if (result) {
      return res.json({
        success: true,
        message: 'Email service configured correctly! You will receive notifications when hot leads are detected.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured correctly. Check your SMTP settings.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error testing email connection'
    });
  }
});

export default router;
