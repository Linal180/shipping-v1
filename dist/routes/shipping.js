"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../shipping/index.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/rates', auth_1.authenticateToken, index_controller_1.getRates);
router.get('/get-file/:id', index_controller_1.getFile);
router.post('/create-label', auth_1.authenticateToken, index_controller_1.createLabel);
router.get('/get-labels/:id', index_controller_1.getLabel);
router.get('/get-labels', auth_1.authenticateToken, index_controller_1.getLabels);
router.get('/tracking/:tracking', auth_1.authenticateToken, index_controller_1.getTracking);
exports.default = router;
//# sourceMappingURL=shipping.js.map