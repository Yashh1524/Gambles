import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar({ setIsSidebarOpen, user }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(prev => !prev)}>
                <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">My App</h1>

            {!user && (
                <div className="space-x-2 lg:hidden">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </div>
            )}

            {user && <p className="text-gray-600 lg:hidden">Hi, {user.name}</p>}
        </div>
    );
}

export default Navbar;
