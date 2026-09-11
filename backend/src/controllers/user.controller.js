import {asynchandler  } from "../utils/asynchandler.js";
import {Apierror} from "../utils/apiError.js";
import {User} from  "../models/user.model.js"
import {uploadImage} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js";
const registerUser =asynchandler(async(req,res)=>{
    //get user details from Frontend
    //validation
    //check if user already exists
    //checkfor imaages,avatar
    //upload them to cloudinary
    //create user object -create entry in db
    // remove password and refresh token  from response
    //check for user creation
    //return res
    const {fullname,email,username,password}=req.body
    console.log(email)
    if([fullname,email,username,password].some((field)=>field?.trim()==="")){
        throw new Apierror(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new Apierror(409,"User with email or username already exists")
    }
   const avatarlocalPath= req.files?.avatar[0]?.path
   const coverImagelocalPath= req.files?.coverImage[0]?.path;
    if(!avatarlocalPath){
        throw new Apierror(400,"Avatar is required")
    }
    const avatar = await uploadImage(avatarlocalPath)
    const coverImage = await uploadImage(coverImagelocalPath)
    if (!avatar) {
        throw new Apierror(400,"Avatar file upload failed")
    }
    console.log("BODY",req.body);
    console.log("FILES",req.files);
    
   const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser= await User.findById(user._id).select("-password -refreshtoken" )
    if(!createdUser){
        throw new Apierror(500,"User creation failed")
    }
    return res.status(201).json(
        new Apiresponse(200,createdUser,"user registeered successfully")
    )
})
export {registerUser}