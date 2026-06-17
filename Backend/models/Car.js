import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;
const carSchema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    vehicleNumber: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    dailyRate: {
        type: Number,
        required: true,
    },
    transmission: {
        type: String,
        required: true,
    },
    fuelType: {
        type: String,
        required: true,
    },
    seating: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5,
    },
    available: {
        type: Boolean,
        default: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
},{timestamps: true});

const Car = mongoose.model('Car', carSchema);
export default Car;