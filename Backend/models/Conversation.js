import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema({
    inquiry: {
        type: ObjectId,
        ref: 'Inquiry',
        required: true,
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    renter: {
        type: ObjectId,
        ref: 'User',
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
},{timestamps: true});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
