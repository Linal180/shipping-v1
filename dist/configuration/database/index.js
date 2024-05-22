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
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const databaseUrl = process.env.DATABASE_URL;
        const databaseName = process.env.DATABASE_NAME;
        console.log(`${databaseUrl}/${databaseName}?retryWrites=true&w=majority`);
        const connection = yield mongoose_1.default.connect(`${databaseUrl}/${databaseName}?retryWrites=true&w=majority`);
        if (connection) {
            console.log("Database connection established");
        }
        else {
            console.log("Couldn't connect to the Database");
        }
    }
    catch (error) {
        console.log("****** Couldn't connect to the Database internal server error *****");
        console.log(error);
    }
});
exports.default = dbConnection;
//# sourceMappingURL=index.js.map