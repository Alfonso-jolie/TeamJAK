import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/authContext";
import StudentSidebar from '../Components/studentsidebar';
import TopBar from '../Components/Topbar';
import '../Styles/pointsTopup.css';
import { useNavigate } from 'react-router-dom';

function PointsBalance() {
  const { currentUser } = useAuth?.() || {};
  const navigate = useNavigate();
  const storageKey = useMemo(() => {
    const uid = currentUser?.uid || "guest";
    return `psp.points.${uid}`;
  }, [currentUser]);

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setBalance(parseFloat(raw) || 0);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(balance));
    } catch {}
  }, [balance, storageKey]);

  // No manual adjustments in UI; balance display only

  return (
    <div className="points-topup-wrapper">
      <TopBar />
      <StudentSidebar />
      <main className="points-topup-content">
        <section className="section">
          <h2>Points Balance</h2>

          <label className="form-label" htmlFor="current-balance">Current Balance</label>
          <input
            id="current-balance"
            className="form-input"
            value={balance}
            readOnly
          />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <button className="btn-primary" onClick={() => navigate('/Topup')}>Top Up</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PointsBalance;

