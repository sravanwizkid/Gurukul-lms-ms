import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { studentRoutes } from './routes/student.routes';
import { errorHandler } from './middleware/error.middleware';
import { dbConfig } from './config/db.config';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get('/_health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/students', studentRoutes);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Database connection established');
});

export default server;

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
}); 