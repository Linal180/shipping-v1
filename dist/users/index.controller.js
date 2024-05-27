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
exports.signIn = exports.signUp = void 0;
const users_service_1 = require("./users.service");
const constants_1 = require("../constants");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        console.log("***", userData);
        const response = yield (0, users_service_1.createUser)(userData);
        console.log(response, ":::::::::::::");
        if (response.status === 400) {
            return res.status(400).json({ message: constants_1.USER_ALREADY_EXIST });
        }
        res.status(201).json({ message: constants_1.REGISTER_SUCCESSFUL });
    }
    catch (error) {
        console.log("::::::::>", error);
        res.status(500).json({ message: constants_1.USER_REGISTRATION_FAILED });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = req.body;
        const response = yield (0, users_service_1.signInUser)(credentials);
        if (response.status === 404) {
            res.status(404).json({ message: constants_1.USER_NOT_FOUND });
        }
        else if (response.status === 400) {
            res.status(400).json({ message: constants_1.WRONG_CREDENTIALS });
        }
        else {
            res.status(201).json({ token: response.token, message: constants_1.USER_LOGGED_IN_SUCCESSFUL });
        }
    }
    catch (error) {
        res.status(500).json({ message: constants_1.USER_LOG_IN_FAILED });
    }
});
exports.signIn = signIn;
//# sourceMappingURL=index.controller.js.map