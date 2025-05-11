import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MenuForSmAndMd from './components/MenuForSmAndMd';
import { UserProvider } from './contexts/UserContext';
import { useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden">
        <MenuForSmAndMd isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <Sidebar />
        <div className="flex flex-col flex-1 bg-[#1A2C38]">
          <Navbar setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;
