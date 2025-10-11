import React, { useState } from 'react';
import { PAYMENT_METHODS } from '../../constants';
import { validatePaymentForm } from '../../utils/validation';

const PaymentModal = ({ paymentMethod, onClose }) => {
  const [paymentForm, setPaymentForm] = useState({
    name: 'Admin',
    accountNumber: '',
    referenceNumber: '',
    proofOfPayment: null
  });
  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setPaymentForm(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setPaymentForm(prev => ({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePaymentForm(paymentForm);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // TODO: Submit payment data to backend
    console.log('Payment submitted:', {
      method: paymentMethod,
      ...paymentForm,
      submittedAt: new Date().toISOString()
    });
    
    // Close modal and show success message
    onClose();
    alert('Payment submitted successfully!');
  };

  const handleClose = () => {
    setPaymentForm({
      name: 'Admin',
      accountNumber: '',
      referenceNumber: '',
      proofOfPayment: null
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Payment Form - {paymentMethod}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form className="payment-form" onSubmit={handleSubmit}>
          {/* Payment Details Section */}
          <div className="payment-details-section">
            <h3>Payment details</h3>
            <div className="payment-info">
              <p>
                Send payment to {paymentMethod} number:
                {' '}<strong>{PAYMENT_METHODS[paymentMethod]?.accountNumber}</strong>
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="payment-name">Name</label>
            <input
              id="payment-name"
              name="name"
              type="text"
              value={paymentForm.name}
              onChange={handleFormChange}
              className="form-input"
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment-account">Account Number</label>
            <input
              id="payment-account"
              name="accountNumber"
              type="text"
              value={paymentForm.accountNumber}
              onChange={handleFormChange}
              className="form-input"
              placeholder="Enter your account number"
              aria-invalid={Boolean(errors.accountNumber)}
            />
            {errors.accountNumber && (
              <span className="error-message">{errors.accountNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="payment-reference">Reference Number</label>
            <input
              id="payment-reference"
              name="referenceNumber"
              type="text"
              value={paymentForm.referenceNumber}
              onChange={handleFormChange}
              className="form-input"
              placeholder="Enter reference number"
              aria-invalid={Boolean(errors.referenceNumber)}
            />
            {errors.referenceNumber && (
              <span className="error-message">{errors.referenceNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="payment-proof">Upload proof of payment (image)</label>
            <input
              id="payment-proof"
              name="proofOfPayment"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFormChange}
              className="form-input"
              aria-invalid={Boolean(errors.proofOfPayment)}
            />
            {errors.proofOfPayment && (
              <span className="error-message">{errors.proofOfPayment}</span>
            )}
            {paymentForm.proofOfPayment && (
              <div className="file-selected">
                <span>Selected: {paymentForm.proofOfPayment.name}</span>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
