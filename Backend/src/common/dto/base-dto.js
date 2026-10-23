import joi from "joi";

class BaseDto{
    static schema=joi.object({});

    static validate(data){
        const {error, value}=this.schema.validate(data,{
            abortEarly:false,
            stripUnknown:true
        });

        if(error){
            return {error : error.details.map((d)=>d.message), value:null};
        }

        return {value, error :null}
    };
};

export default BaseDto;