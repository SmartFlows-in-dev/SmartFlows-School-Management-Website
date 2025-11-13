import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState({ email: '', password: '', role: 'student' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  // Role self-check (for safety)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
          console.log('Role mismatch for admin dashboard, redirecting');
          localStorage.clear();
          navigate('/admin-login');
          return;
        }
      } catch (err) {
        console.error('User parse error:', err);
        localStorage.clear();
        navigate('/admin-login');
        return;
      }
    } else {
      navigate('/admin-login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Admin dashboard useEffect starting');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin-login');
        return;
      }
      try {
        console.log('Fetching admin dashboard...');
        const response = await fetch('https://smartflows-school-management-website.onrender.com/api/admin/dashboard', {
//  const response = await fetch(' http://localhost:5000/api/admin/dashboard', {
         
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Dashboard fetch failed');
        setData(result);
        console.log('Admin dashboard loaded:', result);
      } catch (err) {
        console.error('Admin dashboard error:', err);
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('Admin access')) {
          localStorage.clear();
          navigate('/admin-login');
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://smartflows-school-management-website.onrender.com/api/admin/create-user', {
          //  const response = await fetch('http://localhost:5000/api/admin/create-user', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      alert(`User created: ${createForm.email} (Role: ${createForm.role}). They can login with temp password.`);
      setCreateForm({ email: '', password: '', role: 'student' });
    } catch (err) {
      console.error('Create user error:', err);
      setCreateError(err.message);
    }
    setCreateLoading(false);
  };

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const toggleCreatePassword = () => {
    setShowCreatePassword(!showCreatePassword);
  };

  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const canCreateAdmin = currentUser?.role === 'admin';  // Protect admin creation

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error: {error}. <button onClick={() => navigate('/admin-login')}>Back to Login</button></div>;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Bright Future Academy - Admin Panel</h1>
        <div className="user-info">
          <span>Welcome, {data?.user?.email || 'Admin'}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{data?.stats?.totalStudents || 1250}</p>
          </div>
          <div className="stat-card">
            <h3>Active Teachers</h3>
            <p>{data?.stats?.activeTeachers || 45}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Admissions</h3>
            <p>{data?.stats?.pendingAdmissions || 23}</p>
          </div>
          <div className="stat-card">
            <h3>System Alerts</h3>
            <p>{data?.stats?.alerts || 2}</p>
          </div>
        </div>

        <div className="create-user-section">
          <h2>Create New User (Student/Teacher/Admin ID)</h2>
          <form onSubmit={handleCreateUser}>
            {createError && <div style={{ color: 'red', margin: '10px 0' }}>{createError}</div>}
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={createForm.email} 
                onChange={handleCreateChange} 
                required 
                placeholder="student@bfacademy.edu"
              />
            </div>
            <div className="form-group">
              <label>Temporary Password</label>
              <div className="password-input-group">
                <input 
                  type={showCreatePassword ? 'text' : 'password'} 
                  name="password" 
                  value={createForm.password} 
                  onChange={handleCreateChange} 
                  required 
                  placeholder="TempPass123"
                />
                <button type="button" onClick={toggleCreatePassword} className="toggle-password-btn">
                  {showCreatePassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={createForm.role} onChange={handleCreateChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                {canCreateAdmin && <option value="admin">Admin</option>}  // NEW: Protected admin option
              </select>
            </div>
            <button type="submit" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        <div className="admin-actions">
          <button className="action-btn">Manage Students</button>
          <button className="action-btn">View Reports</button>
          <button className="action-btn">Update Faculty</button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;