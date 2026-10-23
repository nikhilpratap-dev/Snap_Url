import { nanoid } from "nanoid";
import rateLimit from "express-rate-limit";

export const generateNanoId = (length) => {
    return nanoid(length);
};

export const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // maximum 30 links per IP per 15 mins
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: false, message: "Too many requests, please try again later." }
});

