"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const constants_1 = require("../utils/constants");
const mailgun = new mailgun_js_1.default(form_data_1.default);
exports.transporter = mailgun.client({
    username: 'api',
    key: constants_1.MAILGUN_API_KEY,
    //url: 'https://api.eu.mailgun.net', needed for eu based domain
});
//# sourceMappingURL=transporter.model.js.map