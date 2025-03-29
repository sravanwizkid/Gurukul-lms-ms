import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

// Mock authentication endpoint
app.post('/api/students/auth', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    token: 'mock-token-12345',
    studentId: 2
  });
});

// Mock subjects endpoint
app.get('/api/students/subjects', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    { subjectId: 1, subjectName: 'Mathematics' }
  ]);
});

// Mock topics endpoint
app.get('/api/students/topics', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    { topicId: 1, topicName: 'Algebra' }
  ]);
});

// Mock lessons endpoint
app.get('/api/students/lessons', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    { lessonId: 101, lessonName: 'Introduction to Algebra', progress: 0 }
  ]);
});

// Mock kitems endpoint
app.get('/api/students/kitems', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json([
    { 
      kitemId: 1,
      kitemName: 'Basic Algebra Concepts',
      kitemType: 'PDF',
      progress: 0
    }
  ]);
});

// Health check endpoint
app.get('/_health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

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