import { createShortUrlwithoutUser } from "../services/shortUrl-service.js"
import { getShortUrl } from "../dao/short-url.js";
import wrapAsync from "../tryCatchWrapper.js";



export const createShortUrl=wrapAsync(async(req,res,next)=>{
    
        const {url}=req.body
        const shortedUrl= await createShortUrlwithoutUser(url);

        const baseUrl = (process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, "");
        res.send(`${baseUrl}/${shortedUrl}`);
   
});

export const redirectFromShortUrl=wrapAsync(async(req,res)=>{
    const {id} = req.params
    const url= await getShortUrl(id);

    if(!url){
        return res.status(404).json({
            status:false,
            message: "Short URL not found"
        });
    }
    return res.redirect(url.full_url);
});