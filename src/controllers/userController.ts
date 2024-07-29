import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '../middlewares/asyncHandler';
import jwt from 'jsonwebtoken';
import { CLIENT_PORT, EMAIL, JWT_EXPIRE } from "../utils/constants";
import { transporter } from '../models/transporter.model';
import { saveUser } from "../utils/user";
import { JWT_KEY } from "../utils/constants"
import { IUser } from "../models/user.model";
import { Options } from "nodemailer/lib/mailer";
import { ErrorType } from "../types/enums";

const UserModel = require('../models/user.model');


function createVerificationMail(email: string): Options {
    const token: string = jwt.sign({ email }, JWT_KEY, { expiresIn: JWT_EXPIRE });

    const mailConfigurations: Options = {
        from: EMAIL,
        to: email,
        subject: 'Email Verification',

        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:${CLIENT_PORT}/verify-email?token=${token} 
               Thanks`
    };

    return mailConfigurations;
}

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;
    const email: string = newUser.email

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (checkForUser) {
        return next(new Error(ErrorType.EmailTaken));
    }

    const mailConfigurations: Options = createVerificationMail(email);

    transporter.sendMail(mailConfigurations, async (error, info) => {
        if (error) {
            console.log(error);
            return next(new Error(ErrorType.ErrorSendingEmail));
        }

        await saveUser(newUser.username, newUser.email, newUser.password);
        res.status(203).send({ message: 'Verification email sent'});
        console.log(info);
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

    const mailConfigurations: Options = createVerificationMail(email);

    transporter.sendMail(mailConfigurations, async (error, info) => {
        if (error) {
            console.log(error);
            return next(new Error(ErrorType.ErrorSendingEmail));
        }

        res.status(203).send({ message: 'Verification email sent'});
        console.log(info);
      });
});

const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.params.token;

    jwt.verify(token, JWT_KEY, async (err, decoded) => {
        if (err) {
            console.log(err);
            return next(new Error(ErrorType.VerificationFailed));
        }
        else {
            await UserModel.updateOne({ email: decoded }, { $set: { verified: true } });
            res.status(203).send("Email verifified successfully");
        }
    });
});

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
};