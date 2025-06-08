import { Router } from "express";
import { 
    loginController, 
    logoutController, 
    registerController, 
    verifyUserController, 
    resendVerificationController,
    isAuthenticated,
    refreshTokenController,
    sendResetPasswordOTPController,
    verifyForgotPasswordOTPController,
    setNewPassword,
    getUserDetailsController,
    getUserDetailsByEmailController,
    depositMoneyToUserWalletController,
    updateUserDetailsController,
    getDayWiseWalletStatsController,
} from "../controllers/user.controller.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const userRoutes = Router();

userRoutes.post("/register", registerController);
userRoutes.get("/verify-user/:token", verifyUserController);
userRoutes.post("/resend-verification", resendVerificationController);
userRoutes.post("/login", loginController);
userRoutes.post("/logout", logoutController);
userRoutes.get("/is-auth", isAuthenticated);
userRoutes.post("/refresh-token", refreshTokenController);
userRoutes.post("/reset-password", sendResetPasswordOTPController)
userRoutes.post("/verify-reset-password-otp", verifyForgotPasswordOTPController)
userRoutes.post("/set-new-password", setNewPassword)
userRoutes.get("/my-details", AuthMiddleware, getUserDetailsController);
userRoutes.get("/get-user-by-email", getUserDetailsByEmailController)
userRoutes.post("/deposit-money", AuthMiddleware, depositMoneyToUserWalletController)
userRoutes.patch("/update-user-details", AuthMiddleware, updateUserDetailsController)
userRoutes.get("/get-day-wise-wallet-stats", AuthMiddleware, getDayWiseWalletStatsController)

export default userRoutes;
