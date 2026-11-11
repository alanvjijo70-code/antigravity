import { Router } from 'express';
import { FertilizerController } from '../controllers/fertilizer.controller.js';
import { authenticateUser } from '../middleware/auth.js';
import { aiEndpointLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateUser);

router.post('/recommend', aiEndpointLimiter, FertilizerController.recommendFertilizer);

export default router;
