import { Router } from "express";
import validate from "../../common/middlewares/register-validate.js";
import RegisterDto from "./dto/register-dto.js";
import logInDto from "./dto/login-dto.js";
import forgetPassword from "./dto/forgetPassword-dto.js";
import resetPassword from "./dto/resetPassword-dto.js";
import { authenticate } from "./auth.middleware.js";
import * as Controller from "./auth.controller.js"

const router=Router()

router.post("/register",validate(RegisterDto), Controller.register);//done
router.post("/login",validate(logInDto), Controller.logIn);//done
router.post("/refresh-Token", Controller.refreshToken);
router.post("/forgot-Password",validate(forgetPassword),Controller.forgetPassword);//done
router.post("/logOut",authenticate,Controller.logOut);//done

router.put("/reset-Password/:token",validate(resetPassword),Controller.resetPassword);//done

router.get("/verify-email/:token",Controller.verifyEmail);//done
router.get("/me",authenticate,Controller.getMe);//done
export default router

