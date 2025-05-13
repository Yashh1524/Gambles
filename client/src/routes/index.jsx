import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRedirect from "../components/ProtectedRedirect.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import VerifyResetPasswordOTP from "../pages/VerifyResetPasswordOTP.jsx";
import SetNewPassword from "../pages/SetNewPassword.jsx";
import OauthSuccess from "../components/OauthSuccess.jsx";
import Profile from "@/pages/Profile.jsx";
import DepositMoney from "@/pages/DepositMoney.jsx";
import WithdrawMoney from "@/pages/WithdrawMoney.jsx";
import Games from "@/pages/Games.jsx";
import MinesGame from "@/pages/Games/MinesGame.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "verify-user", element: <VerifyEmail /> },
            // {
            //     path: "register",
            //     element: (
            //         <ProtectedRedirect>
            //             <RegisterPage />
            //         </ProtectedRedirect>
            //     ),
            // },
            // {
            //     path: "login",
            //     element: (
            //         <ProtectedRedirect>
            //             <LoginPage />
            //         </ProtectedRedirect>
            //     ),
            // },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "verify-forgot-password-otp", element: <VerifyResetPasswordOTP /> },
            { path: "set-new-password", element: <SetNewPassword /> },
            { path: "oauth-success", element: <OauthSuccess /> },
            { path: "profile", element: <Profile /> },
            { path: "deposit-money", element: <DepositMoney /> },
            { path: "withdraw-money", element: <WithdrawMoney /> },
            { path: "games", element: <Games /> },
            { path: "games/mines", element: <MinesGame /> },
        ],
    },
    {
        path: "register",
        element: (
            <ProtectedRedirect>
                <RegisterPage />
            </ProtectedRedirect>
        ),
    },
    {
        path: "login",
        element: (
            <ProtectedRedirect>
                <LoginPage />
            </ProtectedRedirect>
        ),
    },
]);

export default router;
