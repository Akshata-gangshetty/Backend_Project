import {asynchandler  } from "../utils/asynchandler.js";
import {Apierror} from "../utils/Apierror.js";
import {User} from  "../models/user.model.js"
import {uploadImage} from "../utils/cloudinary.js"
import { Apiresponse } from "../utils/Apiresponse.js";
const  generateAcessAndRefreshToken=async(userId)=>{
    try{
        const user= await User.findById(userId)
        const accessToken= user.generateAcessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshtoken=refreshToken
        user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }
    catch(error){
            throw new Apierror(500,"Something went wrong while generating refresh and access   token")
    }
}
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
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage>0){
    coverImageLocalPath=req.files.coverImage[0].path
   }
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
const loginUser=asynchandler(async(req,res)=>{
    const {email,username,password}=req.body
    if(!username || !email){
        throw new Apierror(400,"Username or email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new Apierror(400,"user does not exist ")
    }
    const ispassswordvalid=await user.isPasswordCorrect(password)
     if(!ispassswordvalid){
        throw new Apierror(400,"invaalid user credentials ")
    }
     const {accessToken,refreshToken}=await generateAcessAndRefreshToken(user._id)
     const loggedInUSer=await User.findById(user._id)
     select("-password -refreshToken")
     const options={
        httpOnly:true,
        secure:true
     }
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(        
        new Apiresponse(
             200,
             {
                user:loggedInUSer,accessToken,
                refreshToken
             },
             "User logged in Succesfully"
        )
           

        
     )
     


                                            
   
})
const logoutUser= asynchandler(async () => {
   await User.findByIdAndUpdate(
        req.user._id,{
            $set:{refreshtoken:undefined}
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
     }
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
       .json (new Apiresponse(200,{},"user logged out"))
    })
export {registerUser,loginUser,logoutUser}