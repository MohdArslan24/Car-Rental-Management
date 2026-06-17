import express from 'express';
import { protect, verifyOwner } from '../middleware/auth.js';
import { addcar, changeRoleToOwner, getOwnerCars, toggleCarAvailability, deleteCar, getOwnerDashboardData } from '../controllers/ownerController.js';
import upload from '../middleware/multer.js';

const ownerRouter = express.Router();

ownerRouter.post('/change-role', protect, changeRoleToOwner)
ownerRouter.post('/add-car', verifyOwner, upload.single('image'), addcar)
ownerRouter.get('/manage-cars', verifyOwner, getOwnerCars)
ownerRouter.post('/toggle-car-availability', verifyOwner, toggleCarAvailability)
ownerRouter.post('/delete-car', verifyOwner, deleteCar)
ownerRouter.get('/dashboard', verifyOwner, getOwnerDashboardData)

export default ownerRouter;