import { Routes, Route, Navigate } from 'react-router-dom';
import TestApi from './TestApi';
import ItemManagement from './ItemManagement';
import UserManagement from './UserManagement';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import Navigation from './Navigation';
import RequireAuth from './middleware/RequireAuth';
import { useUser } from './contexts/UserProvider';
import './Navigation.css'; // Ensure proper styling is loaded

function HomeRedirect() {
  const { user } = useUser();
  if (user.isLoggedIn) {
    return <Navigate to="/items" replace />;
  }
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Navigation />
      <div className="main-content" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/test_api" element={<TestApi />} />

          <Route path="/items" element={
            <RequireAuth>
              <ItemManagement />
            </RequireAuth>
          } />

          <Route path="/users" element={
            <RequireAuth>
              <UserManagement />
            </RequireAuth>
          } />

          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
