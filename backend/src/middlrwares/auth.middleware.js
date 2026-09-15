import {Apierror} from "../utils/Apierror.js"
import { asynchandler } from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
export const verifyJWt=asynchandler(async (req,res,next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    if(!token){
      throw new Apierror("unauthorized request",401)
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password refreshToken")
    if(!user){
      throw new Apierror("invalid access token",401)
    }
    req.user = user
    next()
  } catch (error) {
    throw new Apierror("invalid access token",401)
  }
})