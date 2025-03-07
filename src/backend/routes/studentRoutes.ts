import express, { Request, Response } from 'express';
import { authenticateStudent, getSubjectsOrTopics, getLessons, getKItems, getAllStudents, getStudentById } from '../controllers/studentController';
import { auth } from '../middlewares/authMiddleware';

// Add error handler
const handleError = (error: any, res: Response) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
};

const router = express.Router();

// Auth route
router.post('/auth', authenticateStudent);

// Subject/Topic routes - should be GET
router.get('/subjects', auth, async (req: Request, res: Response) => {
  try {
    console.log('Full URL:', req.originalUrl);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Query params:', req.query);
    
    await getSubjectsOrTopics(req, res);
  } catch (error) {
    console.error('Error in /subjects:', error);
    handleError(error, res);
  }
});

// Lesson routes
router.get('/lessons', auth, getLessons);

// KItem routes
router.get('/kitems', auth, getKItems);

// GET /api/students
router.get('/', auth, getAllStudents);

// GET /api/students/:id
router.get('/:id', auth, getStudentById);

export default router; 