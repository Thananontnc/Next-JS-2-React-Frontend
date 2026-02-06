import { useState, useEffect } from 'react';
import './ItemManagement.css';

const API_BASE_URL = 'http://localhost:3000/api/item';

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        itemCategory: '',
        itemPrice: '',
        status: 'ACTIVE'
    });

    const fetchItems = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${pagination.limit}`);
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to fetch items');
            }
            const data = await response.json();
            setItems(data.items || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingItem ? `${API_BASE_URL}/${editingItem._id}` : API_BASE_URL;
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ itemName: '', itemCategory: '', itemPrice: '', status: 'ACTIVE' });
                fetchItems(pagination.page);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error saving item:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            itemName: item.itemName,
            itemCategory: item.itemCategory,
            itemPrice: item.itemPrice,
            status: item.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchItems(pagination.page);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const openCreateModal = () => {
        setEditingItem(null);
        setFormData({ itemName: '', itemCategory: '', itemPrice: '', status: 'ACTIVE' });
        setIsModalOpen(true);
    };

    return (
        <div className="item-container">
            <header className="item-header">
                <h1>Inventory Management</h1>
                <button className="btn-add" onClick={openCreateModal}>+ Add New Item</button>
            </header>

            <div className="table-container">
                {loading ? (
                    <div className="loader">Loading inventory...</div>
                ) : error ? (
                    <div className="error-display">
                        <p>⚠️ {error}</p>
                        <button className="btn-retry" onClick={() => fetchItems()}>Retry Connection</button>
                    </div>
                ) : items.length > 0 ? (
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="item-name-cell">{item.itemName}</div>
                                    </td>
                                    <td><span className="category-pill">{item.itemCategory}</span></td>
                                    <td className="price-cell">${parseFloat(item.itemPrice).toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-edit-sm" onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">No items found. Start by adding one!</div>
                )}
            </div>

            <div className="pagination">
                <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchItems(pagination.page - 1)}
                >
                    Prev
                </button>
                <span>Page {pagination.page} of {pagination.totalPages || 1}</span>
                <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchItems(pagination.page + 1)}
                >
                    Next
                </button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Wireless Mouse"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="itemCategory"
                                    value={formData.itemCategory}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Electronics"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="itemPrice"
                                    value={formData.itemPrice}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="0.00"
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
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="OUT_OF_STOCK">Out of Stock</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-save">{editingItem ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemManagement;
