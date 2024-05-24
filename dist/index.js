"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const shipping_1 = __importDefault(require("./routes/shipping"));
const v2_1 = __importDefault(require("./routes/v2"));
const database_1 = __importDefault(require("./configuration/database"));
const auth_2 = require("./middlewares/auth");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = 3001;
(0, database_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/shipping', shipping_1.default);
app.use('/v2', auth_2.authenticateToken, v2_1.default);
app.get('/', (req, res) => {
    res.send('Hello Shipping World!');
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map