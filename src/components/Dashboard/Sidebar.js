import React from 'react';
import { DASHBOARD_SECTIONS } from '../../constants';
import PayTapLogo from '../../design/paytaplogo.png';

const Sidebar = ({ activeSection, onSectionChange, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="logo-section">
        <img src={PayTapLogo} alt="PayTap" className="logo" />
      </div>
      <nav className="nav-links">
        {DASHBOARD_SECTIONS.map((section) => (
          <button
            key={section.key}
            className={`nav-link ${activeSection === section.key ? 'active' : ''}`}
            onClick={() => onSectionChange(section.key)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-text">{section.label}</span>
          </button>
        ))}
      </nav>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
