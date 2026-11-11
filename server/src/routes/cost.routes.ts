import { Router } from 'express';
import { CostController } from '../controllers/cost.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.post('/calculate', CostController.calculateCost);
router.get('/history', CostController.getHistory);
router.get('/:id', CostController.getById);
router.delete('/:id', CostController.deleteEstimate);

export default router;
