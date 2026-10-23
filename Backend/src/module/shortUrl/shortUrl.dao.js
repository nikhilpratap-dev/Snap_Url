import { ConflictError } from "../../errorHandler.js";
import urlSchema from "./shortUrl.model.js";

export const saveShortUrl = async (longUrl, shortUrl, userId) => {
  try {
      const newUrl = new urlSchema({
        full_url: longUrl,
        short_url: shortUrl
      });
      if (userId) {
        newUrl.user = userId;
      }
      await newUrl.save();
   } catch (err) {
     if (err.code === 11000) {
        throw new ConflictError("Short URL already exists");
     }
     throw err; 
   }
};

export const getShortUrl = async (id) => {
    return await urlSchema.findOneAndUpdate({ short_url: id }, { $inc: { clicks: 1 } });
};

export const getUserShortUrls = async (userId) => {
    return await urlSchema.find({ user: userId }).sort({ createdAt: -1 });
};

export const deleteUserShortUrl = async (id, userId) => {
    return await urlSchema.findOneAndDelete({ _id: id, user: userId });
};

