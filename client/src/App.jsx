import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MenuForSmAndMd from './components/MenuForSmAndMd';
import Wallet from './components/Wallet';
import Footer from './components/Footer';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <>
      {/* Layout Container */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Mobile/Tablet Sidebar Menu */}
        <MenuForSmAndMd isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 bg-[#1A2C38]">
          
          {/* Navbar */}
          <Navbar 
            setIsSidebarOpen={setIsSidebarOpen} 
            setIsWalletOpen={setIsWalletOpen} 
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>

        {/* Wallet Modal */}
        {isWalletOpen && (
          <Wallet 
            onClose={() => setIsWalletOpen(false)} 
            setIsWalletOpen={setIsWalletOpen} 
          />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
