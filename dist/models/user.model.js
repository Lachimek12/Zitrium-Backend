"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastNameName: { type: String, required: true },
});
const User = mongoose_1.default.model("User", UserSchema);
User.createIndexes()
    .then(() => console.log('Indexes created'))
    .catch(err => console.error('Error creating indexes', err));
module.exports = User;
//# sourceMappingURL=user.model.js.map