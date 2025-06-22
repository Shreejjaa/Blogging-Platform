import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import CreatePost from './pages/CreatePost';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './styles/dark-mode.css';
import AdminDashboard from './pages/AdminDashboard';
import EditProfile from './pages/EditProfile';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/blogs" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/create" element={<ProtectedRoute element={<CreatePost />} />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/edit/:id" element={<ProtectedRoute element={<EditBlog />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} />} />
              <Route path="/search/:keyword" element={<BlogList />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
