import { Router } from 'express';
import { CropController } from '../controllers/crop.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { aiEndpointLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/recommend', aiEndpointLimiter, CropController.recommendCrops);
router.get('/recommendations', CropController.listRecommendations);
router.get('/recommendations/:id', CropController.getRecommendationById);
router.delete('/recommendations/:id', CropController.deleteRecommendation);

export default router;
