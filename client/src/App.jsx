import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MenuForSmAndMd from './components/MenuForSmAndMd';
import api from './utils/api';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For sm/md
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get("/api/user/my-details", { withCredentials: true });
        setUser(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <MenuForSmAndMd isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />
      <Sidebar user={user}/>
      <div className="flex flex-col flex-1 bg-[#1A2C38]">
        <Navbar setIsSidebarOpen={setIsSidebarOpen} user={user} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
