import React, { useState, useEffect } from 'react';
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import StudentSidebar from '../Components/studentsidebar';
import TopBar from '../Components/Topbar';
import { PAYMENT_METHODS } from '../Constants';
import { QRCodeCanvas } from 'qrcode.react';
import GCashLogo from '../design/Gcash.png';
import UnionBankLogo from '../design/unionbank.png';
import PaymentModal from './PaymentModal';
import '../Styles/pointsTopup.css';
import '../Styles/points-topup.css';
import { getAccountMaxLen, sanitizeRequestedPoints, isAccountNumberValid, computeAccountValidationState } from './points-topup';
import { supabase } from "../Supabase/supabaseClient";

const PointsTopup = ({ isAdmin }) => {
  const [userBalance, setUserBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [modalPaymentMethod, setModalPaymentMethod] = useState(null);
  const [refNo, setRefNo] = useState('');
  const [requestedPoints, setRequestedPoints] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [visibleQrForRow, setVisibleQrForRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [rejectionReasonModal, setRejectionReasonModal] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Firebase auth state changed:', user?.email);
      setCurrentUser(user);
      if (user) {
        fetchData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!rejectionReasonModal && !showPaymentModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (rejectionReasonModal) {
          setRejectionReasonModal(null);
        }
        if (showPaymentModal) {
          closePaymentModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rejectionReasonModal, showPaymentModal]);

  const fetchData = async (userId) => {
    if (!userId) {
      console.warn('No user ID provided');
      return;
    }

    try {
      console.log('Fetching data for user:', userId);

      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (txError) {
        console.error('Error fetching transactions:', txError);
      } else {
        console.log('Transactions fetched:', txData);
        setTransactions(txData || []);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  const handlePaymentClick = (method) => {
    setModalPaymentMethod(method);
    setShowPaymentModal(true);
    setProofFile(null);
    setProofPreviewUrl('');
    setRefNo('');
    setRequestedPoints('');
    setAccountNumber('');
    setAccountNumberError('');
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setModalPaymentMethod(null);
    setRefNo('');
    setRequestedPoints('');
    setAccountNumber('');
    setAccountNumberError('');
  };

  const handleProofUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProofFile(file);
    setProofPreviewUrl(url);
  };

  const clearProof = () => {
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    setProofFile(null);
    setProofPreviewUrl('');
  };

  const handlePointsChange = (e) => {
    setRequestedPoints(sanitizeRequestedPoints(e.target.value));
  };

  const getAccountMaxLen = () => {
    if (modalPaymentMethod === 'GCash') return 11;
    if (modalPaymentMethod === 'UnionBank') return 12;
    return 20;
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value || '';
    const digitsOnly = value.replace(/\D+/g, '');
    const maxLen = getAccountMaxLen();
    const trimmed = digitsOnly.slice(0, maxLen);
    
    setAccountNumber(trimmed);
    
    // Validate in real-time
    if (modalPaymentMethod === 'GCash') {
      if (trimmed.length === 0) {
        setAccountNumberError('');
      } else if (trimmed.length >= 1 && !trimmed.startsWith('09')) {
        setAccountNumberError('GCash number must start with 09');
      } else if (trimmed.length > 0 && trimmed.length < 11) {
        setAccountNumberError('GCash number must be 11 digits');
      } else if (trimmed.length === 11 && !/^09\d{9}$/.test(trimmed)) {
        setAccountNumberError('Enter a valid 11-digit GCash number starting with 09');
      } else if (trimmed.length === 11) {
        setAccountNumberError('');
      }
    } else if (modalPaymentMethod === 'UnionBank') {
      if (trimmed.length === 0) {
        setAccountNumberError('');
      } else if (trimmed.length < 12) {
        setAccountNumberError('UnionBank account number must be 12 digits');
      } else if (trimmed.length === 12) {
        setAccountNumberError('');
      }
    } else {
      setAccountNumberError('');
    }
  };

  const isAccountNumberValidCurrent = () => {
    if (!accountNumber) return false;
    
    if (modalPaymentMethod === 'GCash') {
      // Must start with 09 and be exactly 11 digits
      const isValid = /^09\d{9}$/.test(accountNumber);
      return isValid;
    }
    
    if (modalPaymentMethod === 'UnionBank') {
      // Must be exactly 12 digits
      const isValid = /^\d{12}$/.test(accountNumber);
      return isValid;
    }
    
    return false;
  };

  const validateAccountNumber = () => {
    if (!modalPaymentMethod || !accountNumber) {
      setAccountNumberError('Account number is required');
      return false;
    }
    
    if (modalPaymentMethod === 'GCash') {
      if (!accountNumber.startsWith('09')) {
        setAccountNumberError('GCash number must start with 09');
        return false;
      }
      if (!/^09\d{9}$/.test(accountNumber)) {
        setAccountNumberError('Enter a valid 11-digit GCash number starting with 09');
        return false;
      }
      setAccountNumberError('');
      return true;
    }
    
    if (modalPaymentMethod === 'UnionBank') {
      if (!/^\d{12}$/.test(accountNumber)) {
        setAccountNumberError('Enter a valid 12-digit UnionBank account number');
        return false;
      }
      setAccountNumberError('');
      return true;
    }
    
    return !!accountNumber;
  };

  const handleSubmitPayment = async () => {
    console.log('handleSubmitPayment called');
    
    if (!modalPaymentMethod || !refNo || !requestedPoints || !proofFile) {
      alert('Please complete all required fields.');
      return;
    }

    if (!accountNumber) {
      alert('Please enter your account number.');
      return;
    }

    // Validate account number
    if (modalPaymentMethod === 'GCash') {
      if (!accountNumber.startsWith('09')) {
        setAccountNumberError('GCash number must start with 09');
        alert('GCash number must start with 09');
        return;
      }
      if (!/^09\d{9}$/.test(accountNumber)) {
        setAccountNumberError('Enter a valid 11-digit GCash number starting with 09');
        alert('Enter a valid 11-digit GCash number starting with 09');
        return;
      }
    } else if (modalPaymentMethod === 'UnionBank') {
      if (!/^\d{12}$/.test(accountNumber)) {
        setAccountNumberError('Enter a valid 12-digit UnionBank account number');
        alert('Enter a valid 12-digit UnionBank account number');
        return;
      }
    }

    if (!validateAccountNumber()) {
      alert('Please enter a valid account number.');
      return;
    }

    const pointsAmount = parseInt(requestedPoints, 10);
    if (pointsAmount <= 0) {
      alert('Requested points must be greater than 0');
      return;
    }

    if (!currentUser || !currentUser.email) {
      alert('User not authenticated or email not available');
      return;
    }

    setLoading(true);

    try {
      console.log('=== STARTING PAYMENT SUBMISSION ===');
      console.log('Submitting payment for user:', currentUser.uid);
      console.log('User email:', currentUser.email);

      const fileExt = proofFile.name.split('.').pop();
      const fileName = `proofs/${currentUser.uid}_${Date.now()}.${fileExt}`;

      console.log('Uploading file:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('image')
        .upload(fileName, proofFile);

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        alert('Failed to upload proof image: ' + uploadError.message);
        setLoading(false);
        return;
      }

      console.log('✅ File uploaded successfully:', uploadData);

      const { data: publicUrlData } = supabase.storage
        .from('image')
        .getPublicUrl(fileName);

      const publicURL = publicUrlData?.publicUrl;

      if (!publicURL) {
        alert('Failed to get public URL for proof image');
        setLoading(false);
        return;
      }

      console.log('Public URL generated:', publicURL);

      const { data: insertedData, error: insertError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: currentUser.uid,
            user_email: currentUser.email,
            date: new Date().toISOString(),
            method: modalPaymentMethod,
            amount: pointsAmount,
            ref_no: refNo,
            proof_url: publicURL,
            status: 'Pending',
            account_number: accountNumber,
          },
        ])
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        alert('Failed to submit payment: ' + insertError.message);
        setLoading(false);
        return;
      }

      console.log('Transaction inserted successfully:', insertedData);

      alert('Payment proof submitted successfully!');
      closePaymentModal();
      clearProof();

      await fetchData(currentUser.uid);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to submit payment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="points-topup-wrapper">
        <TopBar />
        <StudentSidebar />
        <main className="points-topup-content">
          <p>Please log in to access this page.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="points-topup-wrapper">
      <TopBar />
      <StudentSidebar />
      <main className="points-topup-content">
        <section className="section payment-method-selection">
          <h2>Choose a payment method</h2>
          <div className="payment-options">
            {['GCash', 'UnionBank'].map((method) => (
              <div
                key={method}
                className={`payment-card ${modalPaymentMethod === method ? 'selected' : ''}`}
                onClick={() => handlePaymentClick(method)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={method === 'GCash' ? GCashLogo : UnionBankLogo}
                  alt={method}
                  className="payment-logo"
                  onError={(e) => {
                    console.error('Image failed to load for method:', method, e?.target?.src);
                    try { e.target.onerror = null; e.target.src = '/logo512.png'; } catch {}
                  }}
                />
                <p>Pay with {method}</p>
              </div>
            ))}
          </div>
        </section>

        {modalPaymentMethod && (
          <section className="section payment-details">
            <h3>Payment details</h3>
            <p>
              Send payment to {modalPaymentMethod} number:{' '}
              <strong>{PAYMENT_METHODS[modalPaymentMethod]?.accountNumber}</strong>
            </p>

            <label htmlFor="user-email" className="form-label">
              Your Email
            </label>
            <input
              id="user-email"
              type="email"
              className="form-input"
              value={currentUser.email}
              disabled
              readOnly
            />

            <label htmlFor="requested-points" className="form-label">
              Requested Points (₱1 = 1 Point)
            </label>
            <input
              id="requested-points"
              type="text"
              className="form-input"
              value={requestedPoints}
              placeholder="Enter amount in PHP (e.g., 500)"
              onChange={handlePointsChange}
              inputMode="numeric"
            />
            {requestedPoints && (
              <p className="points-info">
                You will receive <strong>{requestedPoints}</strong> points
              </p>
            )}

            <label htmlFor="account-number" className="form-label">
              Your {modalPaymentMethod} Account Number
            </label>
            <input
              id="account-number"
              type="text"
              className={`form-input ${accountNumberError ? 'error' : ''}`}
              placeholder={modalPaymentMethod === 'GCash' ? '09XXXXXXXXX' : '12-digit UnionBank account number'}
              inputMode="numeric"
              value={accountNumber}
              onChange={handleAccountNumberChange}
            />
            {accountNumberError && (
              <p className="error-message" style={{ color: '#b91c1c', fontSize: '14px', marginTop: '4px' }}>
                {accountNumberError}
              </p>
            )}

            <label htmlFor="ref-no" className="form-label">
              Reference Number
            </label>
            <input
              id="ref-no"
              type="text"
              className="form-input"
              value={refNo}
              placeholder="Enter reference number"
              onChange={(e) => setRefNo(e.target.value)}
            />

            <label htmlFor="proof" className="form-label">
              Upload Proof of Payment (image)
            </label>
            <input
              id="proof"
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleProofUpload}
            />

            {proofPreviewUrl && (
              <div className="proof-preview">
                <img src={proofPreviewUrl} alt="Payment proof preview" />
                <button type="button" className="btn-secondary" onClick={clearProof}>
                  Remove
                </button>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleSubmitPayment}
              disabled={
                loading || 
                !modalPaymentMethod ||
                !refNo || 
                !requestedPoints || 
                !proofFile || 
                !accountNumber ||
                !isAccountNumberValidCurrent() ||
                !!accountNumberError
              }
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </section>
        )}

        <section className="section transaction-history">
          <h2>Transaction History</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Amount (Points)</th>
                <th>Reference Number</th>
                <th>Status</th>
                {isAdmin && <th>QR</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="no-data">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.method}</td>
                    <td>{tx.amount ? `${tx.amount} points` : '-'}</td>
                    <td>{tx.ref_no}</td>
                    <td>
                      <div className="status-indicator">
                        <div className={`status-dot ${tx.status.toLowerCase()}`}></div>
                        <span>{tx.status}</span>
                        {tx.status === 'Rejected' && tx.rejection_reason && (
                          <button
                            type="button"
                            className="rejection-reason-btn"
                            onClick={() => setRejectionReasonModal(tx)}
                            title="View rejection reason"
                            aria-label="View rejection reason"
                          >
                            ℹ️
                          </button>
                        )}
                      </div>
                    </td>
                    {isAdmin && (
                      <td>
                        <div className="qr-container">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setVisibleQrForRow(visibleQrForRow === tx.id ? null : tx.id)}
                          >
                            {visibleQrForRow === tx.id ? 'Hide QR' : 'Generate QR'}
                          </button>
                          {visibleQrForRow === tx.id && (
                            <QRCodeCanvas
                              value={JSON.stringify({
                                ...tx,
                                recipient: PAYMENT_METHODS[tx.method]?.accountNumber,
                                refNo: tx.ref_no,
                              })}
                              size={96}
                              includeMargin
                            />
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {rejectionReasonModal && (
          <div 
            className="modal-overlay" 
            onClick={() => setRejectionReasonModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rejection-modal-title"
          >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h2 id="rejection-modal-title">Rejection Reason</h2>
              <p><strong>Transaction ID:</strong> {rejectionReasonModal.id}</p>
              <p><strong>Date:</strong> {new Date(rejectionReasonModal.date).toLocaleString()}</p>
              <p><strong>Amount:</strong> {rejectionReasonModal.amount} points</p>
              <p><strong>Reason:</strong></p>
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                marginTop: '8px',
                minHeight: '60px'
              }}>
                {rejectionReasonModal.rejection_reason}
              </div>
              <div className="modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setRejectionReasonModal(null)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showPaymentModal && (
          <PaymentModal paymentMethod={modalPaymentMethod} onClose={closePaymentModal} />
        )}
      </main>
    </div>
  );
};

export default PointsTopup;