import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OauthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        toast.success("Login successful!");
        navigate("/"); // or navigate to dashboard or profile
    }, [navigate]);

    return null;
}
