import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { video as VideoModel } from "../models/video.model.js";
import { AiContent } from "../models/aiConnect.model.js";

const getAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const videoItem = await VideoModel.findById(videoId);
    if (!videoItem) {
        throw new ApiError(404, "Video not found");
    }

    const aiContent = await AiContent.findOne({ video: videoId });
    if (!aiContent) {
        throw new ApiError(404, "AI content not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, aiContent, "AI content fetched successfully"));
});

const generateAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const videoItem = await VideoModel.findById(videoId);
    if (!videoItem) {
        throw new ApiError(404, "Educational video not found");
    }

    let aiContent = await AiContent.findOne({ video: videoId });

    if (aiContent) {
        aiContent.status = "processing";
        await aiContent.save();
    } else {
        aiContent = await AiContent.create({
            video: videoId,
            status: "processing"
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, aiContent, "AI content generation started successfully"));
});

const updateAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { transcript, summary, importantTopics, importantQuestions, studyNotes, quiz, status } = req.body;

    const aiContent = await AiContent.findOne({ video: videoId });
    if (!aiContent) {
        throw new ApiError(404, "AI content not found");
    }

    if (transcript !== undefined) aiContent.transcript = transcript;
    if (summary !== undefined) aiContent.summary = summary;
    if (importantTopics !== undefined) aiContent.importantTopics = importantTopics;
    if (importantQuestions !== undefined) aiContent.importantQuestions = importantQuestions;
    if (studyNotes !== undefined) aiContent.studyNotes = studyNotes;
    if (quiz !== undefined) aiContent.quiz = quiz;
    if (status !== undefined) aiContent.status = status;

    await aiContent.save();

    return res
        .status(200)
        .json(new ApiResponse(200, aiContent, "AI content updated successfully"));
});

export {
    getAiContent,
    generateAiContent,
    updateAiContent
};