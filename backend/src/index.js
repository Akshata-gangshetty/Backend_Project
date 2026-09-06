import mongoose from "mongoose";
import { DB_NAME  } from "./constants.js";
import connectDB from "./db/index.js";
 import dotenv from "dotenv";
  import express from "express";
  const app=express();
 dotenv.config();

connectDB()
.then(() => {
     app.on("error",(error)=>{
       console.log("ERRR:",error);
        throw error
        
     })
  app.listen(process.env.PORT || 3000,() => {
    console.log(`Server is running at port ${process.env.PORT}`);
    
    
  }
  )
  
}
)
.catch((error)=>{
  console.log("Mongodb connection failed",error);
  
})

















//

// 

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((error) => {
//     console.log("MongoDB connection error:", error);
//   });
  // import mongoose from "mongoose";
  // import { DB_NAME } from "./constants";
  // import express from "express";
  // const app=express();
  // (async () => {
  //   try{
  //      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
  //     app.on("error",(error)=>{
  //       console.log("ERRR:",error);
  //       throw error
        
  //     })
  //     app.listen(process.env.PORT,()=>{
  //       console.log(`App is listening on port ${process.env.PORT}`);
        
  //     })
        

       
  //   }
  //   catch(error){
  //       console.error("ERROR:",error)
  //      throw error;
  //     }
           
    
    
  // })()