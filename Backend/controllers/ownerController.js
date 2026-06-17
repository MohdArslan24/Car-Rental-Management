import { response } from "express";
import User from "../models/User.js";
import Car from "../models/Car.js";
import fs from "fs";
import { getImageKit } from "../configs/imagekit.js";

import Booking from "../models/Booking.js";


//API to change user role to owner
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Role updated to owner" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

//API to List cars

export const addcar = async (req, res) => {
  try {
    
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;
    const fileBuffer = fs.readFileSync(imageFile.path);
    
    //Upload the image to ImageKit

    const uploadResponse = await getImageKit().upload({
      file: fileBuffer, // Use the file buffer
      fileName: imageFile.originalname,
      folder: "/cars",
    });
    console.log(car)
    console.log(req.body.carData)

    // URL with basic transformations
    const optimizedImageURL = getImageKit().url({
      path: uploadResponse.filePath,
      transformation: [
        {
          width: "1280",
          crop: "maintain_ratio",
          quality: "auto",
          format: "webp",
        },
      ],
    });
    console.log(optimizedImageURL)
    const image = optimizedImageURL;
    await Car.create({ ...car, owner: _id, image: image });
    console.log({ success: true, message: "Car added successfully" })
    res.json({ success: true, message: "Car added successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};


//API to get all cars listed by owner

export const getOwnerCars = async (req, res) => {
    try{
        const {_id} = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success: true, cars});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to Toggle car availability status

export const toggleCarAvailability = async (req, res) => {
    try{
      
        const {_id} = req.user
        const {carId} = req.body
       
        const car = await Car.findByIdAndUpdate(
            carId,
            { isAvailable: { $eq: false } ? true : false },
            { new: true }
        );
        
        if(!car) {
            return res.json({success: false, message: 'Car not found'});
        }
        
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'Unauthorized action'});
        }
        
        res.json({success: true, message: 'Car availability status updated successfully', car});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to Delete a car

export const deleteCar = async (req, res) => {
    try{
        const {_id} = req.user
        const {carId} = req.body
        const car = await Car.findById(carId);
        
        if(!car) {
            return res.json({success: false, message: 'Car not found'});
        }
        
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'Unauthorized action'});
        }
        
        await Car.findByIdAndDelete(carId);
        res.json({success: true, message: 'Car deleted successfully'});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to get dashboard data for owner
export const getOwnerDashboardData = async (req, res) => {
    try {
        const { _id } = req.user;
        
        // Get all cars of this owner
        const cars = await Car.find({ owner: _id });
        const totalCars = cars.length;
        
        // Get all bookings for this owner's cars
        const bookings = await Booking.find({ 
            car: { $in: cars.map(car => car._id) } 
        }).populate('car').sort({ createdAt: -1 });
        
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const recentBookings = bookings.slice(0, 5);
        
        // Calculate monthly revenue
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyBookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
        });
        
        const monthlyRevenue = monthlyBookings.reduce((sum, booking) => {
            return sum + (booking.totalPrice || booking.price || 0);
        }, 0);
        
        const dashboardData = {
            totalCars,
            totalBookings,
            pendingBookings,
            completedBookings,
            recentBookings,
            monthlyRevenue
        };
        
        res.json({ success: true, dashboardData });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to update user image

export const updateUserImage = async(req, res) => {
  try{
    const {_id} = req.user
    const imageFile = req.file;
    const fileBuffer = fs.readFileSync(imageFile.path);
    
    //Upload the image to ImageKit

    const uploadResponse = await getImageKit().upload({
      file: fileBuffer, // Use the file buffer
      fileName: imageFile.originalname,
      folder: "/users",
    });
    

    // URL with basic transformations
    const optimizedImageURL = getImageKit().url({
      path: uploadResponse.filePath,
      transformation: [
        {
          width: "400",
          crop: "maintain_ratio",
          quality: "auto",
          format: "webp",
        },
      ],
    });
    console.log(optimizedImageURL)
    const image = optimizedImageURL;

    await User.findByIdAndUpdate(_id, {image})
    res.json({succes: true, message: "Image Updated"})
  }
  catch(err){
    console.log(err.message);
        res.json({ success: false, message: err.message });
  }
}