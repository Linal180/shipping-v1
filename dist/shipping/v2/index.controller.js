"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRates = void 0;
const lib_1 = require("../../lib");
const service_1 = require("./service");
const getRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const response = yield (0, service_1.getCarrierRates)(body);
        res.status(200).json({ message: 'Rate calculated successfully', data: response });
    }
    catch (error) {
        (0, lib_1.printLogs)(exports.getRates.name, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getRates = getRates;
//# sourceMappingURL=index.controller.js.map