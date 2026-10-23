export const errorHandler=(err,req,res,next)=>{
    let statusCode = err.statusCode || (
        err.name === "TokenExpiredError" || err.name === "JsonWebTokenError" ? 401 :
        err.code === 11000 ? 409 : 500
    );

    let message = err.message;
    if (err.name === "TokenExpiredError") message = "Token expired";
    else if (err.name === "JsonWebTokenError") message = "Invalid token";
    else if (err.code === 11000) message = "Resource already exists";

    if (statusCode !== 500) {
        return res.status(statusCode).json({
            status: false,
            success: false,
            message: message || "Request failed"
        });
    }

    console.error(err);
    const isProduction = process.env.NODE_ENV === "production";
    res.status(500).json({
        status: false,
        success: false,
        message: isProduction ? "Internal server error" : message,
    });
};

export class AppError extends Error{
    statusCode;
    isOperational;

    constructor(message, statusCode=500, isOperational=true){
        super(message);
        this.statusCode=statusCode;
        this.isOperational=isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError{
    constructor(message="Resource not found"){
        super(message,404);
    }
}

export class ConflictError extends AppError{
    constructor(message="conflict occured"){
        super(message,409);
    }
}

export class BadRequestError extends AppError{
    constructor(message="Bad Request"){
        super(message,400);
    }
}