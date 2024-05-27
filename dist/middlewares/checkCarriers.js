"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCarriers = void 0;
const checkCarriers = (req, res, next) => {
    const { carrier } = req.body || {};
    if (carrier) {
        if (process.env.SUPPORTED_CARRIERS.includes(carrier)) {
            next();
        }
        else {
            return res.status(401).json({ message: `${carrier} is not a supported carrier!` });
        }
    }
    else {
        return res.status(400).json({ message: "BAD REQUEST | Required parameter 'Carrier' is missing" });
    }
};
exports.checkCarriers = checkCarriers;
//# sourceMappingURL=checkCarriers.js.map