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
exports.getDHLShipmentTracking = exports.createDHLShipment = exports.getRates = void 0;
const axios_1 = __importDefault(require("axios"));
const lib_1 = require("../../lib");
const dhl = axios_1.default.create({
    baseURL: process.env.DHL_API_ENDPOINT || 'https://express.api.dhl.com/mydhlapi',
    headers: (0, lib_1.getDHLHeaders)()
});
const getRates = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromCity, fromCountry, height, length, toCity, toCountry, weight, width } = params || {};
    const apiParams = {
        accountNumber: process.env.DHL_ACCOUNT_NUMBER,
        originCountryCode: fromCountry,
        originCityName: fromCity,
        destinationCountryCode: toCountry,
        destinationCityName: toCity,
        weight,
        length,
        width,
        height,
        plannedShippingDate: (0, lib_1.getCurrentDate)(),
        isCustomsDeclarable: false,
        unitOfMeasurement: 'metric'
    };
    try {
        const { data } = yield dhl.get('/rates', {
            params: apiParams
        });
        const { products } = data || {};
        return {
            status: 200,
            message: 'Rates calculated successfully',
            data: products[0]
        };
    }
    catch (error) {
        (0, lib_1.printLogs)(`DHL ${exports.getRates.name}`, error);
        const { detail, message, status } = (0, lib_1.getErrorResponse)(error);
        return {
            status,
            message: `${detail} | ${message}`,
            data: null
        };
    }
});
exports.getRates = getRates;
const createDHLShipment = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const shipmentPayload = (0, lib_1.createDHLGenericShipmentPayload)(body);
    try {
        const { data } = yield dhl.post('/shipments', shipmentPayload);
        return {
            status: 200,
            message: 'Shipment created successfully',
            data
        };
    }
    catch (error) {
        (0, lib_1.printLogs)(`DHL ${exports.createDHLShipment.name}`, error);
        const { detail, message, status } = (0, lib_1.getErrorResponse)(error);
        return {
            status,
            message: `${detail} | ${message}`,
            data: null
        };
    }
});
exports.createDHLShipment = createDHLShipment;
const getDHLShipmentTracking = (trackingNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield dhl.get(`/shipments/${trackingNumber}/tracking`, {
            params: {
                trackingView: 'all-checkpoints',
                levelOfDetail: 'all',
                requestControlledAccessDataCodes: false,
                requestGMTOffsetPerEvent: false
            }
        });
        return {
            status: 200,
            message: 'Tracking retrived successfully',
            data
        };
    }
    catch (error) {
        (0, lib_1.printLogs)(`DHL Service ${exports.getDHLShipmentTracking.name}`, error);
        const { detail, message, status } = (0, lib_1.getErrorResponse)(error);
        return {
            status,
            message: `${detail} | ${message}`,
            data: null
        };
    }
});
exports.getDHLShipmentTracking = getDHLShipmentTracking;
//# sourceMappingURL=index.js.map