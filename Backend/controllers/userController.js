import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from '../models/Car.js';

// Add car to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { carId } = req.body;
        if (!carId) return res.json({ success: false, message: 'Car ID is required' });
        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });
            // Fix: compare ObjectId as string
            if (user.wishlist.some(id => id.toString() === carId)) {
            return res.json({ success: false, message: 'Car already in wishlist' });
        }
        user.wishlist.push(carId);
        await user.save();
        res.json({ success: true, wishlist: user.wishlist });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// Remove car from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { carId } = req.body;
        if (!carId) return res.json({ success: false, message: 'Car ID is required' });
        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });
        user.wishlist = user.wishlist.filter(id => id.toString() !== carId);
        await user.save();
        res.json({ success: true, wishlist: user.wishlist });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};


const generateToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
//Register User
export const registerUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;
        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all required fields and ensure password is at least 8 characters long'});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return  res.json({success: false, message: 'User email already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword, role: role || 'user'});
        const token = generateToken(user._id.toString());
        res.json({success: true, token, user});
    }
    catch(err){
        console.log("Error in user registration", err.message);
        res.json({success: false, message: err.message});
    }
}

//User Login
export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({success: false, message: 'Invalid email or password'});
        }
        const token = generateToken(user._id.toString());
        res.json({success: true, token, user});
    }
    catch(err){
        console.log("Error in user login", err.message);
        res.json({success: false, message: err.message});
    }
}

//Get user data using token (JWT)
export const getUserData = async (req, res) => {
    
    try{
        const {user} = req;
        // console.log("User data fetched successfully", user);
        res.json({success: true, user});
    }
    catch(err){
        console.log("Error in user registration", err.message);
        res.json({success: false, message: err.message});
    }
}

//Get user wishlist cars
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            populate: { path: 'owner', select: 'name' }
        });
        if (!user) return res.json({ success: false, message: 'User not found' });
        res.json({ success: true, wishlist: user.wishlist || [] });
    } catch (err) {
        console.log('Error fetching wishlist', err.message);
        res.json({ success: false, message: err.message });
    }
};

//Get all cars for the frontend
export const getCars = async (req, res) => {
    try{
        // Populate owner with only the name field
        const cars = await Car.find({isAvailable : true}).populate('owner', 'name');
        res.json({success: true, cars})
    }
    catch(err){
        console.log("Error in user registration", err.message);
        res.json({success: false, message: err.message});
    }
}