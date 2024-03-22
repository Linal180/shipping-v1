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
exports.getAllShipperAccount = exports.getUspsShipperAccount = exports.getChronoPostShipperAccount = exports.getShipperAccount = exports.customizeLabel = exports.getNextSequenceId = exports.addCounterRecord = exports.generateLabelFileUrl = exports.generateRandomNumbers = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const counter_1 = __importDefault(require("../models/counter"));
const constants_1 = require("../constants");
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        let hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        return hashedPassword;
    }
    catch (error) {
        console.log(error);
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashPassword);
});
exports.comparePassword = comparePassword;
const generateRandomNumbers = () => {
    let result = '';
    const length = 6;
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
};
exports.generateRandomNumbers = generateRandomNumbers;
const generateLabelFileUrl = (id) => {
    return `${process.env.BASE_URL || 'https://shipping-v1.vercel.app'}/shipping/get-file/${id}`;
};
exports.generateLabelFileUrl = generateLabelFileUrl;
const addCounterRecord = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRecord = yield counter_1.default.findById(tableName);
    if (!existingRecord) {
        yield counter_1.default.create({ _id: tableName, seq: 0 });
    }
});
exports.addCounterRecord = addCounterRecord;
const getNextSequenceId = (sequenceName) => __awaiter(void 0, void 0, void 0, function* () {
    const sequenceDocument = yield counter_1.default.findOneAndUpdate({ _id: sequenceName }, { $inc: { seq: 1 } }, {
        new: true,
        upsert: true
    });
    return sequenceDocument.seq;
});
exports.getNextSequenceId = getNextSequenceId;
const customizeLabel = (label) => {
    return {
        _id: label._id.toString(),
        serviceName: label.serviceName,
        charge: {
            priceWithoutVAT: (parseFloat(label.charge.amount) * constants_1.COMMISSION_PERCENTAGE).toFixed(2),
            VAT: '0.0',
            total: (parseFloat(label.charge.amount) * constants_1.COMMISSION_PERCENTAGE).toFixed(2),
        },
        createdAt: label.createdAt,
        status: label.status,
        trackingNumbers: label.trackingNumbers,
        orderNumber: label.orderNumber,
        file: (0, exports.generateLabelFileUrl)(label._id.toString()) // Ensure generateLabelFileUrl is defined somewhere
    };
};
exports.customizeLabel = customizeLabel;
const getShipperAccount = () => {
    return {
        id: process.env.AFTER_SHIP_SHIPPER_ACCOUNT || "9f115bc2-7422-47ce-a8e9-aa3b3cd91b80"
    };
};
exports.getShipperAccount = getShipperAccount;
const getChronoPostShipperAccount = () => {
    return {
        id: "59c9757332f44f4d9132f5b08aae598f"
    };
};
exports.getChronoPostShipperAccount = getChronoPostShipperAccount;
const getUspsShipperAccount = () => {
    return {
        id: "9f115bc2-7422-47ce-a8e9-aa3b3cd91b80"
    };
};
exports.getUspsShipperAccount = getUspsShipperAccount;
const getAllShipperAccount = () => {
    return [
        (0, exports.getChronoPostShipperAccount)(),
        (0, exports.getUspsShipperAccount)()
    ];
};
exports.getAllShipperAccount = getAllShipperAccount;
//# sourceMappingURL=index.js.map