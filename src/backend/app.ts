import express, { Application } from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Basic middleware only
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/students', studentRoutes);

// Error handling
app.use(errorHandler);

// Add Cloud Run port handling
const port = process.env.PORT || 3000;

export default app; 