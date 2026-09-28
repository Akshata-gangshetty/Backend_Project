import { Router } from "express";
import { changePassword, registerUser } from "../controllers/user.controller.js";
import { loginUser ,refreshAccssToken,

    getCurentuser,
    updateAccountdetails,
    updateUserCoverImage,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory
    
} from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
import { upload } from "../middlrwares/multer.middleware.js";
const router=Router();
router.route("/register").post(
    upload.fields([
        {name:"avatar",
            maxCount:1

        },
        {name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
    router.route("/login").post(loginUser)
    router.route("/logout").post(verifyJWt,logoutUser)
    router.route("/refresh").post(refreshAccssToken)
    router.route("/change-password").post(verifyJWt,changePassword)
     router.route("/getCurentuser").post(verifyJWt,getCurentuser)
    router.route("/Accountdetails").patch(verifyJWt,updateAccountdetails)
     router.route("/avatar").patch(verifyJWt,upload.single("avatar"),updateUserAvatar)
     router.route("/CoverImage").patch(verifyJWt,upload.single("coverImage"), updateUserCoverImage)
     router.route("/WatchHistory").get(verifyJWt,getWatchHistory)
     router.route("/c/:username").get(verifyJWt,getUserChannelProfile)









export default router