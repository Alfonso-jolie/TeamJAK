import React, { useState, Suspense } from 'react';
import './studentlogin.css';
const Dashboard = React.lazy(() => import('./dashboard'));

function StudentDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return (
      <Suspense fallback={<div className="loading-container">Loading dashboard…</div>}>
        <Dashboard />
      </Suspense>
    );
  }

  return (
    <div className="student-dashboard-page">
      <div className="student-dashboard-card">
        <h2 className="student-dashboard-title">Student Dashboard</h2>
        <p className="student-dashboard-subtitle">Welcome! You have successfully logged in.</p>
        <button onClick={() => setShowDashboard(true)} className="btn-primary student-dashboard-btn">
          Continue
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard; 