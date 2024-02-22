"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chargeSchema = new mongoose_1.default.Schema({
    amount: String,
    currency: String,
});
const shipperAccountSchema = new mongoose_1.default.Schema({
    id: String,
    slug: String,
    description: String,
});
const fileSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
        required: true,
    },
    paperSize: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    }
});
const labelSchema = new mongoose_1.default.Schema({
    externalId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    shipDate: {
        type: String,
        required: true,
    },
    trackingNumbers: {
        type: [String],
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    shipperAccount: {
        type: shipperAccountSchema,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    serviceName: {
        type: String,
        required: true,
    },
    charge: {
        type: chargeSchema,
        required: true,
    },
    orderId: String,
    orderNumber: String,
    file: fileSchema
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('label', labelSchema);
//# sourceMappingURL=label.js.map