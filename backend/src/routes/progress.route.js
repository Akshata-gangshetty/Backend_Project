import {Router} from "express"
import {
    updateVideoProgress,
    getVideoProgress,
    saveQuizScore,
    getMyProgress
} from "../controllers/progress.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
const router=Router()
router.use(verifyJWt)
router.route("/:videoId").patch(updateVideoProgress)
router.route("/:videoId").get(getVideoProgress)
router.route("/:videoId/quiz").post(saveQuizScore)
router
    .route("/my-progress")
    .get(getMyProgress);
    export default router;
