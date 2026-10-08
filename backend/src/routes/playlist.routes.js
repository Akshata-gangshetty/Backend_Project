import {Router} from "express"
import { createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist} from "../controllers/playlist.controller.js";
    const router = Router();
router.use(verifyJWT);
router.route("/Playlist").post(createPlaylist);
router.route("/user").get(getUserPlaylists)
router.get(getPlaylistById)
      .patch(updatePlaylist)
      .delete(deletePlaylist)
router.route("/:playlistId/video/:videoId").post(addVideoToPlaylist)
router.route("/:playlistId/video/:videoId").post(removeVideoFromPlaylist)
export default router