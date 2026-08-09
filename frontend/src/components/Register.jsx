import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      if (Array.isArray(errorDetail)) {
        setError(errorDetail[0]?.msg || "Registration failed");
      } else {
        setError(errorDetail || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="bg-slate-800 p-8 rounded-none border border-slate-700 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create an Account</h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              required
              minLength={5}
              className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 focus:outline-none focus:border-yellow-400 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-yellow-400 text-black font-bold py-3 mt-4 hover:bg-yellow-500 transition-colors rounded-none"
          >
            Register
          </button>
        </form>
        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account? <Link to="/login" className="text-yellow-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
