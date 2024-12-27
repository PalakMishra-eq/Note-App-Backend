"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyOtp = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tempUserModel_1 = __importDefault(require("../models/tempUserModel")); // Temporary user storage (can be in-memory or MongoDB)
const userModel_1 = __importDefault(require("../models/userModel"));
const mailer_1 = require("../utils/mailer");
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a salt
        const salt = yield bcrypt_1.default.genSalt(10); // 10 is the default number of rounds
        // Hash the password using the generated salt
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.error('Error hashing the password:', error);
        throw new Error('Failed to hash password');
    }
});
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            console.log(existingUser);
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Generate a session token for temporary storage
        const sessionToken = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });
        // Store user details temporarily (temporary database or cache)
        const tempUser = new tempUserModel_1.default({
            username,
            email,
            password, // Store hashed password for security
            otp,
            sessionToken,
            otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
        });
        yield tempUser.save();
        console.log("Temporary user saved:", tempUser);
        // Send OTP to user's email
        const subject = 'Verify your Email for Note App';
        const htmlContent = `<p>Your OTP is: <strong>${otp}</strong></p>`;
        yield (0, mailer_1.sendMail)(email, subject, htmlContent);
        res.status(201).json({ message: 'OTP sent to email. Please verify to complete registration', sessionToken });
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Error during signup' });
    }
});
exports.signUp = signUp;
// export const verifyOtp = async (req: any, res: any) => {
//   const { otp } = req.body; // No need to send the email anymore
//   const token = req.headers.authorization;
//   try {
//     // Ensure the token is provided
//     if (!token ) {
//       return res.status(401).json({ error: 'Authorization token is missing or invalid' });
//     }
//     // Extract the token from the authorization header
//     //const token = authHeader.split(" ")[1];
//     // Verify and decode the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string };
//     if (!decoded || !decoded.email) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }
//     // Find the temporary user by email from the decoded token
//     const tempUser = await tempusers.findOne({ email: decoded.email });
//     console.log("Inside verify OTP, user found:", tempUser);
//     if (!tempUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     // Check if OTP matches and is still valid
//     if (tempUser.otp !== otp || Date.now() > tempUser.otpExpiry.getTime()) {
//       return res.status(400).json({ error: 'Invalid or expired OTP' });
//     }
//     // Delete the temp user and optionally move them to the permanent collection
//     await tempUser.deleteOne();
//     res.status(200).json({ message: 'OTP verified successfully' });
//   } catch (error) {
//     console.error('Error during OTP verification:', error);
//     res.status(500).json({ error: 'Error during OTP verification' });
//   }
// };
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body; // No need to send the email anymore
    const token = req.headers.authorization;
    try {
        // Ensure the token is provided
        if (!token) {
            return res.status(401).json({ error: 'Authorization token is missing or invalid' });
        }
        // Verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        if (!decoded || !decoded.email) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Find the temporary user by email from the decoded token
        const tempUser = yield tempUserModel_1.default.findOne({ email: decoded.email });
        console.log("Inside verify OTP, user found:", tempUser);
        if (!tempUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if OTP matches and is still valid
        if (tempUser.otp !== otp || Date.now() > tempUser.otpExpiry.getTime()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        const hashedPassword = yield hashPassword(tempUser.password);
        // Save the user in the permanent collection (users model)
        const newUser = new userModel_1.default({
            username: tempUser.username,
            email: tempUser.email,
            password: hashedPassword, // Ensure password is hashed
            // Add any additional fields if required
        });
        yield newUser.save();
        console.log("User saved to the users model:", newUser);
        // Delete the temp user
        yield tempUser.deleteOne();
        console.log("Temp user deleted");
        res.status(200).json({ message: 'OTP verified successfully, user registered' });
    }
    catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ error: 'Error during OTP verification' });
    }
});
exports.verifyOtp = verifyOtp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Compare passwords
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error during login' });
    }
});
exports.login = login;
