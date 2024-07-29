import { IUser } from '../models/user.model';

const UserModel = require('../models/user.model');


async function saveUser(username: string, email: string, password: string) {
    const myData: IUser = new UserModel({
        username: username,
        email: email,
        password: password,
        verified: false,
    });
    await myData.save();
}

export {
    saveUser,
}