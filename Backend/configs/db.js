import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });
        await mongoose.connect(process.env.MONGODB_URI)
    }
    catch(err){
        console.log("Error connecting to database", err);
    }
}

export default connectDB