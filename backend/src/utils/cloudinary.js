import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({
    cloud_name:'process.env.CLOUDINARY_CLOUD_NAME',
    api_key:'process.env.CLOUDINARY_API_KEY',
    api_secret:'process.env.CLOUDINARY_API_SECRET'
})
const uploadImage=async(localfilePath)=>{
    try{
        if(!localfilePath){
           return null;
        }
        const response = await cloudinary.uploader.upload(localfilePath, { resource_type: "auto" });
        log.info(`Image uploaded to Cloudinary: ${response.secure_url}`);
        return response;
    } catch (error) {
       fs.unlinkSync(localfilePath);
       return null;
    }
}

export {uploadImage}