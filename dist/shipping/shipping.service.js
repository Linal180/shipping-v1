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
exports.createLabelForShipment = exports.getUserLabels = exports.getLabelTracking = exports.getSingleLabel = exports.getRates = exports.getPDFFile = void 0;
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
                serviceName: rate.service_name,
                serviceCode: rate.service_type,
                charges: {
                    weight: rate.charge_weight,
                    perUnit: {
                        priceWithoutVAT: rate.total_charge.amount * constants_1.COMMISSION_PERCENTAGE,
                        VAT: '0.0',
                        total: rate.total_charge.amount * constants_1.COMMISSION_PERCENTAGE,
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
const getSingleLabel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id } } = req || {};
        if (id) {
            const label = yield label_1.default.findOne({ _id: id });
            if (label)
                return (0, lib_1.customizeLabel)(label);
        }
        return null;
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.getSingleLabel = getSingleLabel;
const getLabelTracking = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { tracking } } = req || {};
        if (tracking) {
            const label = yield label_1.default.findOne({ trackingNumbers: tracking });
            if (label) {
                return {
                    status: 200, message: "Tracking successfully found",
                    tracking: {
                        shipment_created: new Date().toISOString(),
                        picked_up: new Date().toISOString(),
                        departed_from_facility: new Date().toISOString(),
                        arrived_at_facility: new Date().toISOString(),
                        at_departure_hub: true,
                        in_transit: false,
                        at_arrival_hub: false,
                        delivery_in_progress: true,
                        delivery_exception: "",
                        delivered: false,
                        unknown: "****"
                    }
                };
            }
            return {
                status: 404, message: "Tracking number not found", tracking: null
            };
        }
        return {
            status: 400, message: "Missing tracking number", tracking: null
        };
    }
    catch (error) {
        console.log(error.message);
        return null;
    }
});
exports.getLabelTracking = getLabelTracking;
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
                const updateLabels = labels.map(label => (0, lib_1.customizeLabel)(label));
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
            const { service_name, service_type, total_charge } = rate || {};
            const { label: { file_type, paper_size, url } = {} } = files;
            const { amount, currency } = total_charge || {};
            const localLabelDoc = yield label_1.default.create({
                _id: yield (0, lib_1.getNextSequenceId)('labels'),
                userId,
                status,
                charge: {
                    amount: ((amount !== null && amount !== void 0 ? amount : 1) * constants_1.COMMISSION_PERCENTAGE).toFixed(2),
                    currency: currency !== null && currency !== void 0 ? currency : 'usd'
                },
                externalId: id,
                file: { fileType: file_type, paperSize: paper_size, url },
                serviceName: service_name || '',
                serviceType: service_type || '',
                shipDate: ship_date,
                shipperAccount: shipper_account,
                trackingNumbers: tracking_numbers,
                orderNumber: order_number,
                orderId: order_id,
            });
            const localLabel = localLabelDoc.toObject();
            return (0, lib_1.customizeLabel)(localLabel);
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