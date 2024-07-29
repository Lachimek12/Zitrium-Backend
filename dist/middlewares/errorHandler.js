"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../types/enums");
module.exports = (err, req, res, next) => {
    let status = 500;
    let message = "Server error";
    if (err.message == enums_1.ErrorType.EmailTaken) {
        status = 400;
        message = 'Email already in use. If you did not verify your email, please verify or resend verification email below.';
    }
    else if (err.message == enums_1.ErrorType.UserDoesNotExist) {
        status = 400;
        message = 'Given user does not exist. Please register first.';
    }
    else if (err.message == enums_1.ErrorType.EmailVerified) {
        status = 400;
        message = 'Email already verified.';
    }
    else if (err.message == enums_1.ErrorType.VerificationFailed) {
        status = 400;
        message = 'Email verification failed, possibly the link is invalid or expired';
    }
    else if (err.message == enums_1.ErrorType.ErrorSendingEmail) {
        status = 500;
        message = 'Could not send verification email';
    }
    console.error(err);
    res.status(status).send(message);
};
//# sourceMappingURL=errorHandler.js.map