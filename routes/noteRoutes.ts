import express from 'express';
import { createNote, getAllNotes, getNotes } from '../controllers/noteController';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', auth, createNote); // Middleware and handler
router.get('/', auth, getNotes);
router.get('/all', auth, getAllNotes);
//router.get('/:id', auth, getNoteDetails );

export default router;
