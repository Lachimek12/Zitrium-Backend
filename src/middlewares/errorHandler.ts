import { Request, Response, NextFunction } from "express";
import { ErrorType } from "../types/enums";


module.exports = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let status: number = 500;
    let message: string = "Server error";

    if (err.message == ErrorType.EmailTaken) {
        status = 400;
        message = 'Email already in use. If you did not verify your email, please verify or resend verification email below.';
    }
    else if (err.message == ErrorType.UserDoesNotExist) {
        status = 400;
        message = 'Given user does not exist. Please register first.';
    }
    else if (err.message == ErrorType.EmailVerified) {
        status = 400;
        message = 'Email already verified.';
    }
    else if (err.message == ErrorType.VerificationFailed) {
        status = 400;
        message = 'Email verification failed, possibly the link is invalid or expired';
    }
    else if (err.message == ErrorType.ErrorSendingEmail) {
        status = 500;
        message = 'Could not send verification email';
    }

    console.error(err);
    res.status(status).send(message);
}