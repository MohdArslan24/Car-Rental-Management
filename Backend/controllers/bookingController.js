import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

//Function to check availability of car for a given date range

const checkCarAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },

    })

    return bookings.length === 0;
}

//API to check car availability

export const isCarAvailable = async (req, res) => {
    try{
        const {location, pickupDate, returnDate} = req.body;

        //Fetch all available cars in the location
        const cars = await Car.find({location, isAvailable: true});

        //Check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car) => {
         const isAvailable =  await checkCarAvailability(car._id, pickupDate, returnDate)
         return {...car._doc, isAvailable: isAvailable}
        })
        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true);

        res.json({success: true, availableCars});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to book a car

export const bookCar = async(req, res) => {
    try{
        const {_id} = req.user;
        const {
            car, 
            pickupDate, 
            pickupTime,
            returnDate, 
            returnTime,
            pickupLocation,
            returnLocation,
            price,
            driverLicense,
            phoneNumber,
            insurance,
            specialRequests
        } = req.body;
        
        const isAvailable = await checkCarAvailability(car, pickupDate, returnDate);
        if(!isAvailable){
            return res.json({success: false, message: 'Car is not available for the selected date range'});
        }
        
        const carData = await Car.findById(car);

        //calculate total price based on days
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const totalPrice = price || noOfDays * carData.dailyRate;

        const newBooking = await Booking.create({
            car, 
            owner: carData.owner, 
            user: _id, 
            pickupDate, 
            pickupTime,
            returnDate, 
            returnTime,
            pickupLocation,
            returnLocation,
            totalPrice,
            driverLicense,
            phoneNumber,
            insurance: insurance || 'basic',
            specialRequests: specialRequests || '',
            termsAccepted: true,
            price: totalPrice
        });
        
        res.json({success: true, message: 'Car booked successfully', booking: newBooking});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to List user bookings
export const getUserBookings = async (req, res) => {
    try{
        const {_id} = req.user
        const bookings = await Booking.find({user: _id})
            .populate("car")  // ← This must be present!
            .sort({createdAt: -1});
        res.json({success: true, bookings});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to List owner bookings
export const getOwnerBookings = async (req, res) => {
    try{
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: 'Unauthorized access'});
        }
        const bookings = await Booking.find({owner: req.user._id}).populate("car user").select("-user.password").sort({createdAt: -1});
        res.json({success: true, bookings});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}

//API to change a booking status
export const changeBookindStatus = async (req, res) => {
    try{
        const {_id} = req.user;
        const {bookingId, status} = req.body;
        const booking = await Booking.findById(bookingId)
        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'Unauthorized action'});
        }
        booking.status = status;
        await booking.save();
        res.json({success: true, message: 'Booking status updated successfully'});
    }
    catch(err){
        console.log(err.message);
        res.json({ success: false, message: err.message });
    }
}