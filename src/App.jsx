import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TestApi from './TestApi';
import './App.css';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
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
