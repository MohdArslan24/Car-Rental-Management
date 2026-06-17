import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    sendMessage,
    getChatMessages,
    markMessagesAsRead,
    getUnreadCount,
    deleteMessage,
} from '../controllers/messageController.js';
import { getUserChats } from '../controllers/chatController.js';

const router = express.Router();

// Send a message
router.post('/send', protect, sendMessage);

// Get all chats for a user
router.get('/conversations', protect, getUserChats);

// Get messages in a chat
router.get('/:chatId', protect, getChatMessages);

// Mark messages as read
router.post('/mark-read', protect, markMessagesAsRead);

// Get unread message count
router.get('/unread-count', protect, getUnreadCount);

// Delete a message
router.delete('/:messageId', protect, deleteMessage);

export default router;
