import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
    chat: {
        type: ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
