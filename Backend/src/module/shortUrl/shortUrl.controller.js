import { createShortUrlwithoutUser, createShortUrlwithUser } from "./shortUrl.service.js";
import { getShortUrl, getUserShortUrls, deleteUserShortUrl } from "./shortUrl.dao.js";
import wrapAsync from "../../tryCatchWrapper.js";

export const createShortUrl = wrapAsync(async (req, res, next) => {
    const { url } = req.body;
    const shortedUrl = req.user?.id
        ? await createShortUrlwithUser(url, req.user.id)
        : await createShortUrlwithoutUser(url);

    const baseUrl = (process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, "");
    res.json({
        success: true,
        shortUrl: `${baseUrl}/${shortedUrl}`,
        url: `${baseUrl}/${shortedUrl}`,
        code: shortedUrl
    });
});

export const getMyLinks = wrapAsync(async (req, res) => {
    const links = await getUserShortUrls(req.user.id);
    const baseUrl = (process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/+$/, "");
    const formatted = links.map(link => ({
        id: link._id,
        shortUrl: `${baseUrl}/${link.short_url}`,
        originalUrl: link.full_url,
        clicks: link.clicks,
        createdAt: link.createdAt
    }));
    res.json({ success: true, data: formatted });
});

export const deleteMyLink = wrapAsync(async (req, res) => {
    const deleted = await deleteUserShortUrl(req.params.id, req.user.id);
    if (!deleted) {
        return res.status(404).json({ success: false, message: "Link not found or unauthorized" });
    }
    res.json({ success: true, message: "Link deleted successfully" });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const url = await getShortUrl(id);

    if (!url) {
        return res.status(404).json({
            status: false,
            message: "Short URL not found"
        });
    }
    return res.redirect(url.full_url);
});

