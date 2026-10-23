import ApiError from "../../common/utils/api-error.js";
import User from "./auth.model.js";
import { verifyAccessToken } from "../../common/utils/jwt.js";

//Authenticate using the short -lived access token (header or cookie)

const authenticate = async(req,res,next)=>{
    let token;

    if(req.headers.authorization?.startsWith("Bearer ")){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        throw ApiError.unAuthorized("not authorize");
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
     if (!user) throw ApiError.unAuthorized("User no longer exists");

    req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
  next();
};

// Optional authentication: sets req.user if valid token provided, but does not block guests
const optionalAuthenticate = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id);
        if (user) {
            req.user = {
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email,
            };
        }
    } catch {
        // Token invalid or expired, continue as guest
    }
    next();
};

// Higher-order function — returns middleware configured with allowed roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        "You do not have permission to perform this action",
      );
    }
    next();
  };
};

export { authenticate, optionalAuthenticate, authorize };
