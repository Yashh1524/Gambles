import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY_ACCESS_TOKEN, 
        { expiresIn: "15m" }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: "7d" }
    );
};
