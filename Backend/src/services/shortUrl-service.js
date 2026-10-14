import { generateNanoId } from "../utils/helper.js";

import { saveShortUrl } from "../dao/short-url.js";

export const createShortUrlwithoutUser=async(url)=>{
    const shortUrl=await generateNanoId(7);
    if(!shortUrl) throw new Error("short url not generated");
    await saveShortUrl(url,shortUrl);
    return shortUrl;
}


export const createShortUrlwithUser=async(url, userId)=>{
    const shortUrl=await generateNanoId(7);
    await saveShortUrl(url,shortUrl, userId);
    return shortUrl;
}