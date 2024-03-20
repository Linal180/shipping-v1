"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// counter.model.ts or wherever you define your Mongoose models
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    _id: String, // typically the name of the collection for which the counter is used
    seq: {
        type: Number,
        default: 0
    }
});
exports.default = mongoose_1.default.model('counter', counterSchema);
//# sourceMappingURL=counter.js.map