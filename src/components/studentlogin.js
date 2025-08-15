import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './studentlogin.css';
import PaytapImage from '../design/Paytap.png';

function StudentLogin() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ idNumber: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = { idNumber: '', password: '' };

    // Basic example validation: numeric ID, length 6-12; password min length 6
    if (!idNumber.trim()) {
      next.idNumber = 'ID number is required';
    } else if (!/^\d{6,12}$/.test(idNumber.trim())) {
      next.idNumber = 'Enter a valid 6-12 digit ID number';
    }

    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters';
    }

    setErrors(next);
    return !next.idNumber && !next.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Simulate an API call. Replace with real auth later.
      await new Promise((res) => setTimeout(res, 600));

      // On success, navigate to dashboard
      navigate('/dashboard', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Student login">
        <div className="login-left">
          <img src={PaytapImage} alt="PayTap graphic" className="brand-graphic" />
          <div className="brand-text">
            <h1 className="portal-title">PayTap | Portal</h1>
            <p className="school-name">De La Salle Lipa</p>
          </div>
        </div>
        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="idNumber" className="sr-only">ID number</label>
              <input
                id="idNumber"
                type="text"
                placeholder="Enter your ID number"
                className="input"
                inputMode="numeric"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                aria-invalid={Boolean(errors.idNumber)}
                aria-describedby="idNumber-error"
              />
              {errors.idNumber && (
                <span id="idNumber-error" role="alert" style={{ color: '#b42318', fontSize: 13 }}>
                  {errors.idNumber}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="input"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby="password-error"
              />
              {errors.password && (
                <span id="password-error" role="alert" style={{ color: '#b42318', fontSize: 13 }}>
                  {errors.password}
                </span>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Login'}
            </button>

            <div className="auth-links">
              <Link to="/register" className="link">Register</Link>
              <Link to="/forgot-password" className="link">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default StudentLogin;
