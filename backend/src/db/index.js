import mongoose from "mongoose";
import { DB_NAME  } from "../constants.js";
const connectDB = async () => {
    try {
       const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${ DB_NAME}`) ;
       console.log(`\n Mongodb connected DB Host:${connectioninstance.connection.host}`);
       
    } catch (error) {
        console.log("mongodb connection error",error);
        process.exit()
        
        
    }
}
export default connectDB