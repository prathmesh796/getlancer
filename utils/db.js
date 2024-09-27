import mongoose from "mongoose";

export async function connect() {
    if(mongoose.connections[0].readyState) return;

    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB connection successfully established.")
    }
    catch(error){
        throw new Error("Error in conneting tho database.")
    }
}