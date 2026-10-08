import {Apierror} from "./utils/Apierror.js"
import {Apiresponse} from "./utils/Apiresponse.js"
import {asynchandler} from "./utils/asynchandler.js"
import { video } from "../models/video.model.js"
import { Progress } from "./models/progress.model.js";
const updateVideoProgress=asynchandler(async(req,res)=>{
    const {videoId}=req.params
    const {watchPercentage}=req.body
    if(watchPercentage===undefined || watchPercentage<0 || watchPercentage>100){
        throw new Apierror(400,"watchPercentage must be between 0 and 100")

    }
    const video=await video.findById(videoId)
    if(!video){
        throw new Apierror(400,"video not found")
    }
    const completed=watchPercentage===100
    const progress =await Progress.findoneAndUpdate(
        {
            user:req.user._id,
            video:videoId
        },
        {
            watchPercentage,
            completed,
            lastwatched:new Date()
        },
        { new: true ,
            upsert:true,
            runValidators:true
        },
        
    )
    return res
        .status(201)
        .json(new Apiresponse(201, progress,"progress updated successfully"))

})
const getVideoProgress = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    const progress = await Progress.findOne({
        user: req.user._id,
        video: videoId
    });

    return res.status(200).json(
        new Apiresponse(
            200,
            progress,
            "Video progress fetched successfully"
        )
    );
});
const saveQuizScore = asynchandler(async (req, res) => {
    const {videoId}=req.params
    const {quizScore}=req.body
     if (
        quizScore === undefined ||
        quizScore < 0 ||
        quizScore > 100
    ) {
        throw new ApiError(
            400,
            "Quiz score must be between 0 and 100"
        );
    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(
            404,
            "Educational video not found"
        );
    }
    const progress=await Progress.findoneAndUpdate(
        {
                 user: req.user._id,
            video: videoId
        },
        {
            $set:{
                quizScore
            },
            $inc:{
                quizAttempt:1
            }
        },
         { new: true ,
            upsert:true,
            runValidators:true
        },
    )
       return res.status(200).json(
        new Apiresponse(
            200,
            progress,
            "Quiz score saved successfully"
        )
    );
})
const getMyProgress = asyncHandler(async (req, res) => {

    const progress = await Progress.find({
        user: req.user._id
    })
        .populate({
            path: "video",
            select: "title thumbnail duration"
        })
        .sort({
            updatedAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            progress,
            "Learning progress fetched successfully"
        )
    );
});
export {
    updateVideoProgress,
    getVideoProgress,
    saveQuizScore,
    getMyProgress
};