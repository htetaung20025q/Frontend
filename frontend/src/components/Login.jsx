import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="bg-slate-800 p-8 rounded-none border border-slate-700 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-sky-400 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-sky-400 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-sky-400 text-black font-bold py-3 mt-4 hover:bg-sky-500 transition-colors rounded-none"
          >
            Sign In
          </button>
        </form>
        <p className="text-slate-400 text-sm text-center mt-6">
          Don't have an account? <Link to="/register" className="text-sky-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
