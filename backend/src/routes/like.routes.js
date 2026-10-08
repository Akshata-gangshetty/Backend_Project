import { Router } from "express";

import {
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
} from "../controllers/like.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


// All like routes require login
router.use(verifyJWT);


// Like / unlike an educational video
router
    .route("/video/:videoId")
    .post(toggleVideoLike);


// Like / unlike a comment
router
    .route("/comment/:commentId")
    .post(toggleCommentLike);


// Get all videos liked by logged-in student
router
    .route("/my-liked-videos")
    .get(getLikedVideos);


export default router;