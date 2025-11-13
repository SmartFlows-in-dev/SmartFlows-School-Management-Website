import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('StudentDashboard mounted! Token:', !!localStorage.getItem('token'));  // DEBUG
    const fetchData = async () => {
      console.log('Student useEffect starting: Fetching dashboard');  // DEBUG
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token in student useEffect, redirecting');
        navigate('/student-login');
        return;
      }
      try {
        console.log('Fetching student dashboard with token...');
        const response = await fetch('https://smartflows-school-management-website.onrender.com/api/student/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Dashboard fetch failed');
        setData(result);
        console.log('Student dashboard loaded:', result);  // DEBUG
      } catch (err) {
        console.error('Student dashboard error:', err);  // DEBUG
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('Student access')) {
          console.log('Clearing storage and redirecting due to auth fail');
          localStorage.clear();
          navigate('/student-login');
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
  if (error) return <div className="error">Error: {error}. <button onClick={() => navigate('/student-login')}>Back to Login</button></div>;

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Bright Future Academy - Student Portal</h1>
        <div className="user-info">
          <span>Welcome, {data?.user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Courses Enrolled</h3>
            <p>{data?.stats?.courses || 5}</p>
          </div>
          <div className="stat-card">
            <h3>Average Grade</h3>
            <p>{data?.stats?.avgGrade || 'A-'}</p>
          </div>
          <div className="stat-card">
            <h3>Attendance %</h3>
            <p>{data?.stats?.attendance || '95%'}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Assignments</h3>
            <p>{data?.stats?.assignments || 3}</p>
          </div>
        </div>

        <div className="student-actions">
          <button className="action-btn">View Timetable</button>
          <button className="action-btn">Check Grades</button>
          <button className="action-btn">Submit Homework</button>
          <button className="action-btn">Join Class Chat</button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;