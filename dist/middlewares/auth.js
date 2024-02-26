"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    if (req.header('Authorization')) {
        const authHeader = req.header('Authorization').split(' ');
        if (authHeader.length > 0) {
            const token = authHeader[1];
            if (token) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'secret');
                    req.user = decoded;
                    next();
                }
                catch (error) {
                    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
                }
            }
            else {
                return res.status(401).json({ message: 'Unauthorized: Missing token' });
            }
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map