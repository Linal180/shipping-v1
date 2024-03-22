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
exports.createLabel = exports.getAftershipRates = void 0;
const axios_1 = __importDefault(require("axios"));
const lib_1 = require("../lib");
const headers = () => ({
    'Content-Type': 'application/json',
    'as-api-key': process.env.AFTER_SHIP_API_KEY || 'asat_1dc1c67134c04bc7a174e91a17d8404e'
});
const axiosClient = axios_1.default.create({
    baseURL: process.env.AFTER_SHIP_ENDPOINT || 'https://api.aftership.com/postmen/v3',
    headers: headers(),
});
const axiosTracking = axios_1.default.create({
    baseURL: process.env.AFTER_SHIP_TRACKING_ENDPOINT || 'https://api.aftership.com/tracking/2024-01',
    headers: headers()
});
const getAftershipRates = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, parcels, to, returnTo } = inputs;
    const getRatesBody = {
        shipper_accounts: (0, lib_1.getAllShipperAccount)(),
        shipment: Object.assign(Object.assign({ ship_from: from, ship_to: to, parcels }, ((returnTo === null || returnTo === void 0 ? void 0 : returnTo.contact_name) ? { return_to: returnTo } : null)), { delivery_instructions: "handle with care" })
    };
    try {
        const { data } = yield axiosClient.post('/rates', JSON.stringify(getRatesBody));
        const { data: rateData } = data || {};
        return rateData.rates;
    }
    catch (error) {
        console.log("*********** Error in getAftershipRates ***********");
        console.log(error);
        return [];
    }
});
exports.getAftershipRates = getAftershipRates;
const createLabel = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, is_document, paper_size, parcels, return_shipment, service_code, to, shipper_account } = inputs;
    const body = {
        return_shipment,
        is_document,
        service_type: service_code,
        paper_size,
        shipper_account: { id: shipper_account },
        references: [
            "refernce1"
        ],
        shipment: {
            ship_from: from,
            ship_to: to,
            parcels: parcels
        },
        order_number: (0, lib_1.generateRandomNumbers)(),
        order_id: (0, lib_1.generateRandomNumbers)(),
        custom_fields: {
            ship_code: "01"
        }
    };
    try {
        const { data } = yield axiosClient.post('/labels', JSON.stringify(body));
        const { data: createLabelData } = data;
        return createLabelData ? createLabelData : null;
    }
    catch (error) {
        console.log("*********** Error in getAftershipRates ***********");
        console.log(error);
        return null;
    }
});
exports.createLabel = createLabel;
//# sourceMappingURL=index.js.map