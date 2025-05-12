import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navbar({ setIsSidebarOpen, setIsWalletOpen }) {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between bg-[#1A2C38] p-4 shadow-xl text-white">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(prev => !prev)}>
                <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">My App</h1>

            {/* Wallet + Profile section for logged-in users */}
            {user && (
                <div className="flex items-center gap-4">
                    {/* Wallet UI */}
                    <div className="flex items-center rounded-md overflow-hidden shadow-md">
                        <div className="bg-[#071824] text-white font-semibold text-sm px-4 py-2">
                            ₹{Number(user.wallet).toFixed(2)}
                        </div>
                        <button
                            onClick={() => setIsWalletOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2"
                        >
                            Wallet
                        </button>
                    </div>
                </div>
            )}

            {/* Auth buttons for guests */}
            {!user ? (
                <div className="space-x-2 lg:hidden">
                    <button onClick={() => navigate("/login")} className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800">
                        Login
                    </button>
                    <button onClick={() => navigate("/register")} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Register
                    </button>
                </div>
            ) : (
                    <div>
                        {/* Profile Icon */}
                        <button onClick={() => navigate('/profile')}>
                            <User className="w-6 h-6 text-white" />
                        </button>
                    </div>
            )}

            {/* Greet user below profile on mobile */}
            {user && <p className="text-gray-300 text-sm lg:hidden">Hi, {user.name}</p>}
        </div>
    );
}

export default Navbar;
