import { IUser } from '@models/user.model';
import { BCRYPT_SALT_ROUNDS } from './constants';
import bcrypt from 'bcrypt';

const UserModel = require('@models/user.model');


async function saveUser(username: string, email: string, password: string) {
    const hashedPass: string = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const myData: IUser = new UserModel({
        username: username,
        email: email,
        password: hashedPass,
        verified: false,
        createdAt: Date.now(),
    });
    await myData.save();
}

export {
    saveUser,
}