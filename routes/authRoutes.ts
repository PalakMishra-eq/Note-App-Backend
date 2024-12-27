import express from 'express';
import { login, signUp, verifyOtp } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

export default router;
