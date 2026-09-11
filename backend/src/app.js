import express from "express";
import cors from "cors";
import cookiePrser from "cookie-parser";
import useRouter from'./routes/user.routes.js'
 const app=express()
app.use(cors({

    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))
app.use(cookiePrser())


app.use("/api/v1/user/",useRouter)
//http://localhost:3000/api/v1/user/register
export {app}

