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
exports.signInUser = exports.createUser = exports.getUserById = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const lib_1 = require("../lib");
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        throw new Error(`Error in getUserById service: ${error.message}`);
    }
});
exports.getUserById = getUserById;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = userData;
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return {
                status: 400
            };
        }
        else {
            const hashedPassword = yield (0, lib_1.hashPassword)(password);
            const user = yield new user_1.default({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            }).save();
            return {
                status: 201
            };
        }
    }
    catch (error) {
        throw new Error(`Error in createUser service: ${error.message}`);
    }
});
exports.createUser = createUser;
const signInUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = credentials;
        const user = yield user_1.default.findOne({ email: email });
        if (user) {
            const isMatched = yield (0, lib_1.comparePassword)(password, user.password);
            if (!isMatched) {
                return {
                    status: 400
                };
            }
            else {
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.SECRET_KEY || '', {
                    expiresIn: 60 * 60 * 24 * 365,
                });
                return {
                    status: 200, token
                };
            }
        }
        else {
            return { status: 404 };
        }
    }
    catch (error) {
        console.log(error.message);
        return { status: 500 };
    }
});
exports.signInUser = signInUser;
//# sourceMappingURL=users.service.js.map