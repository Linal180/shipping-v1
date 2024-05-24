"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shipment = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    trackingNumber: {
        type: String,
        required: true
    },
    trackingUrl: {
        type: String
    },
    packages: [{
            referenceNumber: {
                type: Number
            },
            trackingNumber: {
                type: String
            },
            trackingUrl: {
                type: String
            }
        }],
    documents: [{
            imageFormat: {
                type: String
            },
            content: {
                type: String
            },
            typeCode: {
                type: String
            }
        }],
    shipmentDetails: [{
            pickupDetails: {
                localCutoffDateAndTime: { type: String },
                gmtCutoffTime: { type: String },
                cutoffTimeOffset: { type: String },
                pickupEarliest: { type: String },
                pickupLatest: { type: String },
                totalTransitDays: { type: Number },
                pickupAdditionalDays: { type: Number },
                deliveryAdditionalDays: { type: Number },
                pickupDayOfWeek: { type: Number },
                deliveryDayOfWeek: { type: Number }
            }
        }],
    estimatedDeliveryDate: {
        estimatedDeliveryDate: { type: String },
        estimatedDeliveryType: { type: String }
    }
});
exports.default = mongoose_1.default.model("Shipment", shipment);
//# sourceMappingURL=shipment.js.map