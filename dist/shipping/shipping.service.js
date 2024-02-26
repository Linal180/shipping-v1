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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLabelForShipment = exports.getUserLabels = exports.getRates = exports.getPDFFile = void 0;
const axios_1 = __importDefault(require("axios"));
const user_1 = __importDefault(require("../models/user"));
const label_1 = __importDefault(require("../models/label"));
const lib_1 = require("../lib");
const constants_1 = require("../constants");
const aftershipService_1 = require("../aftershipService");
const getPDFFile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield getLabelFile(id);
        if (url) {
            const response = yield (0, axios_1.default)({
                method: 'get',
                url,
                responseType: 'stream',
                headers: { 'Content-Type': 'application/pdf' }
            });
            return response.data;
        }
        return null;
    }
    catch (error) {
        console.error('Failed to fetch PDF:', error);
        return null;
    }
});
exports.getPDFFile = getPDFFile;
const getRates = (shipment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rates = yield (0, aftershipService_1.getAftershipRates)(shipment);
        const parsedRates = rates.map(rate => {
            return {
                ServiceName: rate.service_name,
                charges: {
                    weight: rate.charge_weight,
                    perUnit: {
                        priceVAT: rate.total_charge.amount * constants_1.COMMISSION_PERCENTAGE,
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
                const limitNumber = parseInt((_b = limit) !== null && _b !== void 0 ? _b : '10') || 10;
                const labels = yield label_1.default.find({ userId })
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber)
                    .lean()
                    .exec();
                const updateLabels = labels.map(label => (Object.assign(Object.assign({}, label), { file: (0, lib_1.generateLabelFileUrl)(label._id.toString()) })));
                return updateLabels;
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
            const { amount, currency } = total_charge;
            const localLabelDoc = yield label_1.default.create({
                userId,
                status,
                charge: {
                    amount: (amount * constants_1.COMMISSION_PERCENTAGE).toFixed(2),
                    currency
                },
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
            const localLabel = localLabelDoc.toObject();
            return Object.assign(Object.assign({}, localLabel), { file: (0, lib_1.generateLabelFileUrl)(localLabel._id.toString()) });
        }
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.createLabelForShipment = createLabelForShipment;
const getLabelFile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (id) {
        const label = yield label_1.default.findOne({ _id: id }).exec();
        if (label) {
            return label.file.url;
        }
    }
    throw new Error('Could not find label');
});
//# sourceMappingURL=shipping.service.js.map