import { Menu } from 'lucide-react';

function Navbar({ setIsSidebarOpen }) {
    return (
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
            {/* Hamburger for small screens */}
            <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(prev => !prev)}
            >
                <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">My App</h1>
        </div>
    );
}

export default Navbar;
