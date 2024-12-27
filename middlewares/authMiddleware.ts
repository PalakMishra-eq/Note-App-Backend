// import { NextFunction, Request, Response } from 'express';

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

import jwt from 'jsonwebtoken';

export const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization; // Token from the 'Authorization' header
  if (!token) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret'); // Verify the token
    req.user = decoded; // Attach decoded user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};
