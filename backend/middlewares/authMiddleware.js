// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { PrivyClient } from '@privy-io/server-auth';


//Commenting out the previous auth and using auth to verify privy token(verifyPrivyToken)
// export const authenticateToken = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(401).json({ message: "Not authorized, token failed" });
//         }
//     }
//     if (!token) {
    //         res.status(401).json({ message: "Not authorized, no token" });
    //     }
    // };
    
    
    
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
);

export const verifyPrivyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const verified = await privy.verifyAuthToken(token);
    
    req.user = {
      privyId: verified.userId,
      email: verified.email
    };
    
    next();
  } catch (error) {
    console.error('Auth failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};