import dotenv from "dotenv"
dotenv.config("./.env")
import express from "express";
const app=express();
import cors from "cors"
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));



import connectDB from "./src/config/mongo-config.js"

import { redirectFromShortUrl } from "./src/controllers/shortUrl-controller.js";


import short_url from "./src/routes/shortUrl-route.js";
import { errorHandler } from "./src/errorHandler.js";
import { validate } from "./src/middlewares/validate.js";
import { redirectShortUrlDto } from "./src/dto/shortUrl-dto.js";
import { createUrlLimiter } from "./src/utils/helper.js";


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/api/create",createUrlLimiter, short_url);

app.get("/:id", validate(redirectShortUrlDto, "params"),redirectFromShortUrl);


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