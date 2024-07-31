import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '../middlewares/asyncHandler';
import { CLIENT_PORT, EMAIL, VERIFICATION_LENGTH } from "../utils/constants";
import { transporter } from '../models/transporter.model';
import { saveUser } from "../utils/user";
import { IUser } from "../models/user.model";
import { ErrorType } from "../types/enums";
import { MailgunMessageData, MessagesSendResult } from "mailgun.js";
import { getEmailHTML } from "../views/email.html";

const UserModel = require('../models/user.model');


function generateVerificationCode(): string {
    let code = "";
    const givenSet1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const givenSet2 = "1234567890"

    for (let i = 0; i < VERIFICATION_LENGTH; i++) {
        let pos = Math.floor(Math.random() * givenSet2.length);
        code += givenSet2[pos];
    };

    return code;
}

function createVerificationMail(email: string, token: string): MailgunMessageData {
    const messageData: MailgunMessageData = {
        from: `Zitrium <mailgun@${EMAIL}>`,
        to: [`${email}`],
        subject: "Email Verification",

        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Here is your verification code: ${token}
               Thanks`,
        //html: "<h1>hi</h1>", http://localhost:${CLIENT_PORT}/VerifyEmail?token=${token} 
        html: getEmailHTML(token),
    };

    return messageData;
}

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;
    const email: string = newUser.email;

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (checkForUser) {
        return next(new Error(ErrorType.EmailTaken));
    }

    const token: string = generateVerificationCode();
    transporter.messages.create(EMAIL, createVerificationMail(email, token))
    .then(async (msg: MessagesSendResult) => {
        await saveUser(newUser.username, newUser.email, newUser.password, token);
        res.status(200).send({ message: 'Verification email sent'});
        console.log(msg);
    })
    .catch((err: Error) => {
        console.error(err);
        return next(new Error(ErrorType.ErrorSendingEmail));
    });
});

const resendVerificationEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email;

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (!checkForUser) {
        return next(new Error(ErrorType.UserDoesNotExist));
    }
    if (checkForUser.verified) {
        return next(new Error(ErrorType.EmailVerified));
    }

    const token: string = generateVerificationCode();
    transporter.messages.create(EMAIL, createVerificationMail(email, token))
    .then(async (msg: MessagesSendResult) => {
        await UserModel.updateOne({ email: email }, { $set: { createdAt: Date.now() } });
        res.status(200).send({ message: 'Verification email sent'});
        console.log(msg);
    })
    .catch((err: Error) => {
        console.error(err);
        return next(new Error(ErrorType.ErrorSendingEmail));
    })
});

const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.query.token as string;
    const email: string = req.query.email as string;

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (!checkForUser) {
        return next(new Error(ErrorType.UserDoesNotExist));
    }
    if (checkForUser.verified) {
        return next(new Error(ErrorType.EmailVerified));
    }
    if (checkForUser.verificationCode != token) {
        return next(new Error(ErrorType.VerificationFailed));
    }

    await UserModel.updateOne(
        { email: email }, 
        { 
            $set: { verified: true },
            $unset: { createdAt: '', verificationCode: '' },
        }
    );
    res.status(200).send("Email verifified successfully");
});

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
};