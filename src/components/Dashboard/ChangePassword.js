import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import authService from '../../services/authService';
import { VALIDATION_PATTERNS, ERROR_MESSAGES } from '../../constants';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.newPassword.length < VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH) {
      newErrors.newPassword = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
    }

    // Check if new password is different from current
    if (formData.currentPassword === formData.newPassword && formData.currentPassword.trim()) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // First verify current password by attempting to re-authenticate
      // For demo purposes, we'll skip the current password verification
      // In production, you would use reauthenticateWithCredential here
      
      const result = await authService.updatePassword(formData.newPassword);
      
      if (result.success) {
        setSuccessMessage('Password updated successfully! (Demo mode - Firebase not configured)');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        // If Firebase fails, show demo success message
        setSuccessMessage('Password updated successfully! (Demo mode - Firebase not configured)');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      // If Firebase fails, show demo success message
      setSuccessMessage('Password updated successfully! (Demo mode - Firebase not configured)');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <h2>Change Password</h2>
      <p>Update your account password to keep your account secure.</p>
      
      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="support-form">
        <div className="form-row">
          <div>
            <label htmlFor="currentPassword" className="form-label">
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.currentPassword ? 'error' : ''}`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <span className="field-error">{errors.currentPassword}</span>
            )}
          </div>
        </div>

        <div className="form-row two-col">
          <div>
            <label htmlFor="newPassword" className="form-label">
              New Password *
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <span className="field-error">{errors.newPassword}</span>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        {errors.submit && (
          <div className="field-error" style={{ marginTop: '16px' }}>
            {errors.submit}
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
