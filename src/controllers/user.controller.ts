import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '@middlewares/asyncHandler';
import { BCRYPT_SALT_ROUNDS, EMAIL, JWT_SECRET_KEY, JWT_TOKEN_EXPIRE_TIME, REDIS_KEY_EXPIRE_SEC, VERIFICATION_LENGTH, VERIFICATION_RESEND_COOLDOWN_SEC } from "@utils/constants";
import { transporter } from '@models/transporter.model';
import { saveUser } from "@utils/user";
import { IUser } from "@models/user.model";
import { ErrorType } from "@/types/enums";
import { MailgunMessageData, MessagesSendResult } from "mailgun.js";
import { getEmailHTML } from "@views/email.html";
import jwt from "jsonwebtoken"
import validator from 'validator';
import bcrypt from 'bcrypt';
import { getTokenFromHeader } from "@utils/common";

const UserModel = require('@models/user.model');
const redisClient = require('@config/redis');


function generateVerificationCode(): string {
    let code = "";
    const givenSet1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const givenSet2 = "1234567890"

    const givenSet: string = givenSet2; // Only here change currently used set, to prevent mistakes
    for (let i = 0; i < VERIFICATION_LENGTH; i++) {
        let pos = Math.floor(Math.random() * givenSet.length);
        code += givenSet[pos];
    };

    return code;
}

function createVerificationMail(email: string, token: string): MailgunMessageData {
    const messageData: MailgunMessageData = {
        from: `Zitrium <mailgun@${EMAIL}>`,
        to: [`${email}`],
        subject: "Email Verification",

        text: `
                Hi! There, You have recently visited
                our website and entered your email.
                Here is your verification code: ${token}
                Thanks`, 
        html: getEmailHTML(token),
    };

    return messageData;
}

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;
    const email: string = newUser.email;

    if (!validator.isEmail(email)) {
        return next(new Error(ErrorType.IncorrectEmail));
    }

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
    if ((Date.now() - checkForUser.createdAt.getTime()) / 1000 < VERIFICATION_RESEND_COOLDOWN_SEC) {
        return next(new Error(ErrorType.ResendEmailCooldown));
    }

    const token: string = generateVerificationCode();
    transporter.messages.create(EMAIL, createVerificationMail(email, token))
    .then(async (msg: MessagesSendResult) => {
        const hashedToken = await bcrypt.hash(token, BCRYPT_SALT_ROUNDS);
        await UserModel.updateOne(
            { email: email }, 
            { 
                $set: { createdAt: Date.now(), verificationCode: hashedToken },
            }
        );
        res.status(200).send({ message: 'Verification email sent'});
        console.log(msg);
    })
    .catch((err: Error) => {
        console.error(err);
        return next(new Error(ErrorType.ErrorSendingEmail));
    })
});

const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.body.token;
    const email: string = req.body.email;

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (!checkForUser) {
        return next(new Error(ErrorType.UserDoesNotExist));
    }
    if (checkForUser.verified) {
        return next(new Error(ErrorType.EmailVerified));
    }
    const tokensMatch: boolean = await bcrypt.compare(token, checkForUser.verificationCode);
    if (!tokensMatch) {
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

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (!checkForUser) {
        return next(new Error(ErrorType.UserDoesNotExist));
    }

    // IDK if we check here if user is verified

    const passwordMatch: boolean = await bcrypt.compare(password, checkForUser.password);
    if (!passwordMatch) {
        return next(new Error(ErrorType.IncorrectPassword));
    }

    const payload = {
        id: checkForUser._id,
        email: checkForUser.email,
    };
    const token: string = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_TOKEN_EXPIRE_TIME });

    // Respond with user profile data and access token
    res.status(200).json({
        token: token,
        user: {
          username: checkForUser.username,
          email: checkForUser.email,
        }
    });
});

const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = getTokenFromHeader(req);
    redisClient.set(token, REDIS_KEY_EXPIRE_SEC, JSON.stringify({ revoked: 'true' }));
    
    res.status(200).json("Logged out successfully");
});

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    logoutUser,
};