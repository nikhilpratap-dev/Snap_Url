import express from "express"
const router= express.Router(); 
import {createShortUrl} from "../controllers/shortUrl-controller.js";
import { validate } from "../middlewares/validate.js";
import { createShortUrlDto } from "../dto/shortUrl-dto.js";

router.post("/",validate(createShortUrlDto,"body"),createShortUrl);

export default router;