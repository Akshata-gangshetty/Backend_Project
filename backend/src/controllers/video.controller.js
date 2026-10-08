import mongoose, { isValidObjectId } from "mongoose";
import { video as VideoModel } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "./utils/Apierror.js";
import { ApiResponse } from "./utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = "1", limit = "10", query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    const filter = {};

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    if (userId) {
        filter.owner = userId;
    }

    const videos = await VideoModel.find(filter)
        .sort({ [sortBy]: sortType === "desc" ? -1 : 1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoFile = req.files?.videoFile?.[0]?.path;
    const thumbnail = req.files?.thumbnail?.[0]?.path;

    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const uploadedVideo = await uploadImage(videoFile);
    if (!uploadedVideo) {
        throw new ApiError(400, "Video file failed to upload");
    }

    const uploadedThumbnail = await uploadImage(thumbnail);
    if (!uploadedThumbnail) {
        throw new ApiError(400, "Thumbnail failed to upload");
    }

    const newVideo = await VideoModel.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration: uploadedVideo.duration,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid video id is required");
    }

    const video = await VideoModel.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid video id is required");
    }

    const video = await VideoModel.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video is not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    if (req.file) {
        const thumbnailLocalPath = req.file.path;
        const thumbnail = await uploadImage(thumbnailLocalPath);

        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail upload failed");
        }

        video.thumbnail = thumbnail.url;
    }

    await video.save();

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid video id is required");
    }

    const video = await VideoModel.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video is not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    await VideoModel.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Video is deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Valid video id is required");
    }

    const video = await VideoModel.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video is not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Publish status updated successfully"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};