import Notification from '../models/Notification.js';

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .populate('senderId', 'name image email')
      .populate('chatId', '_id')
      .sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
