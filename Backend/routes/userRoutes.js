import express from 'express';
import { registerUser, loginUser, getCars, addToWishlist, removeFromWishlist, getWishlist } from '../controllers/userController.js';

import protect from '../middleware/auth.js';
import { getUserData } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.get('/wishlist', protect, getWishlist)
userRouter.post('/wishlist/add', protect, addToWishlist);
userRouter.post('/wishlist/remove', protect, removeFromWishlist);

export default userRouter;