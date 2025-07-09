import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error (
        "Please provide MONGODB_URI"
    )
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected successfully :)");
        
    } catch (error) {
        console.log("MongoDB connection Failed!!!", error);
        process.exit(1)
    }
}

export default connectDB