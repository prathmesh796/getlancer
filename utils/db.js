import mongoose from "mongoose";

const connect = async () => {
    if(mongoose.connections[0].readyState) return;

    try{
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB connection successfully established.")
    }
    catch(error){
        throw new Error("Error in conneting tho database.")
    }
}

export default connect