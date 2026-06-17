import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  buyer: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: ObjectId,
    ref: 'Car',
    required: true,
  },
  lastMessage: {
    type: String,
    default: '',
  },
  lastMessageTime: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
