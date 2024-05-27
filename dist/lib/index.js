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
exports.getErrorResponse = exports.TEMP_DIR = exports.createDHLGenericShipmentPayload = exports.getDateTimeForShipment = exports.getDHLRateGenericResponse = exports.getCurrentDate = exports.printLogs = exports.getDHLHeaders = exports.getAllShipperAccount = exports.getUspsShipperAccount = exports.getChronoPostShipperAccount = exports.getShipperAccount = exports.customizeLabel = exports.getNextSequenceId = exports.addCounterRecord = exports.generateLabelFileUrl = exports.generateRandomNumbers = exports.comparePassword = exports.hashPassword = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = require("dotenv");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const counter_1 = __importDefault(require("../models/counter"));
const constants_1 = require("../constants");
(0, dotenv_1.config)(); // To load envs ASAP
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
const getDHLHeaders = () => {
    const username = process.env.DHL_USERNAME;
    const password = process.env.DHL_PASSWORD;
    const hash = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    return {
        'Content-Type': 'application/json',
        'Authorization': hash
    };
};
exports.getDHLHeaders = getDHLHeaders;
const printLogs = (methodName, error) => {
    const { response } = error || {};
    if (response) {
        console.log(`*************** Error in ${methodName} **************`);
        console.log("Error: ", response);
        console.log("******************************************************");
    }
};
exports.printLogs = printLogs;
const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.getCurrentDate = getCurrentDate;
const getDHLRateGenericResponse = (rates) => {
    const { productName, totalPrice, weight, totalPriceBreakdown, detailedPriceBreakdown } = rates || {};
    const { priceCurrencies, totalSum } = totalPrice.reduce((accumulator, currentItem) => {
        accumulator.totalSum += currentItem.price;
        if (currentItem.priceCurrency) {
            accumulator.priceCurrencies += accumulator.priceCurrencies ? `, ${currentItem.priceCurrency}` : currentItem.priceCurrency;
        }
        return accumulator;
    }, { totalSum: 0, priceCurrencies: '' });
    let taxSum = 0;
    let basePriceSum = 0;
    totalPriceBreakdown.forEach(item => {
        if (item.priceBreakdown && item.priceBreakdown.length) {
            item.priceBreakdown.forEach(subItem => {
                basePriceSum += subItem.price;
            });
        }
    });
    detailedPriceBreakdown.forEach(item => {
        var _a;
        if (item.breakdown) {
            (_a = item === null || item === void 0 ? void 0 : item.breakdown) === null || _a === void 0 ? void 0 : _a.forEach(subItem => {
                if (subItem.priceBreakdown) {
                    subItem.priceBreakdown.forEach(priceItem => {
                        taxSum += priceItem.price;
                    });
                }
            });
        }
    });
    return {
        serviceName: productName,
        totalPrice: {
            currency: priceCurrencies || '',
            price: (totalSum || 1) * parseFloat(constants_1.COMMISSION_PERCENTAGE.toFixed(2))
        },
        weight: {
            unit: weight.unitOfMeasurement,
            value: weight.provided
        },
        tax: {
            amount: parseFloat((totalSum - basePriceSum).toFixed(2))
        },
    };
};
exports.getDHLRateGenericResponse = getDHLRateGenericResponse;
const getDateTimeForShipment = (date) => {
    const timeStr = "12:00:00";
    const timezoneOffset = "+01:00";
    const combinedStr = `${date}T${timeStr}${timezoneOffset}`;
    const dateTime = moment_timezone_1.default.parseZone(combinedStr);
    return dateTime.format("YYYY-MM-DDTHH:mm:ss [GMT]Z");
};
exports.getDateTimeForShipment = getDateTimeForShipment;
const createDHLGenericShipmentPayload = (payload) => {
    const { receiver, sender, shipmentDate, shipmentNotification, content } = payload || {};
    const { address } = sender, senderInfo = __rest(sender, ["address"]);
    const { address: receiverAddress } = receiver, receiverInfo = __rest(receiver, ["address"]);
    const { declaredValue, declaredValueCurrency, description, isCustomsDeclarable, lineItems, packages } = content || {};
    return JSON.stringify({
        plannedShippingDateAndTime: (0, exports.getDateTimeForShipment)(shipmentDate),
        pickup: {
            isRequested: false
        },
        getRateEstimates: true,
        productCode: "P",
        accounts: [
            {
                typeCode: "shipper",
                number: process.env.DHL_ACCOUNT_NUMBER
            }
        ],
        customerDetails: {
            shipperDetails: {
                postalAddress: address,
                contactInformation: senderInfo
            },
            receiverDetails: {
                postalAddress: receiverAddress,
                contactInformation: receiverInfo
            }
        },
        content: {
            packages,
            incoterm: "DDU",
            exportDeclaration: {
                lineItems,
                invoice: {
                    number: "1333343",
                    date: "2022-10-22"
                },
                destinationPortName: "New York Port",
                exportReasonType: "permanent"
            },
            isCustomsDeclarable: isCustomsDeclarable || true,
            declaredValue: declaredValue || 100,
            declaredValueCurrency: declaredValueCurrency || 'USD',
            description: description || '',
            unitOfMeasurement: "metric"
        },
        shipmentNotification: shipmentNotification.map(notification => {
            const { email, message, type } = notification;
            return {
                typeCode: type || '',
                receiverId: email || '',
                bespokeMessage: message || ''
            };
        })
    });
};
exports.createDHLGenericShipmentPayload = createDHLGenericShipmentPayload;
exports.TEMP_DIR = path_1.default.join(__dirname, 'tmp');
if (!fs_1.default.existsSync(exports.TEMP_DIR)) {
    fs_1.default.mkdirSync(exports.TEMP_DIR);
}
const getErrorResponse = (error) => {
    const { response: { data: { status = "Unknown Status", message = 'No message available', detail = 'no detail available', additionalDetails = [] } = {} } = {} } = error || {};
    return {
        status, message,
        detail: additionalDetails.length ? detail + additionalDetails.map((err, index) => ` | Error ${index + 1}: ${err}`) : detail
    };
};
exports.getErrorResponse = getErrorResponse;
//# sourceMappingURL=index.js.map