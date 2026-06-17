import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// Create Razorpay Order
export const createOrder = async (req, res) => {
    try {
        const { amount, car, pickupDate, returnDate } = req.body;
        const userId = req.user._id;

        // Get car details
        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({ success: false, message: 'Car not found' });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `booking_${userId}_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.json({ success: false, message: 'Failed to create order' });
        }

        // Store order details temporarily (you can use Redis or session in production)
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
        });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
};

// Verify Payment and Create Booking
export const verifyPayment = async (req, res) => {
    try {
        const { 
            orderId, 
            paymentId, 
            signature, 
            car, 
            pickupDate, 
            pickupTime,
            returnDate, 
            returnTime,
            pickupLocation,
            returnLocation,
            driverLicense,
            phoneNumber,
            insurance,
            specialRequests,
            price 
        } = req.body;
        const userId = req.user._id;

        // Verify signature
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.json({ success: false, message: 'Payment verification failed' });
        }

        // Get car details for owner info
        const carData = await Car.findById(car);
        if (!carData) {
            return res.json({ success: false, message: 'Car not found' });
        }

        // Create booking with all details
        const booking = await Booking.create({
            car,
            user: userId,
            owner: carData.owner,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            pickupLocation,
            returnLocation,
            driverLicense,
            phoneNumber,
            insurance: insurance || 'basic',
            specialRequests: specialRequests || '',
            status: 'confirmed', // Payment successful, so booking is confirmed
            totalPrice: price,
            price,
            paymentId,
            termsAccepted: true,
        });

        res.json({
            success: true,
            message: 'Payment verified and booking created successfully',
            bookingId: booking._id,
        });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
};
