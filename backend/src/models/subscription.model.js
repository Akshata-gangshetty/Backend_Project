import mongoose, {Schema} from "mongoose";
const subscriptionSchema=mongoose.Schema({
    subcriber:{
        type:Schema.Types.ObjectId,//one who subscribing
        ref: "User"
    },
    channel:{
        type:SchemaTypes.ObjectId,//one who is being subscribed
        ref:"User"
    }
})
export const Subscription=mongoose.model("Subscription",subscriptionSchema  )