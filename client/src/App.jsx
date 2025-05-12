import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MenuForSmAndMd from './components/MenuForSmAndMd';
import { useState } from 'react';
import Wallet from './components/Wallet';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <MenuForSmAndMd isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#1A2C38]">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} setIsWalletOpen={setIsWalletOpen}/>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
      {
        isWalletOpen && (
          <Wallet onClose={() => setIsWalletOpen(false)} setIsWalletOpen={setIsWalletOpen}/> 
        )
      }
    </div>
  );
}

export default App;
