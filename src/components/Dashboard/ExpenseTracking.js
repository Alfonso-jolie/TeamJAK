import React, { useState } from 'react';
import { TIME_FILTERS } from '../../constants';

const ExpenseTracking = () => {
  const [filter, setFilter] = useState('Monthly');

  // Comprehensive expense data for different time periods
  const expenseData = {
    Monthly: [
      { id: 1, date: '2025-08-10', vendor: 'Coffee Shop', amount: '₱150', remaining: '₱2,350' },
      { id: 2, date: '2025-08-09', vendor: 'Grocery Store', amount: '₱1,200', remaining: '₱1,150' },
      { id: 3, date: '2025-08-08', vendor: 'Bookstore', amount: '₱500', remaining: '₱650' },
      { id: 4, date: '2025-08-07', vendor: 'Cafeteria', amount: '₱80', remaining: '₱570' },
      { id: 5, date: '2025-08-06', vendor: 'Print Shop', amount: '₱25', remaining: '₱545' },
      { id: 6, date: '2025-08-05', vendor: 'Library Fine', amount: '₱50', remaining: '₱495' },
    ],
    Weekly: [
      { id: 1, date: '2025-08-10', vendor: 'Coffee Shop', amount: '₱150', remaining: '₱2,350' },
      { id: 2, date: '2025-08-09', vendor: 'Grocery Store', amount: '₱1,200', remaining: '₱1,150' },
      { id: 3, date: '2025-08-08', vendor: 'Bookstore', amount: '₱500', remaining: '₱650' },
    ],
    Daily: [
      { id: 1, date: '2025-08-10', vendor: 'Coffee Shop', amount: '₱150', remaining: '₱2,350' },
    ],
  };

  const currentExpenseData = expenseData[filter] || expenseData.Monthly;

  return (
    <section className="section">
      {/* Filter */}
      <div className="filter-bar">
        <label htmlFor="filter">Filter: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {TIME_FILTERS.map((filterOption) => (
            <option key={filterOption.value} value={filterOption.value}>
              {filterOption.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="expense-summary">
        <p>Showing {filter.toLowerCase()} expenses ({currentExpenseData.length} transactions)</p>
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Vendor</th>
            <th>Amount Spent</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {currentExpenseData.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.vendor}</td>
              <td>{item.amount}</td>
              <td>{item.remaining}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ExpenseTracking;
