import React, { useState } from 'react';
import { SUPPORT_CATEGORIES } from '../../constants';
import { validateSupportForm } from '../../utils/validation';

const SupportRequest = () => {
  const [supportForm, setSupportForm] = useState({
    name: '',
    studentId: '',
    category: 'Account',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSupportForm(supportForm);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitted(false);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setSubmitted(true);
      setSupportForm({ 
        name: '', 
        studentId: '', 
        category: 'Account', 
        message: '' 
      });
      setErrors({});
    } catch (error) {
      console.error('Support submission error:', error);
      setErrors({ general: 'Support request submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      {submitted && (
        <div className="success-banner" role="status" aria-live="polite">
          Thanks! Your request was submitted. Our team will get back to you shortly.
        </div>
      )}

      <form className="support-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row two-col">
          <div className="form-row">
            <label className="form-label" htmlFor="sf-name">Name</label>
            <input
              id="sf-name"
              className="form-input"
              type="text"
              name="name"
              value={supportForm.name}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby="sf-name-err"
            />
            {errors.name && <span id="sf-name-err" className="field-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="sf-id">Student ID</label>
            <input
              id="sf-id"
              className="form-input"
              type="text"
              name="studentId"
              value={supportForm.studentId}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.studentId)}
              aria-describedby="sf-id-err"
              inputMode="numeric"
            />
            {errors.studentId && <span id="sf-id-err" className="field-error">{errors.studentId}</span>}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="sf-category">Category</label>
          <select
            id="sf-category"
            className="form-select"
            name="category"
            value={supportForm.category}
            onChange={handleInputChange}
          >
            {SUPPORT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="sf-message">Message</label>
          <textarea
            id="sf-message"
            className="form-textarea"
            name="message"
            value={supportForm.message}
            onChange={handleInputChange}
            aria-invalid={Boolean(errors.message)}
            aria-describedby="sf-message-err"
          />
          {errors.message && <span id="sf-message-err" className="field-error">{errors.message}</span>}
        </div>

        {errors.general && (
          <div className="error-message" role="alert">
            {errors.general}
          </div>
        )}

        <div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default SupportRequest;
