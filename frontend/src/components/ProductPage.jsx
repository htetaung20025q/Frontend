import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LayoutDashboard, LogOut, Package } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-final-3ouo.onrender.com';

const ProductPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/`);
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/orders/`, {
        items: [{ product_id: productId, quantity: 1 }]
      });
      setMessage("Order placed successfully! We'll ship it soon.");
      fetchProducts();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to place order.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 selection:bg-indigo-100">
      {/* Toast Message */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm">
            <ShoppingBag size={16} className="text-indigo-400" />
            {message}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="container mx-auto px-8 h-24 flex justify-between items-center bg-transparent relative z-10">
        <div className="text-2xl font-black tracking-tighter text-slate-900">LUXE<span className="text-indigo-600">.</span></div>
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-slate-500 hidden md:block">Welcome, {user.username}</span>
              {user.is_admin && (
                <Link to="/admin" className="text-sm font-semibold flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}
              <Link to="/guide" className="text-sm font-semibold flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                Guide
              </Link>
              <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-2">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log In</Link>
              <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-600 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-8 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column */}
          <div className="lg:w-1/2 flex flex-col items-start space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span> New Collection 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Elevate your <br/><span className="text-slate-400 italic font-serif">living space.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-md leading-relaxed">
              Discover our curated collection of premium furniture designed for the modern aesthetic. Uncompromising quality meets timeless design.
            </p>
            <button 
              onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
              className="bg-slate-900 text-white font-medium py-4 px-8 rounded-full hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Shop Collection
            </button>
          </div>
          {/* Right Column (Image with decorative elements) */}
          <div className="lg:w-1/2 relative">
            <div className="absolute top-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60 z-0"></div>
            <div className="absolute -bottom-10 right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-60 z-0"></div>
            <div className="relative z-10 w-full h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop" 
                alt="Modern Lounge Chair" 
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
              {/* Glass overlay text */}
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/30 border border-white/20 p-6 rounded-2xl">
                <h3 className="text-white font-semibold text-lg drop-shadow-md">The Onyx Lounge</h3>
                <p className="text-white/90 text-sm font-medium drop-shadow-md">Handcrafted perfection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section id="collection" className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Curated Pieces</h2>
              <p className="text-slate-500">Hand-selected for your minimalist home.</p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-3xl p-4 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-80 rounded-2xl bg-slate-100 overflow-hidden mb-6">
                    {product.stock <= 0 && (
                       <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                         Sold Out
                       </div>
                    )}
                    <img 
                      src={product.image_url || `https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=600&auto=format&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Quick Add Button overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <button 
                        disabled={product.stock <= 0}
                        onClick={() => handleBuyNow(product.id)}
                        className={`w-full py-4 rounded-xl font-bold transition-all transform translate-y-4 group-hover:translate-y-0 shadow-xl flex items-center justify-center gap-2 ${
                          product.stock > 0 
                          ? "bg-slate-900 text-white hover:bg-indigo-600" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed hidden"
                        }`}
                      >
                        <ShoppingBag size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="px-2 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{product.name}</h3>
                      <span className="text-lg font-medium text-slate-900">${(product.price || 0).toFixed(2)}</span>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                    <div className="flex items-center text-xs font-medium text-slate-400 mt-auto">
                      <span className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && products.length === 0 && (
            <div className="py-24 text-center">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products yet</h3>
              <p className="text-slate-500">Check back later or add some via the admin panel.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <div className="container mx-auto px-8">
          <p>&copy; 2026 LUXE E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
