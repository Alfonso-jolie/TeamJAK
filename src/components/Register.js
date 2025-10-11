import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import { authService } from '../services/authService';
import { validateRegistrationForm } from '../utils/validation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    idCardNumber: '',
    studentNumber: '',
    termsAccepted: false,
    dataProcessingAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const validationErrors = validateRegistrationForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Use Firebase authentication (fallback to localStorage for demo)
      const result = await authService.registerDemo(formData);
      
      if (result.success) {
        // Navigate to login on success
        navigate('/login', { replace: true });
      } else {
        // Handle specific errors
        if (result.duplicateFields) {
          const duplicateErrors = {};
          if (result.duplicateFields.email) duplicateErrors.email = 'Email already registered';
          if (result.duplicateFields.studentNumber) duplicateErrors.studentNumber = 'Student number already registered';
          if (result.duplicateFields.idCardNumber) duplicateErrors.idCardNumber = 'ID card number already registered';
          setErrors(duplicateErrors);
        } else {
          setErrors({ general: result.error || ERROR_MESSAGES.REGISTRATION_FAILED });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: ERROR_MESSAGES.REGISTRATION_FAILED });
    } finally {
      setSubmitting(false);
    }
  };

  const renderVendorForm = () => null;

  return (
    <main className="register-page">
      <section className="register-card" aria-label="User registration">
        <div className="register-left">
          <div className="brand-text">
            <h1 className="portal-title">PayTap | Portal</h1>
            <p className="school-name">De La Salle Lipa</p>
          </div>
        </div>
        <div className="register-right">
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <>
                <h2 className="form-title">Create Account</h2>

                {/* Name Fields */}
                <div className="name-fields">
                  <div className="field">
                    <label htmlFor="firstName" className="sr-only">First name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      className="input"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby="firstName-error"
                    />
                    {errors.firstName && (
                      <span id="firstName-error" className="error-message" role="alert">
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="lastName" className="sr-only">Last name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      className="input"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby="lastName-error"
                    />
                    {errors.lastName && (
                      <span id="lastName-error" className="error-message" role="alert">
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="field">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className="input"
                    value={formData.email}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="email-error"
                  />
                  {errors.email && (
                    <span id="email-error" className="error-message" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Student fields */}
                  <>
                    <div className="field">
                      <label htmlFor="idCardNumber" className="sr-only">ID card number</label>
                      <input
                        id="idCardNumber"
                        name="idCardNumber"
                        type="text"
                        placeholder="ID card number"
                        className="input"
                        inputMode="numeric"
                        value={formData.idCardNumber}
                        onChange={handleInputChange}
                        aria-invalid={Boolean(errors.idCardNumber)}
                        aria-describedby="idCardNumber-error"
                      />
                      {errors.idCardNumber && (
                        <span id="idCardNumber-error" className="error-message" role="alert">
                          {errors.idCardNumber}
                        </span>
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="studentNumber" className="sr-only">Student number</label>
                      <input
                        id="studentNumber"
                        name="studentNumber"
                        type="text"
                        placeholder="Student number"
                        className="input"
                        inputMode="numeric"
                        value={formData.studentNumber}
                        onChange={handleInputChange}
                        aria-invalid={Boolean(errors.studentNumber)}
                        aria-describedby="studentNumber-error"
                      />
                      {errors.studentNumber && (
                        <span id="studentNumber-error" className="error-message" role="alert">
                          {errors.studentNumber}
                        </span>
                      )}
                    </div>
                  </>

                {/* Password Fields */}
                <div className="field">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="input"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-error"
                  />
                  {errors.password && (
                    <span id="password-error" className="error-message" role="alert">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className="input"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby="confirmPassword-error"
                  />
                  {errors.confirmPassword && (
                    <span id="confirmPassword-error" className="error-message" role="alert">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
            </>

            {/* Consents */}
            <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.termsAccepted)}
                aria-describedby="termsAccepted-error"
              />
              <label htmlFor="termsAccepted">I agree to the Terms and Conditions</label>
            </div>
            {errors.termsAccepted && (
              <span id="termsAccepted-error" className="error-message" role="alert">
                {errors.termsAccepted}
              </span>
            )}

            <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                id="dataProcessingAccepted"
                name="dataProcessingAccepted"
                type="checkbox"
                checked={formData.dataProcessingAccepted}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.dataProcessingAccepted)}
                aria-describedby="dataProcessingAccepted-error"
              />
              <label htmlFor="dataProcessingAccepted">I authorize processing of my data</label>
            </div>
            {errors.dataProcessingAccepted && (
              <span id="dataProcessingAccepted-error" className="error-message" role="alert">
                {errors.dataProcessingAccepted}
              </span>
            )}

            {errors.general && (
              <span className="error-message" role="alert" style={{ textAlign: 'center', display: 'block', marginBottom: '1rem' }}>
                {errors.general}
              </span>
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>

            <div className="auth-links">
              <Link to="/login" className="link">Already have an account? Login</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;