import { Router } from 'express';
import {
  allShipments, createShipment, getRates, shipmentDocumentByTracking, shipmentTracking, shippingDoc, singleShipment, userShipments
} from '../shipping/v2/index.controller';
import { checkCarriers } from '../middlewares/checkCarriers';

const router = Router();

router.get('/rates', checkCarriers, getRates);
router.post('/shipments', checkCarriers, createShipment);
router.get('/shipments', allShipments);
router.get('/shipments/:id', singleShipment);
router.get('/user-shipments', userShipments);
router.get('/shipments/:id/document', shippingDoc);
router.get('/shipments/tracking/:tracking/document', shipmentDocumentByTracking);
router.get('/shipments/:id/tracking', checkCarriers, shipmentTracking);

export default router;
