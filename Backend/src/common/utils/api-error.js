class ApiError extends Error{
    constructor(statusCode, message){
        super(message)
        this.statusCode=statusCode
        this.isOperational=true
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message="Bad Request"){
        return new ApiError(400, message);
    }

    static unAuthorized(message="UnAuthorized User"){
        return new ApiError(401,message)
    }
    static conflict(message="conflict"){
        return new ApiError(409, message)
    }
    static forbidden(message="forbidden"){
        return new ApiError(403, message)
    }

    static notFound(message="Notfound"){
        return new ApiError(404, message);
    }
}

export default ApiError;