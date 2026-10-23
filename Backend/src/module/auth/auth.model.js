import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        trim : true,
        minlength : (2),
        maxlength : (50),
        required :[true, "Name is required"]
    },

    email :{
        type : String,
        trim: true,
        maxlength :(100),
        unique : true,
        lowercase : true,
        required :[true, "Email is required"]
    },

    password : {
        type : String,
        trim : true,
        minlength: 8,
        maxlength : (50),
        required : [true, "password is required"],
        select : false
       
    },

    role : {
        type : String,
        enum : ["seller", "customer", "admin"],
        default : "customer"
    },

    isVerified :{
        type : Boolean,
        default : false
    },

    verificationToken:{type : String, select : false},
    verificationTokenExpires: {type: Date, select: false},
    refreshToken:{type :String, select:false},
    resetPasswordToken:{type:String, select: false},
    resetPasswordExpires:{type:Date,select:false},

},{timestamps:true});

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,12);
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);