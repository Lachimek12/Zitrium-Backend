import { Request, Response, NextFunction } from "express";
import { ErrorType } from "@/types/enums";


module.exports = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let status: number = 500;
    let message: string = "Server error";

    if (err.message == ErrorType.EmailTaken) {
        status = 400;
        message = 'Email already in use.';
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
        message = 'Email verification failed, possibly the code is invalid or expired';
    }
    else if (err.message == ErrorType.ErrorSendingEmail) {
        status = 500;
        message = 'Could not send verification email';
    }
    else if (err.message == ErrorType.IncorrectEmail) {
        status = 400;
        message = 'Given email is incorrect';
    }
    else if (err.message == ErrorType.ResendEmailCooldown) {
        status = 400;
        message = 'Wait before resending verification email.'
    }
    else if (err.message == ErrorType.IncorrectPassword) {
        status = 400;
        message = 'Incorrect password';
    }
    else if (err.message == ErrorType.TokenExpired) {
        status = 401;
        message = 'Token expired, please login.';
    }
    else if (err.message == ErrorType.EmailNotVerified) {
        status = 400;
        message = 'Email is not verified. Please verify your email first.'
    }

    console.error(err);
    res.status(status).send(message);
}