import { Router } from 'express';
import { DiseaseController } from '../controllers/disease.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { uploadSingleImage } from '../middleware/upload.js';
import { aiEndpointLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post(
  '/analyze',
  aiEndpointLimiter,
  uploadSingleImage.single('image'),
  DiseaseController.analyzeImage
);
router.get('/history', DiseaseController.getHistory);
router.get('/:id', DiseaseController.getDetailsById);
router.delete('/:id', DiseaseController.deleteAnalysis);

export default router;
