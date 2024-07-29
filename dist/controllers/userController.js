"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationEmail = exports.verifyEmail = exports.registerUser = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
const transporter_model_1 = require("../models/transporter.model");
const user_1 = require("../utils/user");
const constants_2 = require("../utils/constants");
const enums_1 = require("../types/enums");
const UserModel = require('../models/user.model');
function createVerificationMail(email) {
    const token = jsonwebtoken_1.default.sign({ email }, constants_2.JWT_KEY, { expiresIn: constants_1.JWT_EXPIRE });
    const mailConfigurations = {
        from: constants_1.EMAIL,
        to: email,
        subject: 'Email Verification',
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:${constants_1.CLIENT_PORT}/verify-email?token=${token} 
               Thanks`
    };
    return mailConfigurations;
}
const registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const newUser = req.body;
    const email = newUser.email;
    const checkForUser = await UserModel.findOne({ email });
    if (checkForUser) {
        return next(new Error(enums_1.ErrorType.EmailTaken));
    }
    const mailConfigurations = createVerificationMail(email);
    transporter_model_1.transporter.sendMail(mailConfigurations, async (error, info) => {
        if (error) {
            console.log(error);
            return next(new Error(enums_1.ErrorType.ErrorSendingEmail));
        }
        await (0, user_1.saveUser)(newUser.username, newUser.email, newUser.password);
        res.status(203).send({ message: 'Verification email sent' });
        console.log(info);
    });
});
exports.registerUser = registerUser;
const resendVerificationEmail = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const email = req.body.email;
    const checkForUser = await UserModel.findOne({ email });
    if (!checkForUser) {
        return next(new Error(enums_1.ErrorType.UserDoesNotExist));
    }
    if (checkForUser.verified) {
        return next(new Error(enums_1.ErrorType.EmailVerified));
    }
    const mailConfigurations = createVerificationMail(email);
    transporter_model_1.transporter.sendMail(mailConfigurations, async (error, info) => {
        if (error) {
            console.log(error);
            return next(new Error(enums_1.ErrorType.ErrorSendingEmail));
        }
        res.status(203).send({ message: 'Verification email sent' });
        console.log(info);
    });
});
exports.resendVerificationEmail = resendVerificationEmail;
const verifyEmail = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const token = req.params.token;
    jsonwebtoken_1.default.verify(token, constants_2.JWT_KEY, async (err, decoded) => {
        if (err) {
            console.log(err);
            return next(new Error(enums_1.ErrorType.VerificationFailed));
        }
        else {
            await UserModel.updateOne({ email: decoded }, { $set: { verified: true } });
            res.status(203).send("Email verifified successfully");
        }
    });
});
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=userController.js.map