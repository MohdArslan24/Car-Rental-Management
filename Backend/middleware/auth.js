import User from "../models/User.js";
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
    
    const token = req.headers.authorization;
    
    if(!token){
        return res.json({success: false, message: 'Not authorized'});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = typeof decoded === 'string' ? decoded : decoded._id || decoded;
        
        if(!userId){
            return res.json({success: false, message: 'Not authorized'});
        }
        req.user = await User.findById(userId).select('-password');
        if(!req.user){
            return res.json({success: false, message: 'User not found'});
        }
        next();
    }
    catch(err){
        return res.status(401).json({success: false, message: 'Access Denied'});
    }
}

const verifyOwner = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if(!token){
        return res.json({success: false, message: 'Not authorized'});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = typeof decoded === 'string' ? decoded : decoded._id || decoded;
        
        if(!userId){
            return res.json({success: false, message: 'Not authorized'});
        }
        req.user = await User.findById(userId).select('-password');
        if(!req.user){
            return res.json({success: false, message: 'User not found'});
        }
        
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: 'Owner access required'});
        }
        
        next();
    }
    catch(err){
        return res.status(401).json({success: false, message: 'Access Denied'});
    }
}

export { protect, verifyOwner };
export default protect;