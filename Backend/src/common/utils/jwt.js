import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET || "dev_jwt_access_secret_key_123456789";
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || "dev_jwt_refresh_secret_key_123456789";

const generateAccessToken=(Payload)=>{
    return jwt.sign(Payload, getAccessSecret(),{
        expiresIn : process.env.ACCESS_SECRET_EXPIRES || "15m"
    });
};

const verifyAccessToken=(token)=>{
    return jwt.verify(token, getAccessSecret());
};

const generateRefreshToken=(payload)=>{
    return jwt.sign(payload, getRefreshSecret(),{
       expiresIn : process.env.REFRESH_SECRET_EXPIRES || "7d",
        jwtid: crypto.randomUUID(),
    })
};


const verifyRefreshToken=(token)=>{
    return jwt.verify(token, getRefreshSecret())
};


const generateToken=()=>{
    const rawToken=crypto.randomBytes(32).toString('hex')
    const hashedToken=crypto.createHash("sha256").update(rawToken).digest('hex')

    return {rawToken, hashedToken}
}

export {generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateToken}