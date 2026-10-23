import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class resetPassword extends BaseDto{
    static schema = Joi.object({
        newPassword : Joi.string().min(8).max(50).pattern(/(?=.*[A-Z])(?=.*\d)/).message("enter your new password").required()
    });
}
export default resetPassword;