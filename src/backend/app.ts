import express, { Application, Request, Response } from 'express';
import cors from 'cors';

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
  res.status(200).json({ status: 'healthy' });
});

export default app; 