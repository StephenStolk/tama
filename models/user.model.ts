// models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  bio: string;
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, minlength: 3 },
  bio: { type: String, required: true, minlength: 10 },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
