import React from 'react';
import { RATE_PER_KWH } from '../data/constants';
import { RupeeIcon } from '../data/utils';
import '../App.css';

const PaymentDue = ({ setScreen, sessionData, setBalance, history, setHistory }) => {
  const handlePayNow = () => {
    setBalance((prev) => prev - sessionData.cost);
    
    const newHistoryItem = {
      id: Date.now(),
      station: sessionData.station,
      timestamp: sessionData.timestamp,
      energy: sessionData.energy,
      cost: sessionData.cost
    };

    setHistory([newHistoryItem, ...history]);
    setScreen('payment_success');
  };

  const tableData = [
    { label: 'Station', value: sessionData.station },
    { label: 'Energy Consumed', value: `${(sessionData.energy / 1000).toFixed(3)} kWh` },
    { label: 'Rate', value: <>₹ {RATE_PER_KWH} / kWh</> },
  ];

  return (
    <div className="dialog-box card">
      <h2 className="page-title">Payment Due</h2>
      <p>Review your charging session</p>

      <div className="data-table">
        {tableData.map((item, index) => (
          <div className="table-row" key={index}>
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}

        <div className="table-row table-row-total">
          <span>Total Payable</span>
          <span><RupeeIcon /> {sessionData.cost.toFixed(2)}</span>
        </div>
      </div>

      <div className="button-group">
        <button onClick={handlePayNow} className="button-primary">Pay Now</button>
        <button onClick={() => setScreen('stations')} className="button-primary">Go to Dashboard</button>
      </div>
    </div>
  );
};

export default PaymentDue;
