import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../middleware/errorHandler';

// Extend Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        studentId: number;
        studentClass: number;
        studentLevel: string;
        gurukulType: string;
      }
    }
  }
}

interface JWTPayload {
  studentId: number;
  studentClass: number;
  studentLevel: string;
  gurukulType: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// TODO: Implement proper authentication
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    
    // TODO: Replace with proper user lookup
    const user = { username, password: 'test' }; // Temporary user object
    
    if (!user || password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}; 