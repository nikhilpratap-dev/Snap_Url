import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import crypto from "node:crypto"
import { verificationEmail,sendResetPasswordEmail } from "../../common/config/email.js";
import {generateToken,
     generateAccessToken,
     generateRefreshToken,
     verifyRefreshToken} from "../../common/utils/jwt.js";
    
    const hashToken=(token)=>crypto.createHash("sha256").update(token).digest("hex");
        
    
    //register
    const register= async({name, email, password, role})=>{
        const existing = await User.findOne({email});
        if(existing){
        throw ApiError.conflict("user already exist");
        }

       const {rawToken, hashedToken}=generateToken();
       

       const user= await User.create({
        name,
        email,
        password,
        role,
        verificationToken : hashedToken,
        verificationTokenExpires: Date.now() + 15 * 60 * 1000
      });
      //send email
      try{
        await verificationEmail(email, rawToken);
      }catch(err){
        console.log("failed to send email", err.message);
      }
    
    const userObj=user.toObject()
    delete userObj.password
    delete userObj.verificationToken
    delete userObj.verificationTokenExpires

    return userObj

}
// verify email

const verifyEmail = async (token)=>{
    const trimmed= String(token).trim();
    if(!trimmed){
        throw ApiError.badRequest("invalid or expire verification token ");
    }

    const hashedInput = hashToken(trimmed);

    let user = await User.findOne({verificationToken : hashedInput, verificationTokenExpires : {$gt : Date.now()}}).select("+verificationToken +verificationTokenExpires");

    if(!user){
        throw ApiError.unAuthorized("invalid or expire verification token")
    }

    await User.findByIdAndUpdate(user._id,{
        $set:{isVerified:true},
        $unset:{verificationToken:1, verificationTokenExpires:1}
    });
}
//log in

const logIn = async ({email, password})=>{


    const user = await User.findOne({email}).select("+password");
    if(!user) throw ApiError.unAuthorized("invalid email or password");

    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw ApiError.unAuthorized("invalid email or password");


     if(!user.isVerified){
        throw ApiError.forbidden("verify your email and password before login");
    }

    const accessToken = generateAccessToken({id : user._id,role: user.role});
    const refreshToken = generateRefreshToken({id : user._id});

    user.refreshToken = hashToken(refreshToken);
    await user.save({validateBeforeSave : false});

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return{user : userObj, accessToken, refreshToken};
}

//refresh token
const refresh =async(token)=>{
    if(!token){
        throw ApiError.unAuthorized("Token is missing")
    }
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");
    if(!user) throw ApiError.unAuthorized("user not found");

        if(user.refreshToken !== hashToken(token)){
            throw ApiError.unAuthorized("invalid refresh token");
        }
        const accessToken = generateAccessToken({id : user._id, role: user.role});
        const newRefreshToken = generateRefreshToken({id : user._id});

        user.refreshToken = hashToken(newRefreshToken);
        await user.save({validateBeforeSave:false});

        return ({accessToken, refreshToken : newRefreshToken});


};

//log out
const logout = async (userId)=>{
    //clear refreshToken in db so refresh token can't be reused
    await User.findByIdAndUpdate(userId, {refreshToken:null})
};


//forget password
const forgetPassword = async (email)=>{
   const user = await User.findOne({email});
   if(!user){
    throw ApiError.unAuthorized("something missing")
   }

   const {rawToken,hashedToken} = generateToken();
   user.resetPasswordToken = hashedToken;
   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

   await user.save({validateBeforeSave:false});

   try{
    await sendResetPasswordEmail(email, rawToken);
   }catch(err){
    console.error("unable to send email, try after some time", err.message);
   }
}
//reset password
const resetPassword = async (newPassword,token)=>{
    const hashedInput = hashToken(token);

    const user = await User.findOne({resetPasswordToken : hashedInput, resetPasswordExpires : {$gt : Date.now()}}).select("+resetPasswordToken +resetPasswordExpires");

    if(!user){
        throw ApiError.badRequest("invalid or expires reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpires=undefined;

    await user.save({validateBeforeSave : false});
}

const getMe = async (userId)=>{
    const user = await User.findById(userId);
    if(!user){
        throw ApiError.notFound("user not found");
    }
    return user;
}
export {
    register,
    logIn,
    verifyEmail,
    forgetPassword,
    refresh,
    logout,
    resetPassword,
    getMe
}