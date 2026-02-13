import { useUser } from "./contexts/UserProvider";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css';

export default function Profile() {
    const { user, logout } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const [hasImage, setHasImage] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    async function onUpdateImage() {
        const file = fileInputRef.current?.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_URL}/api/user/profile/image`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (response.ok) {
                alert("Image updated successfully.");
                fetchProfile();
            } else {
                const errorData = await response.json();
                alert(`Failed to update image: ${errorData.message}`);
            }
        } catch (err) {
            alert("Error uploading image.");
        }
    }

    async function fetchProfile() {
        const result = await fetch(`${API_URL}/api/user/profile`, {
            credentials: "include"
        });

        if (result.status == 401) {
            logout();
        } else {
            const data = await result.json();
            if (data.profileImage != null) {
                console.log("has image...");
                setHasImage(true);
            }
            console.log("data: ", data);
            setIsLoading(false);
            setData(data);
        }
    }

    function handleLogout() {
        navigate('/logout');
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>User Profile</h2>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
                {isLoading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="profile-content">
                        <div className="profile-image-section">
                            {hasImage && (
                                <img
                                    src={`${API_URL}${data.profileImage}`}
                                    alt="Profile"
                                    className="profile-image"
                                />
                            )}
                            {!hasImage && (
                                <div className="no-image-placeholder">No Profile Image</div>
                            )}
                        </div>

                        <div className="profile-info">
                            <div className="info-row">
                                <span className="info-label">ID:</span>
                                <span className="info-value">{data._id}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{data.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Username:</span>
                                <span className="info-value">{data.username}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">First Name:</span>
                                <span className="info-value">{data.firstname}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Last Name:</span>
                                <span className="info-value">{data.lastname}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Status:</span>
                                <span className={`status-badge ${data.status?.toLowerCase()}`}>{data.status}</span>
                            </div>
                        </div>

                        <div className="image-upload-section">
                            <label htmlFor="profileImage" className="upload-label">Update Profile Image:</label>
                            <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                ref={fileInputRef}
                                accept="image/*"
                                className="file-input"
                            />
                            <button onClick={onUpdateImage} className="upload-btn">Upload Image</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
