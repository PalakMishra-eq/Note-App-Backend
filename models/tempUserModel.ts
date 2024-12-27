import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  sessionToken: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

export default mongoose.model('tempusers', tempUserSchema);
