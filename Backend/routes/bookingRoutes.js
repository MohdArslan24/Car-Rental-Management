import express from 'express';
import protect from '../middleware/auth.js';
import { isCarAvailable, bookCar, getUserBookings, getOwnerBookings, changeBookindStatus} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', isCarAvailable)
bookingRouter.post('/book-car', protect, bookCar)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, changeBookindStatus)

export default bookingRouter;