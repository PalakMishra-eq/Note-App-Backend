import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  otp: string | null;
  otpExpiry: number | null;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiry: { type: Number, default: null }
});

const User = mongoose.model<IUser>('users', userSchema);
export default User;
