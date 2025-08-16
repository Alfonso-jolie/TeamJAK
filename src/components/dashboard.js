import React, { useState } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

import GCashLogo from '../design/Gcash.png';
import UnionBankLogo from '../design/unionbank.png';
import PayTapLogo from '../design/paytaplogo.png';

const SECTIONS = [
  { key: 'topup', label: 'Points Topup', icon: '💰' },
  { key: 'expense', label: 'Expense Tracking', icon: '📊' },
  { key: 'balance', label: 'Points Balance', icon: '💳' },
  { key: 'support', label: 'Support Request', icon: '❓' },
];

function Dashboard() {
  const [active, setActive] = useState('topup');
  const [filter, setFilter] = useState('Monthly');
  const navigate = useNavigate();

  const [supportForm, setSupportForm] = useState({
    name: '',
    studentId: '',
    category: 'Account',
    message: '',
  });
  const [supportErrors, setSupportErrors] = useState({});
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Comprehensive expense data for different time periods
  const allExpenseData = {
    Monthly: [
      { date: '2025-08-10', vendor: 'Coffee Shop', amount: '₱150', remaining: '₱2,350' },
      { date: '2025-08-09', vendor: 'Grocery Store', amount: '₱1,200', remaining: '₱1,150' },
      { date: '2025-08-08', vendor: 'Bookstore', amount: '₱500', remaining: '₱650' },
      { date: '2025-08-07', vendor: 'Cafeteria', amount: '₱80', remaining: '₱570' },
      { date: '2025-08-06', vendor: 'Print Shop', amount: '₱25', remaining: '₱545' },
      { date: '2025-08-05', vendor: 'Library Fine', amount: '₱50', remaining: '₱495' },
    ],
    Weekly: [
      { date: '2025-08-10', vendor: 'Coffee Shop', amount: '₱150', remaining: '₱2,350' },
      { date: '2025-08-09', vendor: 'Grocery Store', amount: '₱1,200', remaining: '₱1,150' },
      { date: '2025-08-08', vendor: 'Bookstore', amount: '₱500', remaining: '₱650' },
    ],
    Daily: [
      { date: '2025-08-10', vendor: 'Coffee Shop', amount: '₱150', remaining: '₱2,350' },
    ],
  };

  // Get filtered data based on selected filter
  const expenseData = allExpenseData[filter] || allExpenseData.Monthly;

  const handlePaymentClick = (method) => {
    console.log(`Selected payment method: ${method}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const validateSupport = () => {
    const next = {};
    if (!supportForm.name.trim()) next.name = 'Name is required';
    if (!/^\d{6,12}$/.test(supportForm.studentId.trim())) next.studentId = 'Enter a valid 6-12 digit ID';
    if (!supportForm.message.trim() || supportForm.message.trim().length < 10) next.message = 'Please provide a brief description (min 10 characters)';
    setSupportErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitSupport = async (e) => {
    e.preventDefault();
    if (!validateSupport()) return;
    setSupportSubmitted(false);
    // Simulate API
    await new Promise((r) => setTimeout(r, 600));
    setSupportSubmitted(true);
    setSupportForm({ name: '', studentId: '', category: 'Account', message: '' });
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src={PayTapLogo} alt="PayTap" className="logo" />
        </div>
        <nav className="nav-links">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`nav-link ${active === s.key ? 'active' : ''}`}
              onClick={() => setActive(s.key)}
            >
              <span className="nav-icon">{s.icon}</span>
              <span className="nav-text">{s.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="surface">
          <header className="header">
            <h1>{SECTIONS.find((s) => s.key === active)?.label}</h1>
            <div className="balance-badge">Balance: 100.00 Points</div>
          </header>

          {/* Points Top-Up Section */}
          {active === 'topup' && (
            <>
              <section className="section">
                <h2>Choose a payment method</h2>
                <div className="payment-options">
                  <div
                    className="payment-card"
                    onClick={() => handlePaymentClick('GCash')}
                  >
                    <img src={GCashLogo} alt="GCash" className="payment-logo" />
                    <p>Pay with GCash</p>
                  </div>
                  <div
                    className="payment-card"
                    onClick={() => handlePaymentClick('UnionBank')}
                  >
                    <img
                      src={UnionBankLogo}
                      alt="UnionBank"
                      className="payment-logo"
                    />
                    <p>Pay with UnionBank</p>
                  </div>
                </div>
              </section>

              {/* Transaction History */}
              <section className="section transaction-history">
                <h2>Transaction History</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-08-05</td>
                      <td>GCash</td>
                      <td>₱500</td>
                      <td>Completed</td>
                    </tr>
                    <tr>
                      <td>2025-08-01</td>
                      <td>UnionBank</td>
                      <td>₱1,000</td>
                      <td>Pending</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* Expense Tracking */}
          {active === 'expense' && (
            <section className="section">
              {/* Filter */}
              <div className="filter-bar">
                <label htmlFor="filter">Filter: </label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>

              {/* Summary */}
              <div className="expense-summary">
                <p>Showing {filter.toLowerCase()} expenses ({expenseData.length} transactions)</p>
              </div>

              {/* Table */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Vendor</th>
                    <th>Amount Spent</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.vendor}</td>
                      <td>{item.amount}</td>
                      <td>{item.remaining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Points Balance */}
          {active === 'balance' && (
            <section className="section">
              <p>Your current balance is 100.00 Points.</p>
              <button
                className="topup-btn btn-primary"
                onClick={() => setActive('topup')}
              >
                Top Up Now
              </button>
            </section>
          )}

          {/* Support Request */}
          {active === 'support' && (
            <section className="section">
              {supportSubmitted && (
                <div className="success-banner" role="status" aria-live="polite">
                  Thanks! Your request was submitted. Our team will get back to you shortly.
                </div>
              )}

              <form className="support-form" onSubmit={submitSupport} noValidate>
                <div className="form-row two-col">
                  <div className="form-row">
                    <label className="form-label" htmlFor="sf-name">Name</label>
                    <input
                      id="sf-name"
                      className="form-input"
                      type="text"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                      aria-invalid={Boolean(supportErrors.name)}
                      aria-describedby="sf-name-err"
                    />
                    {supportErrors.name && <span id="sf-name-err" className="field-error">{supportErrors.name}</span>}
                  </div>

                  <div className="form-row">
                    <label className="form-label" htmlFor="sf-id">Student ID</label>
                    <input
                      id="sf-id"
                      className="form-input"
                      type="text"
                      value={supportForm.studentId}
                      onChange={(e) => setSupportForm({ ...supportForm, studentId: e.target.value })}
                      aria-invalid={Boolean(supportErrors.studentId)}
                      aria-describedby="sf-id-err"
                      inputMode="numeric"
                    />
                    {supportErrors.studentId && <span id="sf-id-err" className="field-error">{supportErrors.studentId}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="sf-category">Category</label>
                  <select
                    id="sf-category"
                    className="form-select"
                    value={supportForm.category}
                    onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                  >
                    <option>Account</option>
                    <option>Payments</option>
                    <option>Technical</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="sf-message">Message</label>
                  <textarea
                    id="sf-message"
                    className="form-textarea"
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    aria-invalid={Boolean(supportErrors.message)}
                    aria-describedby="sf-message-err"
                  />
                  {supportErrors.message && <span id="sf-message-err" className="field-error">{supportErrors.message}</span>}
                </div>

                <div>
                  <button type="submit" className="btn-primary">Submit</button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
