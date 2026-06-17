import express from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markNotificationRead);

export default router;
