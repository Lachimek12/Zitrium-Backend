"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUser = saveUser;
const UserModel = require('../models/user.model');
async function saveUser(username, email, password) {
    const myData = new UserModel({
        username: username,
        email: email,
        password: password,
        verified: false,
    });
    await myData.save();
}
//# sourceMappingURL=user.js.map