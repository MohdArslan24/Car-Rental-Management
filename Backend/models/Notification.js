import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  senderId: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  chatId: {
    type: ObjectId,
    ref: 'Chat',
    required: true,
  },
  messageId: {
    type: ObjectId,
    ref: 'Message',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
