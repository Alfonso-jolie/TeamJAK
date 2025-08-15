import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Forgetpassword.css';
import PaytapImage from '../design/Paytap.png';

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = { email: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return !newErrors.email;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Simulate an API call. Replace with real password reset later.
      await new Promise((res) => setTimeout(res, 1000));

      // Show success message
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  if (submitted) {
    return (
      <main className="forgot-page">
        <section className="forgot-card" aria-label="Password reset confirmation">
          <div className="forgot-left">
            <img src={PaytapImage} alt="PayTap graphic" className="brand-graphic" />
            <div className="brand-text">
              <h1 className="portal-title">PayTap | Portal</h1>
              <p className="school-name">De La Salle Lipa</p>
            </div>
          </div>
          <div className="forgot-right">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2 className="success-title">Check Your Email</h2>
              <p className="success-text">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="success-subtext">
                Please check your email and click the link to reset your password. 
                The link will expire in 24 hours.
              </p>
              <div className="action-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                >
                  Send Another Email
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="forgot-page">
      <section className="forgot-card" aria-label="Forgot password">
        <div className="forgot-left">
          <img src={PaytapImage} alt="PayTap graphic" className="brand-graphic" />
          <div className="brand-text">
            <h1 className="portal-title">PayTap | Portal</h1>
            <p className="school-name">De La Salle Lipa</p>
          </div>
        </div>
        <div className="forgot-right">
          <form className="forgot-form" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Forgot Password?</h2>
            <p className="form-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="field">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="input"
                value={email}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby="email-error"
                autoComplete="email"
              />
              {errors.email && (
                <span id="email-error" role="alert" className="error-message">
                  {errors.email}
                </span>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="auth-links">
              <Link to="/login" className="link">Back to Login</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ForgetPassword;
