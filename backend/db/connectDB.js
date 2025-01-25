import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URl = process.env.MONGO_URL

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URl)
        console.log("MongoDB connected")
    }catch{
        console.log("MongoDB not connected")
        process.exit(1)
    }
}