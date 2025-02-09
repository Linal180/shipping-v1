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
exports.getShipmentTracking = exports.getUserShipments = exports.getShipment = exports.getAllShipments = exports.createCarrierShipment = exports.getCarrierRates = void 0;
const user_1 = __importDefault(require("../../models/user"));
const shipment_1 = __importDefault(require("../../models/shipment"));
const lib_1 = require("../../lib");
const DHL_1 = require("../../carriers/DHL");
const getCarrierRates = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = body || {}, { carrier } = _a, params = __rest(_a, ["carrier"]);
    try {
        if (carrier === 'DHL') {
            const { data, message, status } = yield (0, DHL_1.getRates)(params);
            if (status === 200) {
                const genericResponse = (0, lib_1.getDHLRateGenericResponse)(data);
                return {
                    status, message, data: genericResponse
                };
            }
            return { status, message, data: {} };
        }
        return {
            status: 400, message: 'Bad request', data: null
        };
    }
    catch (error) {
        (0, lib_1.printLogs)(`V2 Service ${exports.getCarrierRates.name}`, error);
        return null;
    }
});
exports.getCarrierRates = getCarrierRates;
const createCarrierShipment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, user } = req || {};
    const { carrier } = body || {};
    try {
        if (carrier === 'DHL') {
            const { data, message, status } = yield (0, DHL_1.createDHLShipment)(body);
            if (status === 200) {
                const _b = data || {}, { shipmentTrackingNumber } = _b, rest = __rest(_b, ["shipmentTrackingNumber"]);
                const ship = yield shipment_1.default.create(Object.assign({ userId: user.userId, trackingNumber: shipmentTrackingNumber }, rest));
                const newShipment = yield shipment_1.default.findOne(ship._id)
                    .select('-documents -trackingUrl -packages')
                    .exec();
                return {
                    status,
                    message,
                    data: newShipment
                };
            }
            return {
                message, status, data
            };
        }
    }
    catch (error) {
        (0, lib_1.printLogs)(`V2 Service ${exports.getCarrierRates.name}`, error);
        return null;
    }
});
exports.createCarrierShipment = createCarrierShipment;
const getAllShipments = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { query } = req || {};
    const { page, limit } = query || {};
    const pageNumber = parseInt((_c = page) !== null && _c !== void 0 ? _c : '1') || 1;
    const limitNumber = parseInt((_d = limit) !== null && _d !== void 0 ? _d : '10') || 10;
    try {
        const shipments = yield shipment_1.default.find()
            .select('-documents -trackingUrl -packages')
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .lean()
            .exec();
        return { message: '', status: 200, data: { shipments, page: pageNumber } };
    }
    catch (error) {
        (0, lib_1.printLogs)(exports.getAllShipments.name, error);
        return null;
    }
});
exports.getAllShipments = getAllShipments;
const getShipment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipment = yield shipment_1.default.findById(id)
            .select('-documents -trackingUrl -packages')
            .lean()
            .exec();
        return shipment ? {
            shipment, status: 200
        } : {
            shipment: null, status: 404
        };
    }
    catch (error) {
        (0, lib_1.printLogs)(exports.getAllShipments.name, error);
        return { shipment: null, status: 500 };
    }
});
exports.getShipment = getShipment;
const getUserShipments = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const { user: { userId }, query } = req || {};
    const { page, limit } = query || {};
    const pageNumber = parseInt((_e = page) !== null && _e !== void 0 ? _e : '1') || 1;
    const limitNumber = parseInt((_f = limit) !== null && _f !== void 0 ? _f : '10') || 10;
    try {
        if (userId) {
            const currentUser = yield user_1.default.findOne({ _id: userId });
            if (currentUser) {
                const shipments = yield shipment_1.default.find({ userId })
                    .select('-documents -trackingUrl -packages')
                    .skip((pageNumber - 1) * limitNumber)
                    .limit(limitNumber)
                    .lean()
                    .exec();
                return { data: { shipments, page: pageNumber }, status: 200 };
            }
        }
    }
    catch (error) {
        (0, lib_1.printLogs)(exports.getAllShipments.name, error);
        return null;
    }
});
exports.getUserShipments = getUserShipments;
const getShipmentTracking = (trackingNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, message, status } = yield (0, DHL_1.getDHLShipmentTracking)(trackingNumber);
        return {
            status,
            message,
            data
        };
    }
    catch (error) {
        (0, lib_1.printLogs)(`Service ${exports.getShipmentTracking.name}`, error);
    }
});
exports.getShipmentTracking = getShipmentTracking;
//# sourceMappingURL=service.js.map