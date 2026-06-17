import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import Notification from '../models/Notification.js';

// API to send a message via chat
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { chatId, text } = req.body;

    if (!chatId || !text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'chatId and text are required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.participants.map(id => id.toString()).includes(senderId.toString())) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this chat' });
    }

    const newMessage = await Message.create({
      chat: chatId,
      sender: senderId,
      text: text.trim(),
      seen: false,
    });

    chat.lastMessage = text.trim();
    chat.lastMessageTime = new Date();
    await chat.save();

    const populated = await newMessage.populate('sender', 'name image email');

    // Notification and real-time push
    const io = global.io;
    const receiverId = chat.participants.find(id => id.toString() !== senderId.toString());

    // Avoid notifications if receiver in same chat room (already live message context)
    const receiverSocketId = receiverId ? global.onlineUsers.get(receiverId.toString()) : null;
    let receiverInChat = false;

    if (receiverSocketId) {
      const socketsInChat = await io.in(chatId).allSockets();
      receiverInChat = socketsInChat.has(receiverSocketId);
    }

    if (receiverId && !receiverInChat) {
      const notification = await Notification.create({
        userId: receiverId,
        senderId,
        chatId,
        messageId: newMessage._id,
        text: text.trim(),
        isRead: false,
      });

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newNotification', {
          _id: notification._id,
          userId: notification.userId,
          senderId: notification.senderId,
          chatId: notification.chatId,
          messageId: notification.messageId,
          text: notification.text,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        });
      }
    }

    res.json({ success: true, message: 'Message sent', data: populated });

    // Attach chat ID for client-side filtering
    const messagePayload = {
      ...populated.toObject(),
      chat: chatId,
    };

    // Emit to socket for real-time message updates
    io.to(chatId).emit('newMessage', messagePayload);
    if (receiverId && receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', messagePayload);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to get messages for a chat
export const getChatMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (!chat.participants.map(id => id.toString()).includes(userId.toString())) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this chat' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name image email')
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// mark chat messages as seen
export const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    if (!chat.participants.map(id => id.toString()).includes(userId.toString())) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this chat' });
    }

    await Message.updateMany({ chat: chatId, sender: { $ne: userId }, seen: false }, { seen: true });

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// get unread count for user across chats
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: userId });
    const chatIds = chats.map((c) => c._id);

    const unreadCount = await Message.countDocuments({ chat: { $in: chatIds }, sender: { $ne: userId }, seen: false });

    res.json({ success: true, unreadCount });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete message (soft)
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete your own messages' });
    }

    message.text = '[Message deleted]';
    await message.save();

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

