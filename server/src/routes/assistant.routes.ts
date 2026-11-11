import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { aiEndpointLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/chat', aiEndpointLimiter, AssistantController.chat);
router.get('/conversations', AssistantController.getConversations);
router.get('/conversations/:id', AssistantController.getConversationById);
router.delete('/conversations/:id', AssistantController.deleteConversation);

export default router;
