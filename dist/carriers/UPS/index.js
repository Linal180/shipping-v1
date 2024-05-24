"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lib_1 = require("../../lib");
const axiosDhlClient = axios_1.default.create({
    baseURL: process.env.DHL_API_ENDPOINT || 'https://express.api.dhl.com/mydhlapi',
    headers: (0, lib_1.getDHLHeaders)()
});
//# sourceMappingURL=index.js.map