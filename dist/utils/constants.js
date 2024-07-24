"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URI = exports.PORT = void 0;
// Define a port to listen on
exports.PORT = process.env.PORT || 3000;
// MongoDB connection string
exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demoDB';
//# sourceMappingURL=constants.js.map