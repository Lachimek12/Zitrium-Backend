import mongoose, { Model, Schema, Document, mongo } from "mongoose";
import { TIME_TO_DELETE_NOT_VERIFIED_USER_SEC } from "@utils/constants";

require('@config/mongo');


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verified: boolean;
    createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    verified: { type: Boolean, required: true},
    createdAt: { type: Date, index: { expires: TIME_TO_DELETE_NOT_VERIFIED_USER_SEC } },
});

const User: Model<IUser> = mongoose.model("User", UserSchema);

// Drop index to apply new expire time. Mongodb does not allow updating indexes
(async () => {
  try {
    const indexes: mongoose.mongo.IndexDescriptionInfo[] = await User.collection.indexes();
    const createdAtIndex: mongoose.mongo.IndexDescriptionInfo = indexes.find(index => index.name === 'createdAt_1');

    if (createdAtIndex && createdAtIndex.expireAfterSeconds !== TIME_TO_DELETE_NOT_VERIFIED_USER_SEC) {
      await User.collection.dropIndex('createdAt_1');
      console.log('TTL dropped');
    }
  } catch (err) {
    console.error('Error dropping TTL', err);
  }
})();

User.createIndexes()
  .then(() => console.log('Indexes created'))
  .catch(err => console.error('Error creating indexes', err));

module.exports = User;