import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder auth middleware - we'll implement proper JWT verification later
  next();
}; 