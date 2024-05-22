"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../shipping/v2/index.controller");
const router = (0, express_1.Router)();
router.get('/rates', index_controller_1.getRates);
exports.default = router;
//# sourceMappingURL=v2.js.map