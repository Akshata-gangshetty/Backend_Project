import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
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






export default router