"use strict";
// import { NextFunction, Request, Response } from 'express';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// export const auth = (req: Request, res: Response, next: NextFunction): void => {
//     try {
//         const token = req.headers.authorization;
//         if (!token) {
//             res.status(401).json({ message: 'Authorization token is missing' });
//             return; // Explicitly return to prevent further execution
//         }
//         // Validate token logic (replace this with actual validation)
//         const isValidToken = token === 'valid-token'; // Example logic
//         if (!isValidToken) {
//             res.status(403).json({ message: 'Unauthorized access' });
//             return; // Explicitly return to prevent further execution
//         }
//         next(); // Pass control to the next middleware or route handler
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const token = req.headers.authorization; // Token from the 'Authorization' header
    if (!token) {
        return res.status(401).json({ message: 'Missing auth token' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret'); // Verify the token
        req.user = decoded; // Attach decoded user information to the request
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Unauthorized access' });
    }
};
exports.auth = auth;
