import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Users, ShoppingBag, Edit, Trash2, PlusCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Product Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', description: '', image: '', stock: ''
    });

    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            if (activeTab === 'products') {
                const { data } = await axios.get('/api/products');
                setProducts(data);
            } else if (activeTab === 'orders') {
                const { data } = await axios.get('/api/orders', config);
                setOrders(data);
            } else if (activeTab === 'users') {
                const { data } = await axios.get('/api/users', config);
                setUsersList(data);
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
        }
        setLoading(false);
    };

    const handleProductDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/products/${id}`, config);
                fetchData();
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (isEditing) {
                await axios.put(`/api/products/${currentProduct.id}`, formData, config);
            } else {
                await axios.post('/api/products', formData, config);
            }
            setIsEditing(false);
            setCurrentProduct(null);
            setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '' });
            fetchData();
        } catch (error) {
            alert('Error saving product');
        }
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
            stock: product.stock
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">Admin Dashboard</h2>
                <p className="mt-2 text-sm text-gray-500 font-medium">Manage your store's collection, orders, and users.</p>
            </div>

            <div className="flex border-b border-gray-200 mb-8 space-x-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest flex items-center transition-colors ${activeTab === 'products' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                >
                    <Package className="mr-2 h-5 w-5" /> Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest flex items-center transition-colors ${activeTab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                >
                    <ShoppingBag className="mr-2 h-5 w-5" /> Orders
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 text-xs font-bold uppercase tracking-widest flex items-center transition-colors ${activeTab === 'users' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                >
                    <Users className="mr-2 h-5 w-5" /> Users
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {/* PRODUCTS TAB */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="mb-6 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">Product Management</h3>
                                <button
                                    onClick={() => { setIsEditing(false); setCurrentProduct(null); setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '' }); }}
                                    className="bg-black text-white px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition flex items-center"
                                >
                                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
                                </button>
                            </div>

                            {/* Product Form */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                                <h4 className="font-bold text-lg mb-4">{isEditing ? 'Edit Product' : 'Create New Product'}</h4>
                                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                        <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                                            <option value="">Select a category</option>
                                            <option value="Backpacks">Backpacks</option>
                                            <option value="Duffels">Duffels</option>
                                            <option value="Messenger">Messenger</option>
                                            <option value="Totes">Totes</option>
                                            <option value="Slings">Slings</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                                        <input required type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input required type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white" />
                                    </div>
                                    <div className="flex space-x-3 sm:col-span-2">
                                        <button type="submit" className="bg-black text-white px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition">
                                            {isEditing ? 'Update Product' : 'Add Product'}
                                        </button>
                                        {isEditing && (
                                            <button type="button" onClick={cancelEdit} className="bg-white text-black border border-black px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stock</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((p) => (
                                            <tr key={p.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.id}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-black">{p.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{p.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.stock}</td>
                                                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => openEditModal(p)} className="text-black hover:text-gray-500 mr-4"><Edit className="h-4 w-4 inline" /></button>
                                                    <button onClick={() => handleProductDelete(p.id)} className="text-black hover:text-red-500"><Trash2 className="h-4 w-4 inline" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Global Order Management</h3>
                            <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest"> ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Paid</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Delivered</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((o) => (
                                            <tr key={o.id}>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-600 text-right">#{o.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.userName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{o.createdAt.substring(0, 10)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{parseFloat(o.totalPrice).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {o.isPaid ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {o.isDelivered ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">User Accounts</h3>
                            <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {usersList.map((u) => (
                                            <tr key={u.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="text-sm text-black">{u.name}</div>
                                                    <div className="text-sm text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-none uppercase tracking-widest ${u.isAdmin === 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                        {u.isAdmin === 1 ? 'Admin' : 'Customer'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
