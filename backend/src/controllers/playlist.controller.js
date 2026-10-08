import mongoose from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Apierror} from "./utils/Apierror.js"
import {Apiresponse} from "./utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name?.trim()){
        throw new Apierror(404, "Playlist not found");
        }

        const playlist=await Playlist.create({
            name:name.trim(),
            description:description?.trim() || "",
            owner:req.user._id,
            video:[]

 } )
  return res
             .status(201)
             .json(
                 new Apiresponse(
                     201,
                     playlist,
                     "Educational videos Playlist createed  "
                 )
             );

    

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    //  const playlist= await Playlist.findById(userId)
       
        const playlist = await Subscription
        .find({ owner:userId})
        .populate({
            path:"video",
            select:"name description thumbnail"
        })
        .sort({createdAt:-1})
         if(!playlist){
             throw new Apierror(400,"playlist is fetched ")
        }
        return res
            .status(201)
            .json(new Apiresponse(200,playlist ,"User playlist fetched successfully"))
    
    

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId)
    .populate({
            path:"video",
            select:"name description thumbnail"
        })
    if(!playlist){
             throw new Apierror(400,"playlist is fetched ")
        }
         return res
            .status(201)
            .json(new Apiresponse(201,playlist ,"Playlist fetched successfully using id"))
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId)
   
    if(!playlist){
             throw new Apierror(400,"playlist is fetched ")
        }
    if(playlist.owner.toString()!==req.user._id.toString()){
        throw new Apierror(400,"you are not authorized to add video to this playlist")

    }
     const Video=await video.findById(videoId)
     if(!Video){
            throw new Apierror(400,"Video Id  is required")
        }
    const alreadyexist=playlist.videos.some((id)=>id.tostring()===videoId)

        if(alreadyexist){
            throw new Apierror(400,"Video already exist")
        } 
        playlist.videos.push(videoId)
        await playlist.save()
         return res
            .status(201)
            .json(new Apiresponse(201,playlist ,"video added successfully using id"))
    
         

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const playlist = await Playlist.findById(playlistId)
   
    if(!playlist){
             throw new Apierror(400,"playlist is fetched ")
        }
    if(playlist.owner.toString()!==req.user._id.toString()){
        throw new Apierror(400,"you are not authorized to add video to this playlist")

    }
     const Video=await video.findById(videoId)
     if(!Video){
            throw new Apierror(400,"Video Id  is required")
        }
    const alreadyexist=playlist.videos.some((id)=>id.tostring()===videoId)

        if(!alreadyexist){
            throw new Apierror(400,"Video already exist")
        } 
        playlist.videos=playlist.videos.filter((id)=>id.toString()!==videoId)
        await playlist.save()
         return res
            .status(201)
            .json(new Apiresponse(201,playlist ,"video removed from playlist successfully using id"))
    


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}