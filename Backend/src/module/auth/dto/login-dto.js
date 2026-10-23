import BaseDto from "../../../common/dto/base-dto.js"
import Joi from "joi"

class logInDto extends BaseDto{
    static schema= Joi.object({
        email : Joi.string().email().max(100).trim().lowercase().required(),
        password : Joi.string().min(8).max(50).pattern(/(?=.*[A-Z])(?=.*\d)/).message("password must contain 8 characters").required()
    });
}

export default logInDto;