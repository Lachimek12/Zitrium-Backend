import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '@middlewares/asyncHandler';
import { BCRYPT_SALT_ROUNDS, EMAIL, JWT_SECRET_KEY, JWT_TOKEN_EXPIRE_TIME, USED_JWT_TOKEN_EXPIRE_SEC, VERIFICATION_EXPIRE_SEC, VERIFICATION_LENGTH, VERIFICATION_RESEND_COOLDOWN_SEC } from "@utils/constants";
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
    const givenSet = "1234567890";

    for (let i = 0; i < VERIFICATION_LENGTH; i++) {
        let pos = Math.floor(Math.random() * givenSet.length);
        code += givenSet[pos];
    };

    return code;
}

function createVerificationMail(email: string, code: string): MailgunMessageData {
    const messageData: MailgunMessageData = {
        from: `Zitrium <mailgun@${EMAIL}>`,
        to: [`${email}`],
        subject: "Email Verification",

        text: `
                Hi! There, You have recently visited
                our website and entered your email.
                Here is your verification code: ${code}
                Thanks`, 
        html: getEmailHTML(code),
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
    if (checkForUser && checkForUser.verified) {
        return next(new Error(ErrorType.EmailTaken));
    }

    const code: string = generateVerificationCode();
    transporter.messages.create(EMAIL, createVerificationMail(email, code))
    .then(async (msg: MessagesSendResult) => {
        if (checkForUser) {
            const hashedPass: string = await bcrypt.hash(newUser.password, BCRYPT_SALT_ROUNDS);
            await UserModel.updateOne(
                { email: email }, 
                { 
                    $set: { createdAt: Date.now(), password: hashedPass, username: newUser.username },
                }
            );
        }
        else {
            await saveUser(newUser.username, newUser.email, newUser.password);
        }

        const hashedCode: string = await bcrypt.hash(code, BCRYPT_SALT_ROUNDS);
        await redisClient.set(newUser.email, hashedCode);
        await redisClient.expire(newUser.email, VERIFICATION_EXPIRE_SEC);

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

    const code: string = generateVerificationCode();
    transporter.messages.create(EMAIL, createVerificationMail(email, code))
    .then(async (msg: MessagesSendResult) => {
        const hashedCode: string = await bcrypt.hash(code, BCRYPT_SALT_ROUNDS);
        await UserModel.updateOne(
            { email: email }, 
            { 
                $set: { createdAt: Date.now() },
            }
        );
        await redisClient.set(email, hashedCode);
        await redisClient.expire(email, VERIFICATION_EXPIRE_SEC);

        res.status(200).send({ message: 'Verification email sent'});
        console.log(msg);
    })
    .catch((err: Error) => {
        console.error(err);
        return next(new Error(ErrorType.ErrorSendingEmail));
    })
});

const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const code: string = req.body.token as string;
    const email: string = req.body.email;

    const checkForUser: IUser = await UserModel.findOne({ email });
    if (!checkForUser) {
        return next(new Error(ErrorType.UserDoesNotExist));
    }
    if (checkForUser.verified) {
        return next(new Error(ErrorType.EmailVerified));
    }

    const hashedCode: string = (await redisClient.get(email)) ?? "null";
    const tokensMatch: boolean = await bcrypt.compare(code, hashedCode);
    if (!tokensMatch) {
        return next(new Error(ErrorType.VerificationFailed));
    }

    await UserModel.updateOne(
        { email: email }, 
        { 
            $set: { verified: true },
            $unset: { createdAt: '' },
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

    if (!checkForUser.verified) {
        return next(new Error(ErrorType.EmailNotVerified));
    }

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
    await redisClient.set(token, 'true');
    await redisClient.expire(token, USED_JWT_TOKEN_EXPIRE_SEC);
    
    res.status(200).json("Logged out successfully");
});

export {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    logoutUser,
};