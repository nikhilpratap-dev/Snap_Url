import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(`mongodb connected : ${conn.connection.host}`);
        return conn;
    }catch(error){
        console.error("mongodb connection failed", error.message);
        throw error;
    }
}

export default connectDB;