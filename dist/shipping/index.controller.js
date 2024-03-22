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
exports.getTracking = exports.getLabels = exports.getLabel = exports.createLabel = exports.getRates = exports.getFile = void 0;
const shipping_service_1 = require("./shipping.service");
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = yield (0, shipping_service_1.getPDFFile)(id);
        file.pipe(res);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to get file");
    }
});
exports.getFile = getFile;
const getRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipmentDetails = req.body;
        if (!shipmentDetails.from || !shipmentDetails.to || !shipmentDetails.parcels) {
            return res.status(400).send("Shipment details are incomplete.");
        }
        const rates = yield (0, shipping_service_1.getRates)(shipmentDetails);
        res.json(rates);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to get rates");
    }
});
exports.getRates = getRates;
const createLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const labelDetails = req.body;
        if (!labelDetails.from || !labelDetails.to || !labelDetails.parcels || !labelDetails.service_code) {
            return res.status(400).send("Shipment details are incomplete.");
        }
        const rates = yield (0, shipping_service_1.createLabelForShipment)(labelDetails, user.userId);
        res.json(rates);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to get rates");
    }
});
exports.createLabel = createLabel;
const getLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labels = yield (0, shipping_service_1.getSingleLabel)(req);
        res.json(labels);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to get rates");
    }
});
exports.getLabel = getLabel;
const getLabels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labels = yield (0, shipping_service_1.getUserLabels)(req);
        res.json(labels);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Failed to get rates");
    }
});
exports.getLabels = getLabels;
const getTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, message, tracking } = yield (0, shipping_service_1.getLabelTracking)(req);
        res.status(status).json({ message, tracking });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get rates", tracking: null });
    }
});
exports.getTracking = getTracking;
//# sourceMappingURL=index.controller.js.map