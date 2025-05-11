import { X, ChevronsLeft, ChevronsRight } from 'lucide-react';

function Sidebar({ isOpen, setIsOpen }) {
    const sidebarClasses = `
    bg-white h-full shadow-lg transition-all duration-300
    ${isOpen ? 'w-64' : 'w-0'}
    fixed top-0 left-0 z-50 transform lg:relative lg:z-auto
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

    return (
        <>
            {/* Overlay for small screens */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={sidebarClasses}>
                {/* Mobile close button */}
                <div className="flex items-center justify-between p-4 border-b lg:hidden">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sidebar content */}
                {isOpen && (
                    <nav className="p-4 space-y-4">
                        <a href="#" className="block text-gray-700 hover:text-black">Dashboard</a>
                        <a href="#" className="block text-gray-700 hover:text-black">Profile</a>
                        <a href="#" className="block text-gray-700 hover:text-black">Settings</a>
                    </nav>
                )}

                {/* Toggle button on right border (large screens only) */}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="hidden lg:flex items-center justify-center absolute top-1/2 right-[-25px] transform -translate-y-1/2 w-6 h-12 bg-white border border-gray-300 rounded-r-md shadow-md z-50"
                >
                    {isOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
                </button>
            </aside>
        </>
    );
}


export default Sidebar;
