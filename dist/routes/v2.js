"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../shipping/v2/index.controller");
const checkCarriers_1 = require("../middlewares/checkCarriers");
const router = (0, express_1.Router)();
router.get('/rates', checkCarriers_1.checkCarriers, index_controller_1.getRates);
router.post('/shipments', checkCarriers_1.checkCarriers, index_controller_1.createShipment);
router.get('/shipments', index_controller_1.allShipments);
router.get('/shipments/:id', index_controller_1.singleShipment);
router.get('/user-shipments', index_controller_1.userShipments);
router.get('/shipments/:id/document', index_controller_1.shippingDoc);
router.get('/shipments/tracking/:tracking/document', index_controller_1.shipmentDocumentByTracking);
router.get('/shipments/:id/tracking', checkCarriers_1.checkCarriers, index_controller_1.shipmentTracking);
exports.default = router;
//# sourceMappingURL=v2.js.map