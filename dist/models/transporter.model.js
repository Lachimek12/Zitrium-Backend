"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("../utils/constants");
exports.transporter = nodemailer_1.default.createTransport({
    service: constants_1.EMAIL_SERVICE,
    auth: {
        user: constants_1.EMAIL,
        pass: constants_1.PASSWORD,
    },
});
//# sourceMappingURL=transporter.model.js.map