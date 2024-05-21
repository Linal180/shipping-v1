// src/routes/dhlRoutes.ts
import { Router } from 'express';
import { getDhlRatesController, createDhlLabelController } from '../shipping/dhl.controller';
import { getDhlRatess } from '../shipping/dhl.controller';

const router = Router();

router.post('/rates', getDhlRatesController);
router.post('/labels', createDhlLabelController);
router.post('/dhl/rates', getDhlRatess);

export default router;
