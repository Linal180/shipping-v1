"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_controller_1 = require("../users/index.controller");
const router = express_1.default.Router();
router.post('/sign-in', index_controller_1.signIn);
router.post('/sign-up', index_controller_1.signUp);
exports.default = router;
//# sourceMappingURL=auth.js.map