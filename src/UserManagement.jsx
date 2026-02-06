import { useState, useEffect } from 'react';
import './UserManagement.css';

const API_BASE_URL = 'http://localhost:3000/api/user';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        status: 'ACTIVE'
    });

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${pagination.limit}`);
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data.users || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingUser ? `${API_BASE_URL}/${editingUser._id}` : API_BASE_URL;
        const method = editingUser ? 'PUT' : 'POST';

        // Filter out empty password if editing (so we don't accidentally clear it or hash empty string)
        const payload = { ...formData };
        if (editingUser && !payload.password) {
            delete payload.password;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIsModalOpen(false);
                setEditingUser(null);
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                    firstname: '',
                    lastname: '',
                    status: 'ACTIVE'
                });
                fetchUsers(pagination.page);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username || '',
            password: '', // Do not populate password for edits
            email: user.email || '',
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            status: user.status || 'ACTIVE'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchUsers(pagination.page);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            username: '',
            password: '',
            email: '',
            firstname: '',
            lastname: '',
            status: 'ACTIVE'
        });
        setIsModalOpen(true);
    };

    return (
        <div className="user-container">
            <header className="user-header">
                <h1>User Management</h1>
                <button className="btn-add" onClick={openCreateModal}>+ Add New User</button>
            </header>

            <div className="table-container">
                {loading ? (
                    <div className="loader">Loading users...</div>
                ) : error ? (
                    <div className="error-display">
                        <p>⚠️ {error}</p>
                        <button className="btn-retry" onClick={() => fetchUsers()}>Retry Connection</button>
                    </div>
                ) : users.length > 0 ? (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-name-cell">{user.username}</div>
                                    </td>
                                    <td>{user.firstname} {user.lastname}</td>
                                    <td className="email-cell">{user.email}</td>
                                    <td>
                                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-edit-sm" onClick={() => handleEdit(user)}>Edit</button>
                                            <button className="btn-delete-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">No users found. Start by adding one!</div>
                )}
            </div>

            <div className="pagination">
                <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchUsers(pagination.page - 1)}
                >
                    Prev
                </button>
                <span>Page {pagination.page} of {pagination.totalPages || 1}</span>
                <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchUsers(pagination.page + 1)}
                >
                    Next
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Username"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password {editingUser && '(Leave blank to keep unchanged)'}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingUser}
                                    placeholder="Password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Last Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="SUSPENDED">Suspended</option>
                                    <option value="DELETED">Deleted</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">{editingUser ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
