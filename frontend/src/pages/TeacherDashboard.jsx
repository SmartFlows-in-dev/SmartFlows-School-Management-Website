import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('TeacherDashboard mounted! Token:', !!localStorage.getItem('token'));
    const fetchData = async () => {
      console.log('Teacher useEffect starting: Fetching dashboard');
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token in teacher useEffect, redirecting');
        navigate('/teacher-login');
        return;
      }
      try {
        console.log('Fetching teacher dashboard with token...');
        const response = await fetch('https://smartflows-school-management-website.onrender.com/api/teacher/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Dashboard fetch failed');
        setData(result);
        console.log('Teacher dashboard loaded:', result);
      } catch (err) {
        console.error('Teacher dashboard error:', err);
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('Teacher access')) {
          console.log('Clearing storage and redirecting due to auth fail');
          localStorage.clear();
          navigate('/teacher-login');
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

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error: {error}. <button onClick={() => navigate('/teacher-login')}>Back to Login</button></div>;

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Bright Future Academy - Faculty Portal</h1>
        <div className="user-info">
          <span>Welcome, {data?.user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Classes Taught</h3>
            <p>{data?.stats?.classes || 6}</p>
          </div>
          <div className="stat-card">
            <h3>Students Managed</h3>
            <p>{data?.stats?.students || 120}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Grades</h3>
            <p>{data?.stats?.pendingGrades || 15}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Classes</h3>
            <p>{data?.stats?.upcoming || 2}</p>
          </div>
        </div>

        <div className="teacher-actions">
          <button className="action-btn">Grade Assignments</button>
          <button className="action-btn">Upload Materials</button>
          <button className="action-btn">Take Attendance</button>
          <button className="action-btn">View Reports</button>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;