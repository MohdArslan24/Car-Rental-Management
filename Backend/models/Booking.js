import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
    car: {
        type: ObjectId,
        ref: 'Car',
        required: true,
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    pickupDate: {
        type: Date,
        required: true,
    },
    pickupTime: {
        type: String,
        required: true,
        default: '10:00',
    },
    returnDate: {
        type: Date,
        required: true,
    },
    returnTime: {
        type: String,
        required: true,
        default: '10:00',
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    returnLocation: {
        type: String,
        required: true,
    },
    driverLicense: {
        licenseNumber: {
            type: String,
            required: true,
        },
        licenseExpiry: {
            type: Date,
            required: true,
        },
        driverDOB: {
            type: Date,
            required: true,
        },
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    insurance: {
        type: String,
        enum: ['basic', 'standard', 'premium'],
        default: 'basic',
    },
    addOns: [{
        name: String,
        price: Number,
    }],
    specialRequests: {
        type: String,
        default: '',
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    termsAccepted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    paymentId: {
        type: String,
        default: null,
    }
},{timestamps: true});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;