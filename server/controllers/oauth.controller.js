import axios from "axios";
import userModel from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateJwtTokens.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";

const FRONTEND_URL = process.env.CLIENT_URL;
const SERVER_URL = process.env.SERVER_URL;

const REDIRECT_SUCCESS = `${FRONTEND_URL}/oauth-success`;
const REDIRECT_ERROR = `${FRONTEND_URL}/login?error=true`;

// Google OAuth
export const googleOAuthController = (req, res) => {
    const redirectUri = `${SERVER_URL}/api/auth/google/callback`;

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent"); // forces refresh token

    res.redirect(url.toString());
};

export const googleOAuthCallbackController = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        console.error("No code received in callback");
        return res.redirect(REDIRECT_ERROR);
    }

    try {
        const redirectUri = `${SERVER_URL}/api/auth/google/callback`;

        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token } = tokenResponse.data;

        const { data: userInfo } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, name, picture } = userInfo;
        // console.log(email);
        

        let user = await userModel.findOne({ email });

        if (!user) {
            user = new userModel({
                email,
                name,
                picture,
                isVerified: true,
                password: null,
                provider: "google",
                verificationToken: undefined,
                verificationTokenExpiration: undefined
            });

            await user.save();
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.redirect(REDIRECT_SUCCESS);
    } catch (err) {
        console.error("Google OAuth Error:", err.message);
        return res.redirect(REDIRECT_ERROR);
    }
};

// GitHub OAuth
export const githubOAuthController = (req, res) => {
    const redirectUri = `${process.env.SERVER_URL}/api/auth/github/callback`;
    const url = new URL("https://github.com/login/oauth/authorize");

    url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", "user:email");

    res.redirect(url.toString());
};

export const githubOAuthCallbackController = async (req, res) => {
    console.log("GitHub callback hit ✅");
    console.log("Query code:", req.query.code);

    const code = req.query.code;
    if (!code) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=true`);
    }

    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const access_token = tokenResponse.data.access_token;

        // Step 2: Fetch GitHub user profile
        const { data: githubUser } = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // Step 3: Fetch user's verified email
        const { data: emails } = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const primaryEmail = emails.find(email => email.primary && email.verified)?.email;

        if (!primaryEmail) {
            throw new Error("No verified primary email found.");
        }

        // Step 4: Check if user exists or create new user
        let user = await userModel.findOne({ email: primaryEmail });

        if (!user) {
            user = new userModel({
                email: primaryEmail,
                name: githubUser.name || githubUser.login,
                picture: githubUser.avatar_url,
                isVerified: true,
                password: null,
                provider: "github",
                verificationToken: undefined,
                verificationTokenExpiration: undefined
            });

            await user.save();
        }

        // Step 5: Generate and set tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
    } catch (err) {
        console.error("GitHub OAuth Error:", err.message);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=true`);
    }
};

