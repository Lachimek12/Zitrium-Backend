"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveUserData = exports.sendFirstUser = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const UserModel = require('../models/user.model');
async function saveUser(firstName, lastNameName) {
    const myData = new UserModel({
        firstName: firstName,
        lastNameName: lastNameName,
    });
    await myData.save();
}
const sendFirstUser = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    // Find the user by ID
    const user = await UserModel.findOne();
    if (!user) {
        return res.status(404).send('User not found');
    }
    // Respond with the user data
    res.status(200).json({ name: user.firstName, email: user.lastNameName });
});
exports.sendFirstUser = sendFirstUser;
const receiveUserData = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userData = req.body;
    console.log(userData.name);
    console.log(userData.email);
    await saveUser(userData.name, userData.email);
    // Respond with a success message
    res.status(201).send('User data saved successfully');
});
exports.receiveUserData = receiveUserData;
//# sourceMappingURL=userController.js.map