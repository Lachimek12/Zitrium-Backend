import mongoose, { Model, Schema, Document } from "mongoose";


export interface IUser extends Document {
    username: String;
    email: String;
    password: String;
    verified: boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    verified: { type: Boolean, required: true},
});

const User: Model<IUser> = mongoose.model("User", UserSchema);

User.createIndexes()
  .then(() => console.log('Indexes created'))
  .catch(err => console.error('Error creating indexes', err));

module.exports = User;