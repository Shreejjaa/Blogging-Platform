import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import './styles/dark-mode.css';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user')); // Define user here

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/blogs" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<ProtectedRoute element={<CreatePost />} />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/edit/:id" element={<ProtectedRoute element={<EditBlog />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/admin" element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
