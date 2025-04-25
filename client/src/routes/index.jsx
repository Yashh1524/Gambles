import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import App from "../App.jsx"
import ProtectedRedirect from "../components/ProtectedRedirect.jsx"
import ForgotPassword from "../pages/ForgotPassword.jsx";
import VerifyResetPasswordOTP from "../pages/VerifyResetPasswordOTP.jsx";
import SetNewPassword from "../pages/SetNewPassword.jsx";
import OauthSuccess from "../components/OauthSuccess.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "verify-user", element: <VerifyEmail /> },
            {
                path: "register",
                element: (
                    <ProtectedRedirect>
                        <RegisterPage />
                    </ProtectedRedirect>
                ) 
                ,
            },
            {
                path: "login",
                element: (
                    <ProtectedRedirect>
                        <LoginPage />
                    </ProtectedRedirect>
                ) 
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "/verify-forgot-password-otp",
                element: <VerifyResetPasswordOTP />
            },
            {
                path: "/set-new-password",
                element: <SetNewPassword />
            },
            { path: "oauth-success", element: <OauthSuccess /> }
        ],
    },
]);

export default router;
