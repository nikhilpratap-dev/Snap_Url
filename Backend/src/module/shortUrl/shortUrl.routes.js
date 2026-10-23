import express from "express";
const router = express.Router(); 
import { createShortUrl, getMyLinks, deleteMyLink } from "./shortUrl.controller.js";
import { validate } from "../../middlewares/validate.js";
import { createShortUrlDto } from "./dto/shortUrl.dto.js";
import { authenticate, optionalAuthenticate } from "../auth/auth.middleware.js";

router.post("/", optionalAuthenticate, validate(createShortUrlDto, "body"), createShortUrl);
router.get("/my-links", authenticate, getMyLinks);
router.delete("/my-links/:id", authenticate, deleteMyLink);

export default router;

