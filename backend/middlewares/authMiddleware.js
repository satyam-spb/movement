// backend/middlewares/authMiddleware.js
import User from '../models/user.js';
import { PrivyClient } from '@privy-io/server-auth';

// Debug Privy configuration - adding more detail to help diagnose
console.log('Privy Configuration in authMiddleware:');
console.log('PRIVY_APP_ID:', process.env.PRIVY_APP_ID);
console.log('PRIVY_APP_SECRET length:', process.env.PRIVY_APP_SECRET ? process.env.PRIVY_APP_SECRET.length : 0);

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
    
    try {
      const verified = await privy.verifyAuthToken(token);
      
      req.user = {
        privyId: verified.userId,
        email: verified.email
      };
      
      next();
    } catch (error) {
      console.error('Privy verification error:', error);
      
      // Temporary workaround for development if needed
      if (process.env.NODE_ENV === 'development' || process.env.VITE_ENVIRONMENT === 'development') {
        console.log('Development mode: bypassing Privy authentication');
        req.user = {
          privyId: 'dev-user-id',
          email: 'dev@example.com'
        };
        return next();
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Auth failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server error' : err.message;
  
  res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
      validation: err.errors,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
};