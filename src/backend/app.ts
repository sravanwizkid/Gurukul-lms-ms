import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';
import { errorHandler } from './middlewares/errorHandler';
import helmet from 'helmet';

const app: Application = express();
console.log('Creating Express app');

// Trust proxy settings for Cloud Run
app.enable('trust proxy');  // Enable proxy trust
app.set('trust proxy', 1);  // Trust first proxy

// Basic middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false
}));

// Root route
app.get('/', (req: Request, res: Response) => {
  console.log('Root route accessed');
  res.json({ message: 'Hello from simplified app!' });
});

// Health check
app.get('/_health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Studentmate API layer is healthy' });
});

// Mount routes
app.use('/api/students', studentRoutes);

// Error handler
app.use(errorHandler);

export default app; 