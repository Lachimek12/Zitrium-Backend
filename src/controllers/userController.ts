import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '../middlewares/asyncHandler';
import jwt from 'jsonwebtoken';
import { CLIENT_PORT, EMAIL, JWT_EXPIRE } from "../utils/constants";
import { transporter } from '../models/transporter.model';
import { saveUser } from "../utils/user";
import { JWT_KEY } from "../utils/constants"
import { IUser } from "../models/user.model";
import { ErrorType } from "../types/enums";
import { MailgunMessageData, MessagesSendResult } from "mailgun.js";

const UserModel = require('../models/user.model');


function createVerificationMail(email: string): MailgunMessageData {
    const token: string = jwt.sign({ email }, JWT_KEY, { expiresIn: JWT_EXPIRE });

    const messageData: MailgunMessageData = {
        from: `Zitrium <mailgun@${EMAIL}>`,
        to: [`${email}`],
        subject: "Email Verification",

        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:${CLIENT_PORT}/VerifyEmail?token=${token} 
               Thanks`,
        //html: "<h1>hi</h1>",
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

    transporter.messages.create(EMAIL, createVerificationMail(email))
    .then(async (msg: MessagesSendResult) => {
        await saveUser(newUser.username, newUser.email, newUser.password);
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

    transporter.messages.create(EMAIL, createVerificationMail(email))
    .then((msg: MessagesSendResult) => {
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

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
        if (err) {
            console.log(err);
            return next(new Error(ErrorType.VerificationFailed));
        }
        else {
            const decodedEmail: string = (decoded as any).email;
            if (!decodedEmail) {
                return next(new Error(ErrorType.VerificationFailed));
            }

            await UserModel.updateOne({ email: decodedEmail }, { $set: { verified: true } });
            res.status(200).send("Email verifified successfully");
        }
    });
});

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
};