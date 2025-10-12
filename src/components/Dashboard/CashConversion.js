import React from 'react';

const CashConversion = () => {
  // Sample data matching the image
  const conversionRequests = [
    {
      id: 1,
      vendor: 'Vendor A',
      amount: 'P5,000',
      method: 'Bank Transfer',
      requestDate: '2025-01-10',
      status: 'Pending'
    },
    {
      id: 2,
      vendor: 'Vendor B',
      amount: 'P3,200',
      method: 'GCash',
      requestDate: '2025-01-08',
      status: 'Approved'
    },
    {
      id: 3,
      vendor: 'Vendor C',
      amount: 'P4,500',
      method: 'PayPal',
      requestDate: '2025-01-05',
      status: 'Rejected'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return { color: '#10b981', backgroundColor: '#ecfdf3' };
      case 'Pending':
        return { color: '#f59e0b', backgroundColor: '#fffbeb' };
      case 'Rejected':
        return { color: '#ef4444', backgroundColor: '#fef2f2' };
      default:
        return { color: '#6b7280', backgroundColor: '#f9fafb' };
    }
  };

  return (
    <div className="section">
      <h2>Cash Conversion Request</h2>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {conversionRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.vendor}</td>
                <td>{request.amount}</td>
                <td>{request.method}</td>
                <td>{request.requestDate}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={getStatusColor(request.status)}
                  >
                    {request.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn approve-btn" title="Approve">
                      ✓
                    </button>
                    <button className="action-btn reject-btn" title="Reject">
                      ✗
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashConversion;
