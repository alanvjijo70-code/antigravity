import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { aiEndpointLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Current weather and forecast can be checked with or without auth, but advisory requires auth
router.get('/current', WeatherController.getCurrentWeather);
router.get('/forecast', WeatherController.getForecast);
router.post('/advisory', authenticateUser, aiEndpointLimiter, WeatherController.generateAdvisory);

export default router;
