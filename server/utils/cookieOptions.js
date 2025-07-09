// config/cookieOptions.js
const isProd = process.env.NODE_ENV === "production";

export const accessCookieOptions = {
    httpOnly: true,
    secure: isProd, // Only send cookie over HTTPS in production
    sameSite: isProd ? "None" : "Lax", // For cross-site cookies
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
};

export const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd, // Only send cookie over HTTPS in production
    sameSite: isProd ? "None" : "Lax", // For cross-site cookies
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
