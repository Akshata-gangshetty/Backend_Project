import {Apierror} from "../utils/Apierror.js"
import { asynchandler } from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
export const verifyJWt=asynchandler(async (req,res,next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/i, "")
    if(!token){
      throw new Apierror(401, "Unauthorized request")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    // console.log("ACCESS TOKEN:", token);
    // console.log("SECRET EXISTS:", !!process.env.ACCESS_TOKEN_SECRET); 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
      throw new Apierror(401, "Invalid access token")
    }
    req.user = user
    next()
  } catch (error) {
    console.log("========== VERIFY TOKEN ERROR ==========");
    throw error instanceof Apierror
      ? error
      : new Apierror(401, "Invalid access token")
  }
})