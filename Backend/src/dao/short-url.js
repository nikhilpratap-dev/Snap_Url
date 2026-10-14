import { ConflictError } from "../errorHandler.js";
import urlSchema from "../models/short-url-schema.js"

export const saveShortUrl=async (longUrl, shortUrl, userId)=>{
  try{
      const newUrl= new urlSchema({
        full_url: longUrl,
        short_url: shortUrl
    });
    if(userId){
        newUrl.user=userId;
    }
    await newUrl.save();
   } catch(err){
     if(err.code==11000){
        throw new ConflictError("short url already exists");
     }
     throw new Error(err); 
   }
}

export const getShortUrl=async (id)=>{
    return await urlSchema.findOneAndUpdate({short_url : id},{$inc:{clicks:1}});
}