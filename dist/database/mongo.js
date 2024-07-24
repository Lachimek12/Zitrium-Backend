"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDB = connectToMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
function connectToMongoDB(mongo_uri) {
    mongoose_1.default.connect(mongo_uri)
        .then(() => {
        console.log('Connected to MongoDB');
    })
        .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
//# sourceMappingURL=mongo.js.map