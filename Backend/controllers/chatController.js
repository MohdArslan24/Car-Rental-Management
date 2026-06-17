import Chat from '../models/Chat.js';
import Car from '../models/Car.js';

// Create or get chat for a specific car between buyer and seller
export const createOrGetChat = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({ success: false, message: 'carId is required' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const sellerId = car.owner;
    if (sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({ success: false, message: 'Owner cannot chat with themselves' });
    }

    let chat = await Chat.findOne({
      car: carId,
      buyer: buyerId,
      seller: sellerId,
    })
      .populate('buyer', '-password')
      .populate('seller', '-password')
      .populate('car');

    if (!chat) {
      chat = await Chat.create({
        participants: [buyerId, sellerId],
        buyer: buyerId,
        seller: sellerId,
        car: carId,
      });
      chat = await Chat.findById(chat._id)
        .populate('buyer', '-password')
        .populate('seller', '-password')
        .populate('car');
    }

    res.json({ success: true, chat });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/chat/:userId
export const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const authId = req.user._id;

    if (authId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const chats = await Chat.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate('buyer', '-password')
      .populate('seller', '-password')
      .populate('car')
      .sort({ lastMessageTime: -1, updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
