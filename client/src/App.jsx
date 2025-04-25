import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <Outlet /> {/* This is where child routes will be rendered */}
    </div>
  );
}

export default App;
