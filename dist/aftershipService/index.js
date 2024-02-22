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
exports.createTracking = exports.createLabel = exports.getAftershipRates = void 0;
const axios_1 = __importDefault(require("axios"));
const lib_1 = require("../lib");
const headers = () => ({
    'Content-Type': 'application/json',
    'as-api-key': process.env.AFTER_SHIP_API_KEY || 'asat_9ed49ad08a38424ba8cca09266355738'
});
const axiosClient = axios_1.default.create({
    baseURL: process.env.AFTER_SHIP_ENDPOINT || 'https://sandbox-api.aftership.com/postmen/v3',
    headers: headers(),
});
const axiosTracking = axios_1.default.create({
    baseURL: process.env.AFTER_SHIP_TRACKING_ENDPOINT || 'https://api.aftership.com/tracking/2024-01',
    headers: headers()
});
const getAftershipRates = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, parcels, to, returnTo } = inputs;
    const getRatesBody = {
        shipper_accounts: [
            {
                id: "6f43fe77-b056-45c3-bce4-9fec4040da0c"
            }
        ],
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
    const { from, is_document, paper_size, parcels, return_shipment, service_type, to } = inputs;
    const body = {
        return_shipment,
        is_document,
        service_type,
        paper_size,
        shipper_account: {
            id: "3ba41ff5-59a7-4ff0-8333-64a4375c7f21"
        },
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
        return createLabelData;
    }
    catch (error) {
        console.log("*********** Error in getAftershipRates ***********");
        console.log(error);
        return null;
    }
});
exports.createLabel = createLabel;
const createTracking = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const { custom_fields: { ship_code }, created_at, files, id, order_id, order_number, rate, references, service_options, service_type, ship_date, shipper_account, status, tracking_numbers, updated_at, carrier_references } = inputs || {};
    const { delivery_date, service_name, } = rate || {};
    const { slug } = shipper_account || {};
    const body = {
        tracking: {
            slug: slug || '',
            tracking_number: tracking_numbers[0],
            title: "Title Name",
            smses: [
                "+18555072509",
            ],
            emails: [
                "email@yourdomain.com",
                "another_email@yourdomain.com"
            ],
            order_id: order_id,
            order_number: order_number,
            order_id_path: `http://www.aftership.com/order_id=${order_id}`,
            custom_fields: {
                product_name: "iPhone Case",
                product_price: "USD19.99"
            },
            language: "en",
            order_promised_delivery_date: delivery_date,
            delivery_type: "pickup_at_store",
            pickup_location: "Flagship Store",
            pickup_note: "Reach out to our staffs when you arrive our stores for shipment pickup",
            origin_country_iso3: "CHN",
            origin_state: "Beijing",
            origin_city: "Beijing",
            origin_postal_code: "065001",
            origin_raw_location: "Lihong Gardon 4A 2301, Chaoyang District, Beijing, BJ, 065001, CHN, China",
            destination_country_iso3: "USA",
            destination_state: "New York",
            destination_city: "New York City",
            destination_postal_code: "10001",
            destination_raw_location: "13th Street, New York, NY, 10011, USA, United States"
        }
    };
    try {
        const { data } = yield axiosTracking.post('/tracking', JSON.stringify(body));
        const { data: trackingData } = data;
        return trackingData;
    }
    catch (error) {
        console.log("*********** Error in CreateTracking ***********");
        console.log(error);
        return null;
    }
});
exports.createTracking = createTracking;
//# sourceMappingURL=index.js.map