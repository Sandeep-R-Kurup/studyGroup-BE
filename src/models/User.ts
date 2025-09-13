import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: Date;
}

const UserSchema: Schema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
