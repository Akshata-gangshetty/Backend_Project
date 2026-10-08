import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";


// Like / Unlike an educational video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new Apierror(404, "Educational video not found");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    // Unlike
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new Apiresponse(
                    200,
                    { isLiked: false },
                    "Video unliked successfully"
                )
            );
    }

    // Like
    await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new Apiresponse(
                201,
                { isLiked: true },
                "Video liked successfully"
            )
        );
});


// Like / Unlike a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    // Unlike
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(
                new Apiresponse(
                    200,
                    { isLiked: false },
                    "Comment unliked successfully"
                )
            );
    }

    // Like
    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(
            new Apiresponse(
                201,
                { isLiked: true },
                "Comment liked successfully"
            )
        );
});


// Get all educational videos liked by logged-in student
const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true }
    })
        .populate({
            path: "video",
            select: "title description thumbnail duration owner"
        })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new Apiresponse(
                200,
                likedVideos,
                "Liked educational videos fetched successfully"
            )
        );
});


export {
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
};