"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRE = exports.JWT_KEY = exports.EMAIL_SERVICE = exports.PASSWORD = exports.EMAIL = exports.MONGO_URI = exports.CLIENT_PORT = exports.PORT = void 0;
// Define a port to listen on
exports.PORT = process.env.PORT || 3000;
// Define a port on which frontend is listening on
exports.CLIENT_PORT = process.env.CLIENT_PORT || 3001;
// MongoDB connection string
exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';
// Nodemailer
exports.EMAIL = process.env.EMAIL || 'email';
exports.PASSWORD = process.env.PASSWORD || 'password';
exports.EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
// JWT
exports.JWT_KEY = process.env.JWT_KEY || 'ukulele2';
exports.JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
//# sourceMappingURL=constants.js.map