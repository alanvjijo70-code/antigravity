import { Router } from 'express';
import profileRoutes from './profile.routes.js';
import farmRoutes from './farm.routes.js';
import cropRoutes from './crop.routes.js';
import diseaseRoutes from './disease.routes.js';
import fertilizerRoutes from './fertilizer.routes.js';
import irrigationRoutes from './irrigation.routes.js';
import weatherRoutes from './weather.routes.js';
import costRoutes from './cost.routes.js';
import assistantRoutes from './assistant.routes.js';
import historyRoutes from './history.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriSense AI API Gateway operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

router.use('/profile', profileRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/disease', diseaseRoutes);
router.use('/fertilizer', fertilizerRoutes);
router.use('/irrigation', irrigationRoutes);
router.use('/weather', weatherRoutes);
router.use('/cost-estimator', costRoutes);
router.use('/assistant', assistantRoutes);
router.use('/history', historyRoutes);

export default router;
