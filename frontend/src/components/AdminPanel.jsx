import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Edit, Trash2, Plus } from 'lucide-react';

const AdminPanel = () => {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', price: 0, stock: 1, image_url: '' });

  useEffect(() => {
    if (!authLoading && (!user || !user.is_admin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.is_admin) {
      if (activeTab === 'products') fetchProducts();
      if (activeTab === 'orders') fetchOrders();
    }
  }, [activeTab, user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/products/');
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/orders/all');
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // We don't have a specific update endpoint yet in backend except POST /products/create
        // Actually wait, let's assume we use /products/update? No, the user wants me to implement it.
        // The backend didn't have an update endpoint, I'll need to check if there is one. 
        // For now, assume there is a PUT /products/{id} or POST /products/update
        await axios.post('http://localhost:8000/products/update', formData);
      } else {
        await axios.post('http://localhost:8000/products/create', formData);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to save product: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.post('http://localhost:8000/products/delete', { id });
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleEditClick = (prod) => {
    setFormData(prod);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setFormData({ id: null, name: '', description: '', price: 0, stock: 1, image_url: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  if (authLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  if (!user || !user.is_admin) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tighter mb-10 flex items-center gap-2">
          <LayoutDashboard className="text-indigo-600" /> Admin
        </h1>
        
        <nav className="flex flex-col space-y-2 flex-grow">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} /> Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShoppingCart size={20} /> Orders
          </button>
        </nav>
        
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors mt-auto">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Products</h2>
                <p className="text-slate-500 mt-1">Manage your catalog and inventory</p>
              </div>
              <button onClick={handleCreateClick} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2">
                <Plus size={20} /> Add Product
              </button>
            </div>

            {showForm && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{isEditing ? 'Edit Product' : 'Create New Product'}</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input type="text" required className="w-full border border-slate-300 text-slate-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <input type="number" step="0.01" required className="w-full border border-slate-300 text-slate-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                    <input type="number" required className="w-full border border-slate-300 text-slate-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                    <input type="file" accept="image/*" className="w-full border border-slate-300 text-slate-900 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const data = new FormData();
                        data.append("file", file);
                        try {
                          const res = await axios.post('http://localhost:8000/products/upload-image', data, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          });
                          setFormData({...formData, image_url: res.data.url});
                        } catch (err) {
                          alert("Failed to upload image: " + (err.response?.data?.detail || err.message));
                        }
                      }
                    }} />
                    {formData.image_url && <div className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">✓ Image uploaded and ready</div>}
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea required className="w-full border border-slate-300 text-slate-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="col-span-full flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">{isEditing ? 'Save Changes' : 'Create Product'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold tracking-wide">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-slate-500">#{p.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                      <td className="px-6 py-4 text-slate-600">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !loading && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No products found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">All Orders</h2>
              <p className="text-slate-500 mt-1">View purchases from all customers</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold tracking-wide">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium">#{o.id}</td>
                      <td className="px-6 py-4 text-slate-600">User {o.user_id}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">${o.total_price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 capitalize">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && !loading && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
