import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Apierror} from "./utils/Apierror.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asynchandler} from "./utils/asynchandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const Video=await video.findById(videoId);
    if(!Video){
        throw new Apierror(400,"Video  is not found")
    }
    const comments=await Comment.find({Video:videoId})
    .populate("owner","username avatr")
    .sort({createdAt:-1})
    .skip((page-1)*limit)
    .limit(Number(limit))
     return res
    .status(200)
    .json(new Apiresponse(201,comments,"Comments published successfully"))
        


})



const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new Apierror(400, "Comment content is required");
    }

    // Check whether video exists
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Create comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                comment,
                "Comment added successfully"
            )
        );
});

const updateComment = asynchandler(async (req, res) => {
    const {commentId}=req.params
    const {content}=req.body
      if (!content?.trim()) {
        throw new Apierror(400, "Comment content is required");
    }
     const comment=await video.findById(videoId);
     if(!comment){
            throw new Apierror(400,"comment is not found")
        }
        if (comment.owner.toString()!==req.user._id.to) {
             throw new Apierror(400,"you are not authorized to update this comment")
            
        }
    await  Comment.create({
        content,
        comment: commentId,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(
            new Apiresponse(
                201,
                comment,
                "Comment updated successfully"
            )
        );

})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId } = req.params
        //TODO: delete video
         const comment=await Comment.findById(videoId);
        if(!comment){
            throw new Apierror(400,"comment  is not found")
        }
        if (comment.owner.toString()!==req.user._id.to) {
             throw new Apierror(400,"you are not authorized to delete this comment")
            
        }
        await Comment.findByIdandDelete( commentId)
         return res
        .status(201)
        .json(new Apiresponse(200,video,"comment is deleted successfully"))
        
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }