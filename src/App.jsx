import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestApi from './TestApi';
import ItemManagement from './ItemManagement';

import { useEffect, useState } from 'react';

function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch('http://localhost:3001/api/hello')
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
      <nav style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <Link to="/items" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 'bold' }}>Manage Inventory</Link>
        <Link to="/test_api" style={{ color: '#94a3b8', textDecoration: 'none' }}>Test API</Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test_api" element={<TestApi />} />
        <Route path="/items" element={<ItemManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
