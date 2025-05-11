// pages/Home.jsx
import React from "react";
import { useUser } from "../contexts/UserContext";

const Home = () => {
    const { user } = useUser();

    return (
        <div className="p-4 min-h-screen text-white">
            <h1 className="text-xl font-semibold mb-4">Home</h1>

            {user ? (
                <div className="space-y-2">
                    <p><strong>ID:</strong> {user._id}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            ) : (
                <p>User not logged in.</p>
            )}
        </div>
    );
};

export default Home;
