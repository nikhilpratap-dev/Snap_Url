import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class forgetPassword extends BaseDto{
    static schema = Joi.object({
        email : Joi.string().email().trim().max(100).lowercase().required()
    });
}
export default forgetPassword;