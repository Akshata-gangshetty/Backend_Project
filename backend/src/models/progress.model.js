import mongoose from "mongoose";
const progressSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",
            required:true
        },
        watchPercentage:{
            type:Number,
            default:0,
            max:100
        },
        completed:{
            type:Boolean,
            default:false
        },
        quizScore:{
            type:Number,
            default:null,
            min:0,
            max:100
        },
        quizAttempts:{
            type:Number,
            default:0
        },
        lastWatchedAt:{
            type:Date,
            default:Date.now
        }

    },
    {
        timestamps:true
    }
)
progressSchema.index(
    {user:1,video:1},
    {unique:true}
)
export const Progress=mongoose.model("Progress",progressSchema)