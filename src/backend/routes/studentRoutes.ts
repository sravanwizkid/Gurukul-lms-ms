import express from 'express';
import { 
  authenticateStudent, 
  getSubjectsOrTopics, 
  getLessons, 
  getKItems, 
  getAllStudents, 
  getStudentById 
} from '../controllers/studentController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

console.log('Setting up student routes');

// Add at the start
router.get('/', (req, res) => {
  res.json({ message: 'Student routes working' });
});

// Test route with logging
router.get('/test', (req, res) => {
  res.send('test ok');
});

// Global route logging
router.use((req, res, next) => {
  console.log('Route attempted:', {
    method: req.method,
    path: req.path,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
  next();
});

// Basic test routes
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

router.post('/echo', (req, res) => {
  res.json({ 
    received: req.body,
    headers: req.headers
  });
});

// Add before other routes
router.post('/auth-test', (req, res) => {
  console.log('Auth test hit:', {
    body: req.body,
    headers: req.headers['content-type']
  });
  res.json({ 
    message: 'Auth route reachable',
    receivedBody: req.body
  });
});

// Auth route
router.post('/auth', (req, res, next) => {
  console.log('Auth route hit:', req.body);
  next();
}, authenticateStudent);

// Data routes
router.get('/subjects', auth, getSubjectsOrTopics);
router.get('/topics', auth, getSubjectsOrTopics);
router.get('/lessons', auth, getLessons);
router.get('/kitems', auth, getKItems);

// Student routes
router.get('/', auth, getAllStudents);
router.get('/:id', auth, getStudentById);

// Simplest possible route
router.get('/simple', (_, res) => res.send('ok'));

console.log('Student routes setup complete');

export default router; 