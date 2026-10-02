import mongoose, {isValidObjectId} from "mongoose"
import {video, video, Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {Apierror, ApiError} from "../utils/ApiError.js"
import {Apiresponse, ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler, asyncHandler} from "../utils/asyncHandler.js"
import {uploadImage, uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter={}
    if(query){
        filter.$or=[{title:{
            $regex:query,
            $options:"i"
        }},
        {description:{
            $regex:query,
            $options:"i"
        }}
        

    ]

  }
  if(userId){
            filter.owner=userId
        }
    const  video=await video.find(filter)
    .sort(sortBy?{[sortNy]:sortType==="desc"?-1:1}:{createdAt:-1})
    .skip((Number(page)-1)* Number(limit))
    .limit(Number(limit))
    return res
    .status(200)
    .json(new Apiresponse(200,video,"Videos fetched successfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description){
        throw new Apierror(400,"Title and  description are required")
    }
    const videoFile=req.files?.videoFile?.[0]?.path
    const thumbnail=req.files?.thumbnail?.[0]?.path
    if(!videoFile){
        throw new Apierror(400,"Video File  is required")
    }
     if(!thumbnail){
        throw new Apierror(400,"thumbnail is required")
    }
    const uploadedVideo=await uploadImage(videoFile)
     if(!uploadedVideo){
        throw new Apierror(400,"Video File  failed to upload")
    }
    const uploadedthumbnail=await uploadImage(thumbnail)
     if(!uploadedthumbnail){
        throw new Apierror(400,"thumbnail  failed to upload")
    }
    const Video=await video.create({
        videoFile:uploadedVideo.url,
        thumbnail:uploadedthumbnail.url,
        title,
        description,
        duration:uploadedVideo.duration,
        owner:req.user._id


    })
    return res
    .status(201)
    .json(new Apiresponse(201,video,"Videos published successfully"))
    

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        throw new Apierror(400,"Video Id  is required")
    }
     const Video=await video.findById(videoId)
     if(!videoId){
        throw new Apierror(400,"Video not found")
    }
     
     return res
    .status(201)
    .json(new Apiresponse(201,video,"Videos fetched successfully"))
    



})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title,description}=req.body
    const Video=await video.findById(videoId);
    if(!Video){
        throw new Apierror(400,"Video  is not found")
    }
    if (Video.owner.toString()!==req.user._id.to) {
         throw new Apierror(400,"you are not authorized to update this video")
        
    }
    if(title){
        Video.title=title
    }
    if(description){
        Video.description=description
    }
    if (req.file) {
        const thumbnaillocalpath=req.file.path
    
    const thumbnail=await uploadImage(thumbnaillocalpath);
     if(thumbnail){
        throw new Apierror(400,"thumbnail upload is failed")
    }
        Video.thumbnail=thumbnail.url
    }
    await video.save()
    return res
    .status(200)
    .json(new Apiresponse(200,video,"Video updated successfully"))
    


    

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
     const Video=await video.findById(videoId);
    if(!Video){
        throw new Apierror(400,"Video  is not found")
    }
    if (Video.owner.toString()!==req.user._id.to) {
         throw new Apierror(400,"you are not authorized to delete this video")
        
    }
    await Video.findByIdandDelete( videoId)
     return res
    .status(201)
    .json(new Apiresponse(200,video,"Video is deleted successfully"))
    

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
     const Video=await video.findById(videoId);
    if(!Video){
        throw new Apierror(400,"Video  is not found")
    }
    Video.isPublished=!Video.isPublished
    await Video.save()
     return res
    .status(201)
    .json(new Apiresponse(200,video,"Publish status updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}