import ApiResponse from "../../common/utils/api-response.js"
import * as Services from "./auth.service.js"



const cookieOption = {
      httpOnly : true,
      secure : process.env.NODE_ENV==="production",
      sameSite : "strict",
      maxAge : 7*24*60*60*1000, //7days
    }

const register = async (req,res)=>{
    const user = await Services.register(req.body);
    ApiResponse.created(res, "Registration success", user);
}

// Refresh token goes in httpOnly cookie — not accessible to JS
const logIn =async(req,res)=>{
    const {user, accessToken, refreshToken} = await Services.logIn(req.body);
    res.cookie("refreshToken", refreshToken,cookieOption);
    ApiResponse.ok(res,"login succesfully",{user, accessToken});
}

const refreshToken = async (req,res) =>{
    const token = req.cookies?.refreshToken;
    const {accessToken, refreshToken:newRefreshToken} = await Services.refresh(token);
    res.cookie("refreshToken", newRefreshToken, cookieOption);

    ApiResponse.ok(res,"refreshed token",{accessToken});
}

const resendVerification = async (req,res)=>{
    await Services.resendVerification(req.body.email);
    ApiResponse.ok(res, "Verification email sent successfully. Please check your inbox.");
}

const forgetPassword = async (req,res)=>{
    await Services.forgetPassword(req.body.email);
    ApiResponse.ok(res,"password reset email sent");
}

const logOut = async (req,res)=>{
    await Services.logout(req.user.id);
    res.clearCookie("refreshToken",{...cookieOption, maxAge: undefined});
    ApiResponse.ok(res,"successfully log out");
}

const verifyEmail = async (req,res)=>{
    await Services.verifyEmail(req.params.token);

    if (req.accepts("html")) {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verified — SnapURL</title>
                <style>
                    body { margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                    .card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 40px; max-width: 440px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
                    .icon { width: 56px; height: 56px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; font-size: 28px; }
                    h1 { font-size: 22px; font-weight: 700; margin: 0 0 10px; color: #ffffff; }
                    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
                    .btn { display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="icon">✓</div>
                    <h1>Email Verified!</h1>
                    <p>Your SnapURL account has been successfully verified. You can now log in and start creating links.</p>
                    <a href="${clientUrl}" class="btn">Go to SnapURL Login</a>
                </div>
            </body>
            </html>
        `);
    }

    ApiResponse.ok(res,"Email verify successfully");
}

const resetPassword=async (req,res) =>{
    await Services.resetPassword(req.body.newPassword,req.params.token);
    ApiResponse.ok(res, "password reset successfully");
}

const getMe = async (req,res) =>{
   const user = await Services.getMe(req.user.id);
   ApiResponse.ok(res,"profile",user);
}
export {
    register,
    logIn,
    refreshToken,
    resendVerification,
    forgetPassword,
    logOut,
    verifyEmail,
    resetPassword,
    getMe,
}