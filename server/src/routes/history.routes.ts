import { Router } from 'express';
import { HistoryController } from '../controllers/history.controller.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/', HistoryController.getHistory);
router.delete('/:id', HistoryController.deleteRecord);

export default router;
