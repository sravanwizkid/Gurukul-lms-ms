import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Root route with minimal code
app.get('/', (req: Request, res: Response) => {
  console.log('Root route accessed');
  res.json({ message: 'Hello from simplified app!' });
});

// Health check
app.get('/_health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Studentmate API layer is healthy' });
});

// Add debug logging for route mounting
console.log('Mounting routes...');
app.use('/api/students', studentRoutes);  // Changed from '/api' to '/api/students'
console.log('Routes mounted successfully');

// Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Add error handler last
app.use(errorHandler);

export default app; 