import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import PaytapImage from '../design/Paytap.png';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    idCardNumber: '',
    studentNumber: '',
    // Vendor-specific fields
    businessOwnerName: '',
    businessName: '',
    tin: '',
    dtiSecRegistration: null,
    barangayClearance: null,
    cafeteriaAccreditation: null,
    menuItemsList: null,
    bank: '',
    bankAccountNumber: '',
    mayorsPermit: '',
    canteenStallLocation: '',
    contactPersonName: '',
    phoneNumber: '',
    authorizedFoodSellerName: '',
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
    const newErrors = {};

    // User type validation
    if (!formData.userType) {
      newErrors.userType = 'Please select a user type';
    }

    // Basic field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Student-specific validation
    if (formData.userType === 'Student') {
      if (!formData.idCardNumber.trim()) {
        newErrors.idCardNumber = 'ID card number is required for students';
      } else if (!/^\d{6,12}$/.test(formData.idCardNumber.trim())) {
        newErrors.idCardNumber = 'Enter a valid 6-12 digit ID card number';
      }

      if (!formData.studentNumber.trim()) {
        newErrors.studentNumber = 'Student number is required for students';
      } else if (!/^\d{6,12}$/.test(formData.studentNumber.trim())) {
        newErrors.studentNumber = 'Enter a valid 6-12 digit student number';
      }
    }

    // Vendor-specific validation
    if (formData.userType === 'Vendor') {
      if (!formData.businessOwnerName.trim()) {
        newErrors.businessOwnerName = 'Business owner name is required';
      }
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.tin.trim()) {
        newErrors.tin = 'Tax Identification Number is required';
      }
      if (!formData.dtiSecRegistration) {
        newErrors.dtiSecRegistration = 'DTI/SEC Registration is required';
      }
      if (!formData.barangayClearance) {
        newErrors.barangayClearance = 'Barangay Clearance is required';
      }
      if (!formData.cafeteriaAccreditation) {
        newErrors.cafeteriaAccreditation = 'Cafeteria Accreditation Certificate is required';
      }
      if (!formData.menuItemsList) {
        newErrors.menuItemsList = 'Menu items list is required';
      }
      if (!formData.bank.trim()) {
        newErrors.bank = 'Bank name is required';
      }
      if (!formData.bankAccountNumber.trim()) {
        newErrors.bankAccountNumber = 'Bank account number is required';
      }
      if (!formData.mayorsPermit.trim()) {
        newErrors.mayorsPermit = "Mayor's permit is required";
      }
      if (!formData.canteenStallLocation.trim()) {
        newErrors.canteenStallLocation = 'Canteen stall location is required';
      }
      if (!formData.contactPersonName.trim()) {
        newErrors.contactPersonName = 'Contact person name is required';
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }
      if (!formData.authorizedFoodSellerName.trim()) {
        newErrors.authorizedFoodSellerName = 'Authorized food seller name is required';
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must agree to the terms and conditions';
      }
      if (!formData.dataProcessingAccepted) {
        newErrors.dataProcessingAccepted = 'You must authorize data processing';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Simulate an API call. Replace with real registration later.
      await new Promise((res) => setTimeout(res, 800));

      // On success, navigate to login page
      navigate('/login', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const renderVendorForm = () => (
    <div className="vendor-form">
      <h2 className="vendor-title">Vendor Registration</h2>
      
      <div className="vendor-columns">
        {/* Left Column */}
        <div className="vendor-column">
          <div className="field">
            <label htmlFor="businessOwnerName">Full Name of Business Owner / Operator</label>
            <input
              id="businessOwnerName"
              name="businessOwnerName"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.businessOwnerName}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.businessOwnerName)}
            />
            {errors.businessOwnerName && (
              <span className="error-message" role="alert">
                {errors.businessOwnerName}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.businessName}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.businessName)}
            />
            {errors.businessName && (
              <span className="error-message" role="alert">
                {errors.businessName}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="tin">Tax Identification Number (TIN)</label>
            <input
              id="tin"
              name="tin"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.tin}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.tin)}
            />
            {errors.tin && (
              <span className="error-message" role="alert">
                {errors.tin}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="dtiSecRegistration">Upload DTI/SEC Registration</label>
            <input
              id="dtiSecRegistration"
              name="dtiSecRegistration"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="file-input"
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.dtiSecRegistration)}
            />
            <button type="button" className="upload-btn" onClick={() => document.getElementById('dtiSecRegistration').click()}>
              UPLOAD HERE
            </button>
            {errors.dtiSecRegistration && (
              <span className="error-message" role="alert">
                {errors.dtiSecRegistration}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="barangayClearance">Barangay Clearance</label>
            <input
              id="barangayClearance"
              name="barangayClearance"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="file-input"
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.barangayClearance)}
            />
            <button type="button" className="upload-btn" onClick={() => document.getElementById('barangayClearance').click()}>
              UPLOAD HERE
            </button>
            {errors.barangayClearance && (
              <span className="error-message" role="alert">
                {errors.barangayClearance}
              </span>
            )}
          </div>
        </div>

        {/* Middle Column */}
        <div className="vendor-column">
          <div className="field">
            <label htmlFor="cafeteriaAccreditation">School Cafeteria Accreditation Certificate</label>
            <input
              id="cafeteriaAccreditation"
              name="cafeteriaAccreditation"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="file-input"
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.cafeteriaAccreditation)}
            />
            <button type="button" className="upload-btn" onClick={() => document.getElementById('cafeteriaAccreditation').click()}>
              UPLOAD HERE
            </button>
            {errors.cafeteriaAccreditation && (
              <span className="error-message" role="alert">
                {errors.cafeteriaAccreditation}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="menuItemsList">List of Menu Items with Prices</label>
            <input
              id="menuItemsList"
              name="menuItemsList"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="file-input"
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.menuItemsList)}
            />
            <button type="button" className="upload-btn" onClick={() => document.getElementById('menuItemsList').click()}>
              UPLOAD HERE
            </button>
            {errors.menuItemsList && (
              <span className="error-message" role="alert">
                {errors.menuItemsList}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="bank">BANK</label>
            <input
              id="bank"
              name="bank"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.bank}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.bank)}
            />
            {errors.bank && (
              <span className="error-message" role="alert">
                {errors.bank}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="bankAccountNumber">Bank Account Number</label>
            <input
              id="bankAccountNumber"
              name="bankAccountNumber"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.bankAccountNumber}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.bankAccountNumber)}
            />
            {errors.bankAccountNumber && (
              <span className="error-message" role="alert">
                {errors.bankAccountNumber}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="mayorsPermit">Mayor's Permit</label>
            <input
              id="mayorsPermit"
              name="mayorsPermit"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.mayorsPermit}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.mayorsPermit)}
            />
            {errors.mayorsPermit && (
              <span className="error-message" role="alert">
                {errors.mayorsPermit}
              </span>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="vendor-column">
          <div className="field">
            <label htmlFor="canteenStallLocation">Canteen Stall Location</label>
            <input
              id="canteenStallLocation"
              name="canteenStallLocation"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.canteenStallLocation}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.canteenStallLocation)}
            />
            {errors.canteenStallLocation && (
              <span className="error-message" role="alert">
                {errors.canteenStallLocation}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="contactPersonName">Contact Person Name</label>
            <input
              id="contactPersonName"
              name="contactPersonName"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.contactPersonName}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.contactPersonName)}
            />
            {errors.contactPersonName && (
              <span className="error-message" role="alert">
                {errors.contactPersonName}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Input here"
              className="input"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.phoneNumber)}
            />
            {errors.phoneNumber && (
              <span className="error-message" role="alert">
                {errors.phoneNumber}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="authorizedFoodSellerName">Authorized Food Seller Name</label>
            <input
              id="authorizedFoodSellerName"
              name="authorizedFoodSellerName"
              type="text"
              placeholder="Input here"
              className="input"
              value={formData.authorizedFoodSellerName}
              onChange={handleInputChange}
              aria-invalid={Boolean(errors.authorizedFoodSellerName)}
            />
            {errors.authorizedFoodSellerName && (
              <span className="error-message" role="alert">
                {errors.authorizedFoodSellerName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="terms-section">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="checkbox"
            />
            <span>I agree to the terms and conditions of PayTap</span>
          </label>
          {errors.termsAccepted && (
            <span className="error-message" role="alert">
              {errors.termsAccepted}
            </span>
          )}
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="dataProcessingAccepted"
              checked={formData.dataProcessingAccepted}
              onChange={handleInputChange}
              className="checkbox"
            />
            <span>I authorize PayTap to process and store my data</span>
          </label>
          {errors.dataProcessingAccepted && (
            <span className="error-message" role="alert">
              {errors.dataProcessingAccepted}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <main className="register-page">
      <section className="register-card" aria-label="User registration">
        <div className="register-left">
          <img src={PaytapImage} alt="PayTap graphic" className="brand-graphic" />
          <div className="brand-text">
            <h1 className="portal-title">PayTap | Portal</h1>
            <p className="school-name">De La Salle Lipa</p>
          </div>
        </div>
        <div className="register-right">
          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {formData.userType === 'Vendor' ? (
              renderVendorForm()
            ) : (
              <>
                <h2 className="form-title">Create Account</h2>
                
                {/* User Type Selection */}
                <div className="field">
                  <label htmlFor="userType" className="field-label">I want to register as:</label>
                  <select
                    id="userType"
                    name="userType"
                    className="input"
                    value={formData.userType}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.userType)}
                    aria-describedby="userType-error"
                  >
                    <option value="">Select user type</option>
                    <option value="Student">Student</option>
                    <option value="Vendor">Vendor</option>
                  </select>
                  {errors.userType && (
                    <span id="userType-error" className="error-message" role="alert">
                      {errors.userType}
                    </span>
                  )}
                </div>

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

                {/* Student-specific fields */}
                {formData.userType === 'Student' && (
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
                )}

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
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating account…' : formData.userType === 'Vendor' ? 'SUBMIT' : 'Create Account'}
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
