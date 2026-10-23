import { generateNanoId } from "./shortUrl.helper.js";
import { saveShortUrl } from "./shortUrl.dao.js";

export const createShortUrlwithoutUser = async (url) => {
    const shortUrl = await generateNanoId(7);
    if (!shortUrl) throw new Error("Short URL could not be generated");
    await saveShortUrl(url, shortUrl);
    return shortUrl;
};

export const createShortUrlwithUser = async (url, userId) => {
    const shortUrl = await generateNanoId(7);
    if (!shortUrl) throw new Error("Short URL could not be generated");
    await saveShortUrl(url, shortUrl, userId);
    return shortUrl;
};

