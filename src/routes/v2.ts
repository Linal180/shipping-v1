import { Router } from 'express';
import { createShipment, getRates } from '../shipping/v2/index.controller';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/rates', getRates);
router.post('/shipments',authenticateToken, createShipment);
// router.get('/pdf/:trackingNumber', servePdf);
// router.get('/shipment/:trackingId', getShipmentByTrackingId)

export default router;
