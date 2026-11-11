import { Router } from 'express';
import { FarmController } from '../controllers/farm.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/', FarmController.listFarms);
router.post('/', FarmController.createFarm);
router.get('/:id', FarmController.getFarmById);
router.put('/:id', FarmController.updateFarm);
router.delete('/:id', FarmController.deleteFarm);

export default router;
