import mongoose from "mongoose";

const shortUrlSchema=new mongoose.Schema({
    full_url :{
        type : String,
        required : true
    },
    short_url : {
        type : String,
        required : true,
        index : true,
        unique : true,

    },
    clicks : {
        type : Number,
        required : true,
        default : 0
    },
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }

});

const short_url=mongoose.model("short_url",shortUrlSchema);

export default short_url;