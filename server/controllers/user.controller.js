import { comparePasswords, hashPassword } from "../utils/passwordHash.js";
import userModel from "../models/user.model.js";
import transporter from "../config/nodemailer.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateJwtTokens.js";
import jwt from "jsonwebtoken"
import { generateOTP } from "../utils/generateOTP.js";
import verifyEmail from "../email/verifyEmail.js";
import resetPassOTPEmail from "../email/resetPasswordOTPEmail.js";
import { accessCookieOptions, refreshCookieOptions } from "../utils/cookieOptions.js";
import transactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";
import betModel from "../models/bet.model.js";

// We are using middelware before this to check Au
const SECRET_KEY = process.env.SECRET_KEY_ACCESS_TOKEN;
const REFRESH_KEY = process.env.SECRET_KEY_REFRESH_TOKEN;

//register new user 
export const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists."
            });
        }

        const hashedPassword = await hashPassword(password);

        // Generate a unique verification token
        const verificationToken = generateVerificationToken();

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            provider: "local",
            isVerified: false,
            verificationToken,
            verificationTokenExpiration: Date.now() + 3600000
        });
        // console.log("About to save user:", newUser);

        const savedUser = await newUser.save();
        // console.log("Saved user:", savedUser);

        // Send the verification link with the token
        const verifyLink = `${process.env.CLIENT_URL}/verify-user?token=${verificationToken}`;

        // Send the verification email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Verify your email - Auth Template",
            html: verifyEmail(name, verifyLink)
        };

        await transporter.sendMail(mailOptions);

        // Generate access and refresh tokens right after registration
        const accessToken = generateAccessToken(savedUser);
        const refreshToken = generateRefreshToken(savedUser);

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(201).json({
            message: "User registered. Please check your email to verify your account.",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//verify user from verification email redirect
export const verifyUserController = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Verification token is missing."
        });
    }

    try {
        // Find the user by the verification token
        const user = await userModel.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid tokens."
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified."
            })
        }

        // Check if the token has expired
        if (user.verificationTokenExpiration < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Verification token has expired."
            });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verificationToken = undefined
        user.verificationTokenExpiration = undefined
        await user.save();

        // Generate new tokens after verification (for refreshed authentication)
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Cookie options
        // const accessCookieOptions = {
        //     httpOnly: true,
        //     secure: isProd,
        //     sameSite: isProd ? "None" : "Lax",
        //     path: "/", //ensures cookie is available across all routes
        //     maxAge: 15 * 60 * 1000, // 15 minutes
        // };
        
        // const refreshCookieOptions = {
        //     httpOnly: true,
        //     secure: isProd,
        //     sameSite: isProd ? "None" : "Lax",
        //     path: "/",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // };

        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Account verified successfully."
        })

        // Option 1: Redirect to frontend (Home page after successful verification)
        // res.redirect(`${process.env.CLIENT_URL}/`);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//login user
export const loginController = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not registered with this email!",
                success: false
            })
        }

        const isPasswordMatch = await comparePasswords(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid credentials! Please check your email or password.",
                success: false,
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set the cookies
        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        return res.status(200).json({
            message: "Login successfully.",
            success: true,
            data: {
                user,
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
        })
    }
}

//logout user
export const logoutController = async (req, res) => {
    try {
        // Clear both accessToken and refreshToken cookies from the client's browser
        res.clearCookie("accessToken", accessCookieOptions);

        res.clearCookie("refreshToken", refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

//resend email verification email
export const resendVerificationController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified."
            });
        }

        // Generate a new verification token
        const newToken = generateVerificationToken();
        const verifyLink = `${process.env.CLIENT_URL}/verify-user?token=${newToken}`;

        // Save the token and its expiration date to the user model (optional step)
        user.verificationToken = newToken;
        user.verificationTokenExpiration = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // Send the new verification email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Verify your email - Auth Template",
            html: `
                <h1>Hi ${user.name},</h1>
                <p>Please verify your email by clicking the button below:</p>
                <a href="${verifyLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "A new verification email has been sent. Please check your inbox."
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export const isAuthenticated = async (req, res) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // If no tokens at all
    if (!accessToken && !refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No tokens found",
        });
    }

    // Step 1: Try to verify access token
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, SECRET_KEY);
            return res.status(200).json({
                success: true,
                data: {
                    id: decoded.id,
                    email: decoded.email,
                },
            });
        } catch (accessError) {
            // If token is invalid for any reason other than expiry, reject
            if (!(accessError instanceof jwt.TokenExpiredError)) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid access token",
                    error: accessError.message,
                });
            }
            // If token expired, move to refresh token logic
        }
    }

    // Step 2: Use refresh token to generate new access token
    if (refreshToken) {
        try {
            const refreshDecoded = jwt.verify(refreshToken, REFRESH_KEY);

            const newAccessToken = generateAccessToken({
                id: refreshDecoded.id,
                email: refreshDecoded.email,
            });

            res.cookie("accessToken", newAccessToken, accessCookieOptions);

            return res.status(200).json({
                success: true,
                data: {
                    id: refreshDecoded.id,
                    email: refreshDecoded.email,
                    refreshed: true,
                },
            });
        } catch (refreshError) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
                error: refreshError.message,
            });
        }
    }

    // Step 3: All token validation failed
    return res.status(401).json({
        success: false,
        message: "Unauthorized: token invalid or expired",
    });
};

//refresh access token if access token is expired
export const refreshTokenController = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh Token not found",
        });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.SECRET_KEY_REFRESH_TOKEN
        );
        // console.log(decodedToken)
        const user = await userModel.findById(decodedToken?.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token.",
            });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY_ACCESS_TOKEN,
            { expiresIn: "15m" }
        );

        // Set new access token in cookies
        res.cookie("accessToken", newAccessToken, accessCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            accessToken: newAccessToken,
        });

    } catch (error) {
        console.error("Error in refreshing token:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
            error: error.message,
        });
    }
};

//send reset password otp to mail
export const sendResetPasswordOTPController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email address is required."
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found with this email."
            });
        }

        const resetOTP = generateOTP();

        user.passResetOtp = resetOTP;
        user.passResetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await user.save();

        // Send the password reset OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Reset Your Password - OTP Inside",
            html: resetPassOTPEmail(user, resetOTP)
        };

        await transporter.sendMail(mailOptions);


        return res.status(200).json({
            success: true,
            message: "OTP sent to your email address.",
            // only include this for testing, remove in production:
            otp: process.env.NODE_ENV === "development" ? resetOTP : undefined
        });

    } catch (error) {
        console.error("Error in sending reset OTP:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending reset OTP.",
            error: error.message
        });
    }
};

//verify forgot password OTP
export const verifyForgotPasswordOTPController = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const otp = req.body.otp?.trim();

        if (!email || !otp) {
            return res.status(400).json({
                message: "Please provide both Email and OTP!",
                success: false
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email does not exist!",
                success: false
            });
        }

        if (!user.passResetOtp || !user.passResetOtpExpiresAt) {
            return res.status(400).json({
                message: "No OTP request found. Please request a new OTP.",
                success: false
            });
        }

        if (user.passResetOtpExpiresAt < Date.now()) {
            return res.status(400).json({
                message: "The OTP has expired. Please request a new one to proceed.",
                success: false
            });
        }

        if (otp !== user.passResetOtp) {
            return res.status(400).json({
                message: "The OTP you entered is incorrect. Please check and try again.",
                success: false
            });
        }

        // OTP is correct, clear OTP data and mark verified
        await userModel.updateOne(
            { email },
            {
                $set: {
                    passResetOtp: null,
                    passResetOtpExpiresAt: null,
                    verifiedResetOTP: true
                }
            }
        );

        return res.status(200).json({
            message: "OTP verified successfully.",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false
        });
    }
};

//set new password to user password
export const setNewPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // Check if email and newPassword are provided
    if (!email || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found with this email."
            });
        }

        // Check if OTP is verified
        if (!user.verifiedResetOTP) {
            return res.status(400).json({
                success: false,
                message: "Please verify your OTP first before proceeding with the password reset."
            });
        }

        // Hash the new password securely (ensure you're using a secure hashing function like bcrypt)
        const newHashedPassword = await hashPassword(newPassword);

        // Update the user's password and reset the OTP verification flag
        user.password = newHashedPassword;
        user.verifiedResetOTP = false;  // Reset OTP verification flag to prevent reuse
        await user.save();

        return res.status(200).json({
            message: "Password has been reset successfully.",
            success: true
        });

    } catch (error) {
        // Log the error and return a response with an error message
        console.error("Error resetting password:", error);
        return res.status(500).json({
            message: error.message || "Something went wrong while resetting the password.",
            success: false
        });
    }
}

//Get current loggedIn user details
export const getUserDetailsController = async (req, res) => {
    try {
        const userId = req.user?.id; // this is set in the middleware

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in request context",
            });
        }

        const user = await userModel.findById(userId).select("-password"); // exclude sensitive data

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
        });
    }
};

//get user details by email
export const getUserDetailsByEmailController = async (req, res) => {
    try {
        const {email} = req.body 

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await userModel.findOne({email}).select("-password"); // exclude sensitive data

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
        });
    }
}

export const depositMoneyToUserWalletController = async (req, res) => {
    try {
        const { amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount should be greater than 0."
            });
        }

        const userId = req.user?.id;
        // console.log(userId)
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found."
            });
        }

        user.wallet = (user.wallet || 0) + amount;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Money added to wallet successfully.",
            wallet: user.wallet
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

export const updateUserDetailsController = async (req, res) => {
    try {
        const { name, picture } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User ID missing."
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Update fields only if provided
        if (name) user.name = name;
        if (picture) user.picture = picture;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User details updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture,
                wallet: user.wallet,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

export const getDayWiseWalletStatsController = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Aggregate Transactions
        const transactions = await transactionModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    status: "SUCCESS"
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    netTransaction: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "DEPOSIT"] },
                                "$amount",
                                { $multiply: ["$amount", -1] }
                            ]
                        }
                    }
                }
            }
        ]);

        // 2. Aggregate Bets
        const bets = await betModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    netBetResult: {
                        $sum: {
                            $cond: [
                                { $eq: ["$isWin", true] },
                                { $subtract: ["$winAmount", "$betAmount"] },
                                { $multiply: ["$betAmount", -1] }
                            ]
                        }
                    }
                }
            }
        ]);

        // 3. Merge Maps
        const mergeMap = new Map();

        for (const txn of transactions) {
            mergeMap.set(txn._id, {
                date: txn._id,
                walletChange: txn.netTransaction, 
                netBetResult: 0
            });
        }

        for (const bet of bets) {
            if (mergeMap.has(bet._id)) {
                mergeMap.get(bet._id).netBetResult = bet.netBetResult;
            } else {
                mergeMap.set(bet._id, {
                    date: bet._id,
                    walletChange: 0,
                    netBetResult: bet.netBetResult
                });
            }
        }

        // 4. Sort and compute cumulative values
        const mergedArray = Array.from(mergeMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

        let cumulativeWallet = 0;
        let actualWallet = 0;

        const finalStats = mergedArray.map(entry => {
            cumulativeWallet += entry.walletChange;
            actualWallet += entry.walletChange + entry.netBetResult;

            return {
                date: entry.date,
                walletAmount: cumulativeWallet,
                actualWalletAfterBets: actualWallet,
                netBetResult: entry.netBetResult
            };
        });

        return res.status(200).json(finalStats);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};