import { Link, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserProvider';
import './Navigation.css';

export default function Navigation() {
    const { user } = useUser();
    const location = useLocation();

    // Hide navigation on login page if not logged in (optional, but cleaner)
    // Actually, usually nice to have a minimal nav or just logo. Let's keep it simple.

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Inventory App</Link>
            </div>
            <div className="nav-links">
                {user.isLoggedIn ? (
                    <>
                        <Link to="/items" className={location.pathname === '/items' ? 'active' : ''}>Inventory</Link>
                        <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>Users</Link>
                        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                        <Link to="/logout" className="logout-link">Logout</Link>
                    </>
                ) : (
                    <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
                )}
            </div>
        </nav>
    );
}
