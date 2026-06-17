import express from 'express';
import { protect } from '../middleware/auth.js';
import { createOrGetChat, getUserChats } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', protect, createOrGetChat);
router.get('/:userId', protect, getUserChats);

export default router;
