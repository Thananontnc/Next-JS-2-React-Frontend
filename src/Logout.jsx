import { useEffect, useState } from "react";
import { useUser } from "./contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Logout() {
    const [isLoading, setIsLoading] = useState(true);
    const { logout } = useUser();

    async function onLogout() {
        await logout();
        setIsLoading(false);
    }

    useEffect(() => {
        onLogout();
    }, []);

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#34d399' }}>
                <h3>Logging out...</h3>
            </div>
        );
    } else {
        return <Navigate to="/login" replace />;
    }
}
