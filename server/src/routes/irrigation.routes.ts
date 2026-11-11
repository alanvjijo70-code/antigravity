import { Router } from 'express';
import { IrrigationController } from '../controllers/irrigation.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { aiEndpointLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/recommend', aiEndpointLimiter, IrrigationController.recommendIrrigation);

export default router;
