import { Routes, Route, Link } from 'react-router-dom';
import TestApi from './TestApi';
import ItemManagement from './ItemManagement';
import UserManagement from './UserManagement';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import RequireAuth from './middleware/RequireAuth';
import { useEffect, useState } from 'react';

function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f172a',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1>Welcome to Inventory App</h1>
      <p>Backend Message: {message}</p>
      <nav style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/items" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 'bold' }}>Manage Inventory</Link>
        <Link to="/users" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 'bold' }}>Manage Users</Link>
        <Link to="/login" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        <Link to="/profile" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold' }}>Profile</Link>
        <Link to="/test_api" style={{ color: '#94a3b8', textDecoration: 'none' }}>Test API</Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test_api" element={<TestApi />} />
      <Route path="/items" element={<ItemManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={
        <RequireAuth>
          <Logout />
        </RequireAuth>
      } />
      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
    </Routes>
  );
}

export default App;
