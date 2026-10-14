export const errorHandler=(err,req,res,next)=>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            status:false,
            message:err.message,
        });
    }

    console.error(err);
    const isProduction = process.env.NODE_ENV === "production";
        res.status(500).json({
            status : false,
            message : isProduction ? "Internal server error" : err.message,
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