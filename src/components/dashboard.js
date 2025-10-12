import React, { useState } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

// Dashboard components
import Sidebar from './Dashboard/Sidebar';
import PointsTopup from './Dashboard/PointsTopup';
import ExpenseTracking from './Dashboard/ExpenseTracking';
import PointsBalance from './Dashboard/PointsBalance';
import SupportRequest from './Dashboard/SupportRequest';
import ChangePassword from './Dashboard/ChangePassword';

// Constants
import { DASHBOARD_SECTIONS, DEFAULT_BALANCE } from '../constants';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('topup');
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleTopupClick = () => {
    setActiveSection('topup');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'topup':
        return <PointsTopup isAdmin={isAdmin} userBalance={DEFAULT_BALANCE} />;
      case 'expense':
        return <ExpenseTracking />;
      case 'balance':
        return <PointsBalance onTopupClick={handleTopupClick} userBalance={DEFAULT_BALANCE} />;
      case 'support':
        return <SupportRequest />;
      case 'password':
        return <ChangePassword />;
      default:
        return <PointsTopup isAdmin={isAdmin} userBalance={DEFAULT_BALANCE} />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <div className="header-logo">
          <span className="logo-icon">❖</span>
          <h1 className="header-title">Paytap</h1>
        </div>
      </div>

      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="surface">
          <header className="header">
            <h1>{DASHBOARD_SECTIONS.find((s) => s.key === activeSection)?.label}</h1>
            <div className="balance-badge">Balance: {DEFAULT_BALANCE} Points</div>
          </header>

          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;