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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLabelForShipment = exports.getUserLabels = exports.getRates = void 0;
const label_1 = __importDefault(require("../models/label"));
const aftershipService_1 = require("../aftershipService");
const user_1 = __importDefault(require("../models/user"));
const getRates = (shipment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rates = yield (0, aftershipService_1.getAftershipRates)(shipment);
        const parsedRates = rates.map(rate => {
            return {
                ServiceName: rate.service_name,
                charges: {
                    weight: rate.charge_weight,
                    perUnit: {
                        original: rate.total_charge.amount,
                        data: rate.total_charge.amount * 1.1,
                        currency: rate.total_charge.currency
                    }
                }
            };
        });
        return parsedRates;
    }
    catch (error) {
        console.log(error.message);
        return [];
    }
});
exports.getRates = getRates;
const getUserLabels = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { user: { userId }, query } = req || {};
        const { page, limit } = query || {};
        if (userId) {
            const currentUser = yield user_1.default.findOne({ _id: userId });
            if (currentUser) {
                const pageNumber = parseInt((_a = page) !== null && _a !== void 0 ? _a : '1') || 1;
                const limitNumber = parseInt((_b = limit) !== null && _b !== void 0 ? _b : '10') || 10; // Default limit is set to 10
                const labels = yield label_1.default.find({ userId }, '-file')
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber)
                    .exec();
                return labels;
            }
        }
        return null;
    }
    catch (error) {
        console.log(error.message);
        return [];
    }
});
exports.getUserLabels = getUserLabels;
const createLabelForShipment = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const label = yield (0, aftershipService_1.createLabel)(payload);
        if (label) {
            const { id, files, rate, ship_date, status, tracking_numbers, shipper_account, order_id, order_number } = label;
            const { service_name, service_type, total_charge } = rate;
            const { label: { file_type, paper_size, url } = {} } = files;
            const localLabel = yield label_1.default.create({
                userId,
                status,
                charge: total_charge,
                externalId: id,
                file: { fileType: file_type, paperSize: paper_size, url },
                serviceName: service_name,
                serviceType: service_type,
                shipDate: ship_date,
                shipperAccount: shipper_account,
                trackingNumbers: tracking_numbers,
                orderNumber: order_number,
                orderId: order_id,
            });
            const { file } = localLabel, labelWithoutFile = __rest(localLabel, ["file"]);
            return labelWithoutFile;
        }
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.createLabelForShipment = createLabelForShipment;
//# sourceMappingURL=shipping.service.js.map