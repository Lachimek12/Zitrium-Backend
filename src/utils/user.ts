import { IUser } from '@models/user.model';
import { BCRYPT_SALT_ROUNDS } from './constants';

const UserModel = require('@models/user.model');
const bcrypt = require('bcrypt');


async function saveUser(username: string, email: string, password: string, verificationCode: string) {
    const hashedPass = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const hashedToken = await bcrypt.hash(verificationCode, BCRYPT_SALT_ROUNDS);

    const myData: IUser = new UserModel({
        username: username,
        email: email,
        password: hashedPass,
        verified: false,
        verificationCode: hashedToken,
        createdAt: Date.now(),
    });
    await myData.save();
}

export {
    saveUser,
}