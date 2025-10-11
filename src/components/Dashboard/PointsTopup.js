import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { PAYMENT_METHODS, DEFAULT_BALANCE } from '../../constants';
import GCashLogo from '../../design/Gcash.png';
import UnionBankLogo from '../../design/unionbank.png';
import PaymentModal from './PaymentModal';

const PointsTopup = ({ isAdmin, userBalance = DEFAULT_BALANCE }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalPaymentMethod, setModalPaymentMethod] = useState(null);
  const [refNo, setRefNo] = useState('');
  const [proofPreviewUrl, setProofPreviewUrl] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [visibleQrForRow, setVisibleQrForRow] = useState(null);

  // Sample transaction data
  const transactions = [
    { id: 1, date: '2025-08-05', method: 'GCash', amount: '₱500', status: 'Completed' },
    { id: 2, date: '2025-08-01', method: 'UnionBank', amount: '₱1,000', status: 'Pending' }
  ];

  const handlePaymentClick = (method) => {
    setModalPaymentMethod(method);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setModalPaymentMethod(null);
  };

  const handleProofUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProofPreviewUrl(url);
  };

  const clearProof = () => {
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    setProofPreviewUrl('');
  };

  return (
    <>
      <section className="section">
        <h2>Choose a payment method</h2>
        <div className="payment-options">
          <div
            className="payment-card"
            onClick={() => handlePaymentClick('GCash')}
          >
            <img src={GCashLogo} alt="GCash" className="payment-logo" />
            <p>Pay with GCash</p>
          </div>
          <div
            className="payment-card"
            onClick={() => handlePaymentClick('UnionBank')}
          >
            <img
              src={UnionBankLogo}
              alt="UnionBank"
              className="payment-logo"
            />
            <p>Pay with UnionBank</p>
          </div>
        </div>
      </section>

      {selectedMethod && (
        <section className="section">
          <h3>Payment details</h3>
          <div className="form-row">
            <p>
              Send payment to {selectedMethod} number:
              {' '}<strong>{PAYMENT_METHODS[selectedMethod]?.accountNumber}</strong>
            </p>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="ref-no">Ref No. </label>
            <input
              id="ref-no"
              className="form-input"
              type="text"
              placeholder="Enter reference number"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="proof">Upload proof of payment (image)</label>
            <input
              id="proof"
              className="form-input"
              type="file"
              accept="image/*"
              onChange={handleProofUpload}
            />
          </div>

          {proofPreviewUrl && (
            <div className="form-row">
              <div className="proof-preview" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={proofPreviewUrl} alt="Payment proof preview" style={{ maxHeight: 120, borderRadius: 8 }} />
                <button type="button" className="btn-secondary" onClick={clearProof}>Remove</button>
              </div>
            </div>
          )}

          <div className="form-row" style={{ marginTop: 12 }}>
            <label className="form-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={isAdmin}
                readOnly
              />
              Admin view
            </label>
          </div>
        </section>
      )}

      {/* Transaction History */}
      <section className="section transaction-history">
        <h2>Transaction History</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              {isAdmin && <th>QR</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.method}</td>
                <td>{tx.amount}</td>
                <td>{tx.status}</td>
                {isAdmin && (
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                            refNo: refNo || undefined,
                          })}
                          size={96}
                          includeMargin
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          paymentMethod={modalPaymentMethod}
          onClose={closePaymentModal}
        />
      )}
    </>
  );
};

export default PointsTopup;
