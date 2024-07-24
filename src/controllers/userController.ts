import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '../middlewares/asyncHandler';
import { IUser } from '../models/user.model';
const UserModel = require('../models/user.model');

async function saveUser(firstName: String, lastNameName: string) {
    const myData: IUser = new UserModel({
        firstName: firstName,
        lastNameName: lastNameName,
    });
    await myData.save();
}

const sendFirstUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Find the user by ID
    const user = await UserModel.findOne();

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Respond with the user data
    res.status(200).json({name: user.firstName, email: user.lastNameName});
});

const receiveUserData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
  
    console.log(userData.name);
    console.log(userData.email);

    await saveUser(userData.name, userData.email);

    // Respond with a success message
    res.status(201).send('User data saved successfully');
});

export {
    sendFirstUser,
    receiveUserData,
};