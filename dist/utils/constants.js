"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRE = exports.JWT_KEY = exports.MAILGUN_API_KEY = exports.EMAIL = exports.MONGO_URI = exports.CLIENT_PORT = exports.PORT = void 0;
// Dotenv comes here to ensure that .env file is loaded before constants are
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Define a port to listen on
exports.PORT = process.env.PORT || 3000;
// Define a port on which frontend is listening on
exports.CLIENT_PORT = process.env.CLIENT_PORT || 3001;
// MongoDB connection string
exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';
// Nodemailer
exports.EMAIL = process.env.EMAIL || 'email';
exports.MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || 'key';
// JWT
exports.JWT_KEY = process.env.JWT_KEY || 'ukulele2';
exports.JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
//# sourceMappingURL=constants.js.map