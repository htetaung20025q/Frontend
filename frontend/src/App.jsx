import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductPage from './components/ProductPage';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import UserGuide from './components/UserGuide';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/guide" element={<UserGuide />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
