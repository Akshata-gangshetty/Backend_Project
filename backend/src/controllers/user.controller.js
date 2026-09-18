import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";

// Generate Access Token and Refresh Token
const gt = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Apierror(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshtoken = refreshToken;

        await user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        };

    } catch (error) {
        console.log("========== TOKEN ERROR ==========");
        console.log(error);
        console.log("Message:", error.message);
        console.log("=================================");

        throw new Apierror(500, error.message);
    }
};


// REGISTER USER
const registerUser = asynchandler(async (req, res) => {

    const {
        fullname,
        email,
        username,
        password
    } = req.body;

    console.log("Email:", email);

    // Check required fields
    if (
        [fullname, email, username, password]
            .some((field) => field?.trim() === "")
    ) {
        throw new Apierror(400, "All fields are required");
    }

    // Check existing user
    const existedUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (existedUser) {
        throw new Apierror(
            409,
            "User with email or username already exists"
        );
    }

    // Get avatar
    const avatarlocalPath = req.files?.avatar?.[0]?.path;

    // Get cover image
    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // Avatar required
    if (!avatarlocalPath) {
        throw new Apierror(400, "Avatar is required");
    }

    // Upload avatar
    const avatar = await uploadImage(avatarlocalPath);

    if (!avatar) {
        throw new Apierror(
            400,
            "Avatar file upload failed"
        );
    }

    // Upload cover image only if provided
    let coverImage;

    if (coverImageLocalPath) {
        coverImage = await uploadImage(coverImageLocalPath);
    }

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    // Create user
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Remove password and refresh token
    const createdUser = await User.findById(user._id)
        .select("-password -refreshtoken");

    if (!createdUser) {
        throw new Apierror(
            500,
            "User creation failed"
        );
    }

    return res.status(201).json(
        new Apiresponse(
            200,
            createdUser,
            "User registered successfully"
        )
    );
});


// LOGIN USER
const loginUser = asynchandler(async (req, res) => {

    const {
        email,
        username,
        password
    } = req.body;

    // Username OR email required
    if (!(username || email)) {
        throw new Apierror(
            400,
            "Username or email is required"
        );
    }

    // Find user
    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (!user) {
        throw new Apierror(
            400,
            "User does not exist"
        );
    }

    // Check password
    const isPasswordValid =
        await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new Apierror(
            400,
            "Invalid user credentials"
        );
    }

    // Generate tokens
    const {
        accessToken,
        refreshToken
    } = await gt(user._id);

    // Get logged-in user without sensitive fields
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshtoken");

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true
    };

    // Response
    return res
        .status(200)
        .cookie(
            "accessToken",
            accessToken,
            options
        )
        .cookie(
            "refreshToken",
            refreshToken,
            options
        )
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});


// LOGOUT USER
const logoutUser = asynchandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new Apiresponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});
const refreshAccssToken=asyncHandler (async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
   if(!incomingRefreshToken){
    throw new Apierror(401,"unothoizes request")
   }
   try{
    const decodedToken=jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
   )
   const user=await User.findById(decodedToken?._id)
   if(!user){
    throw new Apierror(401,"invlaid refreshToken");
   }
   if(user.refreshtoken!==incomingRefreshToken){
    throw new Apierror(401," refreshToken is expired or used ")

   } 
   const options={
    httpOnly:true,
    secure:true
   }
   const{accessToken,newrefreshToken}=await gt(user._id)
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newrefreshToken,options)
   .json(new Apiresponse(
    200,
    {accessToken,refresshToken:newrefreshToken},
    "AccessedToken refreshed"
   ))


   }
   catch(error){
    throw new Apierror(500,"Failed to refresh access token")
   }
   })
   

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccssToken
};