import joi from "joi"
import BaseDto from "../../../common/dto/base-dto.js"

class RegisterDto extends BaseDto{
    static schema = joi.object({
        name:joi.string().min(2).max(50).trim().required(),
        email:joi.string().email().lowercase().max(100).trim().required(),
        password:joi.string().min(8).max(50).pattern(/(?=.*[A-Z])(?=.*\d)/).message("password must contains 8 character").required(),
        role:joi.string().valid("seller", "customer").default("customer")
    });
};

export default RegisterDto;