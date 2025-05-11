import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.jsx';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={router} />
    <Toaster />
  </UserProvider>
);
