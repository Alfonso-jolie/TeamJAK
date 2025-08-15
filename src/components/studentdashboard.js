import React, { useState, Suspense } from 'react';
import './studentlogin.css';
const Dashboard = React.lazy(() => import('./dashboard'));

function StudentDashboard() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return (
      <Suspense fallback={<div style={{ padding: 24 }}>Loading dashboard…</div>}>
        <Dashboard />
      </Suspense>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#f7f9f7'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.12)',
        padding: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ margin: 0, color: '#314528' }}>Student Dashboard</h2>
        <p style={{ marginTop: 8 }}>Welcome! You have successfully logged in.</p>
        <button onClick={() => setShowDashboard(true)} className="btn-primary" style={{ marginTop: 12 }}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard; 