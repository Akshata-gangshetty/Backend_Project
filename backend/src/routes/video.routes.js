import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";

const router = Router();

router.use(verifyJWt);
router.route("/").get(getAllVideos);
router.route("/").post(publishAVideo);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId").patch(updateVideo);
router.route("/:videoId").delete(deleteVideo);
router.route("/:videoId/toggle-publish").patch(togglePublishStatus);

export default router;