import Joi from "joi";

// 1. Body validation for creating a short URL
export const createShortUrlDto = Joi.object({
  url: Joi.string()
    .trim()
    .max(2048)
    .uri({
      scheme: ["http", "https"],
    })
    .required()
    .messages({
      "string.empty": "URL cannot be empty",
      "string.uriCustomScheme": "URL must start with http:// or https://",
      "string.uri": "Please provide a valid URL",
      "any.required": "URL is required",
    }),
});

// 2. Params validation for redirecting via short code
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

