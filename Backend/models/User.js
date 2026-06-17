import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
        }],
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '',
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    verificationOTP: {
        type: String,
        default: null,
    },
    idVerified: {
        type: Boolean,
        default: false,
    },
    idDocumentUrl: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['owner', 'user'],
        default: 'user',
    },
    image: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5,
    },
    reviews: [{
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;