import dotenv from "dotenv"
dotenv.config("./.env")
import express from "express";
const app=express();
import cookieParser from "cookie-parser";
import cors from "cors"
import helmet from "helmet"

app.set("trust proxy", 1);
app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({limit : "20kb"}));
app.use(express.urlencoded({extended:true, limit : "20kb"}));

import connectDB from "./src/config/mongo-config.js"
import authRouter from "./src/module/auth/auth.routes.js";
import shortUrlRouter from "./src/module/shortUrl/shortUrl.routes.js";
import { redirectFromShortUrl } from "./src/module/shortUrl/shortUrl.controller.js";
import { redirectShortUrlDto } from "./src/module/shortUrl/dto/shortUrl.dto.js";
import { createUrlLimiter } from "./src/module/shortUrl/shortUrl.helper.js";
import { errorHandler } from "./src/errorHandler.js";
import { validate } from "./src/middlewares/validate.js";

app.get("/health", (req, res) => {
  res.status(200).json({ status: true, message: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/create", createUrlLimiter, shortUrlRouter);

app.get("/:id", validate(redirectShortUrlDto, "params"), redirectFromShortUrl);


const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
    app.listen(PORT,()=>{
     
    console.log(`server is running on ${PORT}`);
    
});
})
 .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });



app.use(errorHandler);