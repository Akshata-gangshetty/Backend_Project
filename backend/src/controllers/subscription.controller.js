import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {Apierror} from "./utils/Apierror.js"
import {Apiresponse} from "./utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const channel= await Subscription.findById(channelId)
    if(!channel){
        throw new Apierror(400,"Channel  is not found")
    }
    const existingSubscription=await Subscription.findOne({
        subscriber:req.user._id,
        channel:channelId
    })
    if(existingSubscription){
        await Subscription.deleteOne({
            subscriber:req.user._id,
            channel:channelId
        })
        return res
            .status(200)
            .json(new Apiresponse(200,channel,"Unsubscribed successfully"))
    }
    await Subscription.create({
        subscriber:req.user._id,
        channel:channelId
    })
    return res
        .status(201)
        .json(new Apiresponse(200,channel,"Subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const channel= await Subscription.findById(channelId)
    if(!channel){
         throw new Apierror(400,"Channel  is not found")
    }
    const subscribers = await Subscription.find({channel:channelId}).populate("subscriber","username fullname avatar")
    return res
        .status(201)
        .json(new Apiresponse(200,subscribers ,"Subscriber fetched successfully"))



    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const subscribed=await User.findById(subscriberId)
    if(!subscribed){
        throw new Apierror(400,"channel not found")
       
    }
    const channels=await Subscription.find({subscriber:subscriberId})
    .populate("channel","username fullname avatar")
    return res
        .status(201)
        .json(new Apiresponse(200,channels ,"Subscribed channels fetched successfully"))


})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}