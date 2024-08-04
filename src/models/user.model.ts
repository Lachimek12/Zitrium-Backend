import mongoose, { Model, Schema, Document } from "mongoose";
import { VERIFICATION_EXPIRE } from "@utils/constants";


export interface IUser extends Document {
    username: String;
    email: String;
    password: String;
    verified: boolean;
    verificationCode: String;
    createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    verified: { type: Boolean, required: true},
    verificationCode: { type: String },
    createdAt: { type: Date, index: { expires: VERIFICATION_EXPIRE } },
});

const User: Model<IUser> = mongoose.model("User", UserSchema);

User.createIndexes()
  .then(() => console.log('Indexes created'))
  .catch(err => console.error('Error creating indexes', err));

module.exports = User;