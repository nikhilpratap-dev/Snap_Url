import Joi from "joi";

// 1. URL Shorten karne ke liye DTO (Body validation)
export const createShortUrlDto = Joi.object({
  url: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"], // Sirf http aur https allow karega (no javascript: or ftp:)
    })
    .required()
    .messages({
      "string.empty": "URL cannot be empty",
      "string.uriCustomScheme": "URL must start with http:// or https://",
      "string.uri": "Please provide a valid URL",
      "any.required": "URL is required",
    }),
});

// 2. Redirect ke liye ID DTO (Params validation)
export const redirectShortUrlDto = Joi.object({
  id: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]{5,10}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid Short URL ID format",
      "string.empty": "Short URL ID cannot be empty",
      "any.required": "Short URL ID is required",
    }),
});