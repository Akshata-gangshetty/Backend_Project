import express from "express";
import cors from "cors";
import cookiePrser from "cookie-parser";
 const app=express()
app.use(cors({

    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
import useRouter from'./routes/user.routes.js'
import router from "./routes/user.routes.js";
app.use("/api/v1/user/",useRouter)
//http://localhost:3000/api/v1/user/register
export {app}

