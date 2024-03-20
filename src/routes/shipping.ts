import express from 'express';
import { getRates, createLabel, getLabels, getFile, getLabel, getTracking } from '../shipping/index.controller';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.get('/rates', authenticateToken, getRates);
router.get('/get-file/:id', getFile);
router.post('/create-label', authenticateToken, createLabel as any);
router.get('/get-labels/:id', getLabel);
router.get('/get-labels', authenticateToken, getLabels as any);
router.get('/tracking/:tracking', authenticateToken, getTracking as any);

export default router;
