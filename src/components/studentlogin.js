import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './studentlogin.css';
import { authService } from '../services/authService';
import { validateLoginForm } from '../utils/validation';
import { ERROR_MESSAGES } from '../constants';

function StudentLogin() {
  const navigate = useNavigate();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ idNumber: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const formData = { idNumber, password };
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Use authentication service (fallback to localStorage for demo)
      const result = await authService.loginDemo(idNumber.trim(), password);
      
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        // Handle login errors
        if (result.error === 'User not found') {
          setErrors({ idNumber: 'Account not found', password: '' });
        } else if (result.error === 'Incorrect password') {
          setErrors({ idNumber: '', password: 'Incorrect password' });
        } else {
          setErrors({ idNumber: ERROR_MESSAGES.LOGIN_FAILED, password: '' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ idNumber: ERROR_MESSAGES.LOGIN_FAILED, password: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Student login">
        <div className="login-left">
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