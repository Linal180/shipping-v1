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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarrierRates = void 0;
const DHL_1 = require("../../carriers/DHL");
const lib_1 = require("../../lib");
const getCarrierRates = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = body || {}, { carrier } = _a, params = __rest(_a, ["carrier"]);
    try {
        if (carrier === 'DHL') {
            const rates = yield (0, DHL_1.getRates)(params);
            const genericResponse = (0, lib_1.getDHLRateGenericResponse)(rates);
            return genericResponse;
        }
        return null;
    }
    catch (error) {
        (0, lib_1.printLogs)(`V2 Service ${exports.getCarrierRates.name}`, error);
        return null;
    }
});
exports.getCarrierRates = getCarrierRates;
//# sourceMappingURL=service.js.map