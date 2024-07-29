"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveUserData = exports.sendFirstUser = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const user_1 = require("../utils/user");
const enums_1 = require("../types/enums");
const UserModel = require('../models/user.model');
const sendFirstUser = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    // Find the user by ID
    const user = await UserModel.findOne();
    if (!user) {
        return next(new Error(enums_1.ErrorType.UserDoesNotExist));
    }
    // Respond with the user data
    res.status(200).json({ name: user.username, email: user.email });
});
exports.sendFirstUser = sendFirstUser;
const receiveUserData = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userData = req.body;
    console.log(userData.name);
    console.log(userData.email);
    await (0, user_1.saveUser)(userData.name, userData.email, 'xd');
    // Respond with a success message
    res.status(201).send('User data saved successfully');
});
exports.receiveUserData = receiveUserData;
//# sourceMappingURL=homeController.js.map