import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestApi from './TestApi';


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
    <div>
      <h1>Home Page</h1>
      <p>Message: {message}</p>
      <Link to="/test_api">
        <button>Go to Test API</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test_api" element={<TestApi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
