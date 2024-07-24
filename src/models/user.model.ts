import mongoose, { Model, Schema, Document } from "mongoose";

export interface IUser extends Document {
    firstName: String;
    lastNameName: String;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastNameName: { type: String, required: true},
});

const User: Model<IUser> = mongoose.model("User", UserSchema);

User.createIndexes()
  .then(() => console.log('Indexes created'))
  .catch(err => console.error('Error creating indexes', err));

module.exports = User;