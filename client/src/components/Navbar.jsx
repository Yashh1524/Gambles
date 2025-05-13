import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navbar({ setIsSidebarOpen, setIsWalletOpen }) {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <nav className="flex items-center justify-between bg-[#1A2C38] text-white px-4 py-2 h-[8vh] shadow-md w-full">
            {/* Left: Sidebar toggle + Logo */}
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden focus:outline-none"
                    onClick={() => setIsSidebarOpen(prev => !prev)}
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold whitespace-nowrap">My App</h1>
            </div>

            {/* Center: Auth Buttons (on mobile) */}
            {!user && (
                <div className="flex gap-2 lg:hidden">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </div>
            )}

            {/* Right: Wallet + Profile (if logged in) */}
            {user && (
                <div className="flex items-center gap-3">
                    {/* Wallet Box */}
                    <div className="flex items-center rounded-md overflow-hidden shadow-sm text-sm">
                        <div className="bg-[#071824] px-3 py-1 font-semibold text-white">
                            ₹{Number(user.wallet).toFixed(2)}
                        </div>
                        <button
                            onClick={() => setIsWalletOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-white font-medium transition"
                        >
                            Wallet
                        </button>
                    </div>

                    {/* Profile Icon */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-1 rounded-full hover:bg-[#0e1d28] transition"
                    >
                        <User className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
