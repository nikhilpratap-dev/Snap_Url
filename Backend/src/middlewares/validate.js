import { BadRequestError } from "../errorHandler.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    // stripUnknown: true se extra unwanted fields automatically remove ho jayengi
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true, 
    });

    if (error) {
      // Saare error messages ko combine kar dega
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new BadRequestError(errorMessage));
    }

    // Cleaned/sanitized data wapas req me daal dein
    req[property] = value;
    next();
  };
};