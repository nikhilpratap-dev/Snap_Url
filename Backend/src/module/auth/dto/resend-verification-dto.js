import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class ResendVerificationDto extends BaseDto {
    static schema = Joi.object({
        email: Joi.string()
            .email()
            .trim()
            .max(100)
            .lowercase()
            .required()
            .messages({
                "string.empty": "Email cannot be empty",
                "string.email": "Please provide a valid email address",
                "any.required": "Email is required",
            }),
    });
}

export default ResendVerificationDto;
