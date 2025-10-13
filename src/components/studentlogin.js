import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './studentlogin.css';
import { authService } from '../services/authService';
import { validateEmail, validatePassword } from '../utils/validation';
import { ERROR_MESSAGES } from '../constants';

function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const validationErrors = {};
    if (emailError) validationErrors.email = emailError;
    if (passwordError) validationErrors.password = passwordError;
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Use authentication service (fallback to localStorage for demo)
      const result = await authService.loginDemo(email.trim(), password);
      
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        // Handle login errors
        if (result.error === 'User not found') {
          setErrors({ email: 'Account not found', password: '' });
        } else if (result.error === 'Incorrect password') {
          setErrors({ email: '', password: 'Incorrect password' });
        } else {
          setErrors({ email: ERROR_MESSAGES.LOGIN_FAILED, password: '' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: ERROR_MESSAGES.LOGIN_FAILED, password: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <header className="app-header">
        <div className="brand-dot" aria-hidden="true"></div>
        <h1 className="app-title">Paytap</h1>
      </header>
      <section className="login-card" aria-label="Login">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2 className="form-title">Login</h2>

          <div className="field">
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby="email-error"
            />
            {errors.email && (
              <span id="email-error" role="alert" className="error-text">
                {errors.email}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-error"
            />
            {errors.password && (
              <span id="password-error" role="alert" className="error-text">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </button>

          <div className="divider" aria-hidden="true"></div>

          <p className="partner-text">Looking to partner with PayTap Service?</p>
          {/* Vendor CTA intentionally omitted as requested */}

          <div className="auth-links">
            <Link to="/register" className="link">Register</Link>
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default StudentLogin;