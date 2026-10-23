import ApiError from "../utils/api-error.js";

const validate=(dtoClass)=>{
    return (req, res, next)=>{
        const {error, value}=dtoClass.validate(req.body);
        if(error){
            throw ApiError.badRequest(error.join("; ")
            );
        }
        req.body=value;
        next();
    };
};

export default validate;