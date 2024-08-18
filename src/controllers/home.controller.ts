import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '@middlewares/asyncHandler';
import { saveUser } from '@utils/user';
import { IUser } from "@models/user.model";
import { ErrorType } from "@/types/enums";

const UserModel = require('../models/user.model');


const sendFirstUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Find the user by ID
    const user: IUser = await UserModel.findOne();

    if (!user) {
        return next(new Error(ErrorType.UserDoesNotExist));
    }

    // Respond with the user data
    res.status(200).json({name: user.username, email: user.email});
});

const receiveUserData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
  
    console.log(userData.name);
    console.log(userData.email);

    await saveUser(userData.name, userData.email, 'xd');

    // Respond with a success message
    res.status(201).send('User data saved successfully');
});

export {
    sendFirstUser,
    receiveUserData,
};