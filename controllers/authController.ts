import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import tempusers from '../models/tempUserModel'; // Temporary user storage (can be in-memory or MongoDB)
import users from '../models/userModel';
import { sendMail } from '../utils/mailer';


const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10); // 10 is the default number of rounds
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing the password:', error);
    throw new Error('Failed to hash password');
  }
};


export const signUp = async (req: any, res: any) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.log(existingUser);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate a session token for temporary storage
    const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });

    // Store user details temporarily (temporary database or cache)
    const tempUser = new tempusers({
      username,
      email,
      password, // Store hashed password for security
      otp,
      sessionToken,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    });
    await tempUser.save();

    console.log("Temporary user saved:", tempUser);

    // Send OTP to user's email
    const subject = 'Verify your Email for Note App';
    const htmlContent = `<p>Your OTP is: <strong>${otp}</strong></p>`;
    await sendMail(email, subject, htmlContent);

    res.status(201).json({ message: 'OTP sent to email. Please verify to complete registration', sessionToken });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Error during signup' });
  }
};



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


export const verifyOtp = async (req: any, res: any) => {
  const { otp } = req.body; // No need to send the email anymore
  const token = req.headers.authorization;

  try {
    // Ensure the token is provided
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing or invalid' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string };

    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Find the temporary user by email from the decoded token
    const tempUser = await tempusers.findOne({ email: decoded.email });
    console.log("Inside verify OTP, user found:", tempUser);

    if (!tempUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP matches and is still valid
    if (tempUser.otp !== otp || Date.now() > tempUser.otpExpiry.getTime()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await hashPassword(tempUser.password);

    // Save the user in the permanent collection (users model)
    const newUser = new users({
      username: tempUser.username,
      email: tempUser.email,
      password: hashedPassword, // Ensure password is hashed
      // Add any additional fields if required
    });

    await newUser.save();
    console.log("User saved to the users model:", newUser);

    // Delete the temp user
    await tempUser.deleteOne();
    console.log("Temp user deleted");

    res.status(200).json({ message: 'OTP verified successfully, user registered' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ error: 'Error during OTP verification' });
  }
};


export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Error during login' });
  }
};
