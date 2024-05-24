"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../shipping/v2/index.controller");
const router = (0, express_1.Router)();
router.get('/rates', index_controller_1.getRates);
router.post('/shipments', index_controller_1.createShipment);
router.get('/get-shipments', index_controller_1.allShipments);
router.get('/get-user-shipments', index_controller_1.userShipments);
router.get('/shipments/:id/document', index_controller_1.shippingDoc);
exports.default = router;
//# sourceMappingURL=v2.js.map