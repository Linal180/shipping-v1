"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCarriers = void 0;
const checkCarriers = (req, res, next) => {
    const { carrier } = req.body || {};
    if (process.env.SUPPORTED_CARRIERS.includes(carrier)) {
        next();
    }
    else {
        return res.status(401).json({ message: `${carrier} is not a supported carrier!` });
    }
};
exports.checkCarriers = checkCarriers;
//# sourceMappingURL=checkCarriers.js.map