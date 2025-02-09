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
exports.shipmentTracking = exports.shipmentDocumentByTracking = exports.shippingDoc = exports.userShipments = exports.singleShipment = exports.allShipments = exports.createShipment = exports.getRates = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const user_1 = __importDefault(require("../../models/user"));
const shipment_1 = __importDefault(require("../../models/shipment"));
const lib_1 = require("../../lib");
const service_1 = require("./service");
const getRates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const { data, message, status } = yield (0, service_1.getCarrierRates)(body);
        res.status(status).json({ message, data });
    }
    catch (error) {
        (0, lib_1.printLogs)(exports.getRates.name, error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.getRates = getRates;
const createShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req || {};
    try {
        const currentUser = yield user_1.default.findById(user.userId);
        if (!currentUser) {
            res.status(403).json({ message: "This action is forbidden for you" });
            return;
        }
        const { data, message, status } = yield (0, service_1.createCarrierShipment)(req);
        res.status(status).json({ message, data });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createShipment = createShipment;
const allShipments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, message, status } = yield (0, service_1.getAllShipments)(req);
        res.status(status).json({ message, data });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.allShipments = allShipments;
const singleShipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id } } = req;
    try {
        const { shipment, status } = yield (0, service_1.getShipment)(id);
        res.status(status).json({ data: shipment });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.singleShipment = singleShipment;
const userShipments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, status } = yield (0, service_1.getUserShipments)(req);
        res.status(status).json({ data });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.userShipments = userShipments;
const shippingDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const shipment = yield shipment_1.default.findOne({ _id: id });
        if (!shipment) {
            res.status(404).json({ message: "Shipment Not Found" });
            return;
        }
        const documents = shipment.documents;
        if (!documents.length) {
            return res.status(404).json({ message: "Shipment hae no documents" });
        }
        const decodedContent = Buffer.from(documents[0].content, 'base64');
        const filePath = path_1.default.join(lib_1.TEMP_DIR, `${documents[0]._id}.pdf`);
        fs_1.default.writeFileSync(filePath, decodedContent);
        res.sendFile(filePath);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.shippingDoc = shippingDoc;
const shipmentDocumentByTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tracking } = req.params;
    if (!tracking) {
        return res.status(400).json({ message: "Bad Request | Tracking ID missing" });
    }
    try {
        const shipment = yield shipment_1.default.findOne({ trackingNumber: tracking });
        if (!shipment) {
            res.status(404).json({ message: "Shipment Not Found" });
            return;
        }
        const documents = shipment.documents;
        if (!documents.length) {
            return res.status(404).json({ message: "Shipment hae no documents" });
        }
        const decodedContent = Buffer.from(documents[0].content, 'base64');
        const filePath = path_1.default.join(lib_1.TEMP_DIR, `${documents[0]._id}.pdf`);
        fs_1.default.writeFileSync(filePath, decodedContent);
        res.sendFile(filePath);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.shipmentDocumentByTracking = shipmentDocumentByTracking;
const shipmentTracking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data, message, status } = yield (0, service_1.getShipmentTracking)(id);
        res.status(status).json({ message, data });
    }
    catch (error) {
        res.status(500).json(`Error fetching results: ${error.message}`);
    }
});
exports.shipmentTracking = shipmentTracking;
//# sourceMappingURL=index.controller.js.map