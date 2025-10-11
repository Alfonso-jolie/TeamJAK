import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_BALANCE } from '../../constants';

const PointsBalance = ({ onTopupClick, userBalance = DEFAULT_BALANCE }) => {
  return (
    <section className="section">
      <p>Your current balance is {userBalance} Points.</p>
      <button
        className="topup-btn btn-primary"
        onClick={onTopupClick}
      >
        Top Up Now
      </button>
    </section>
  );
};

PointsBalance.propTypes = {
  onTopupClick: PropTypes.func.isRequired,
  userBalance: PropTypes.string,
};

PointsBalance.defaultProps = {
  userBalance: DEFAULT_BALANCE,
};

export default PointsBalance;
