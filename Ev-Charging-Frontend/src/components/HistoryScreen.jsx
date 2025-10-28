import React from 'react';
import { Download } from 'lucide-react';
import { RupeeIcon } from '../data/utils';
import '../App.css';

const HistoryScreen = ({ setScreen, history, setHistory }) => {

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('history');
  };

  return (
    <>
      <h2 className="page-title">Charging History</h2>
      <p style={{ color: 'var(--color-text-medium)', marginBottom: '24px' }}>
        View all your past charging sessions
      </p>

      <div className="card" style={{ padding: '0 24px' }}>
        {history.length === 0 ? (
          <p style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-text-medium)' }}>
            No charging sessions recorded yet.
          </p>
        ) : (
          history.map((session) => (
            <div key={session.id} className="history-item">
              <div className="history-info">
                <h4>{session.station}</h4>
                <p>
                  {session.timestamp} &nbsp; • &nbsp; Energy: {(session.energy / 1000).toFixed(3)} kWh
                </p>
              </div>
              <div className="history-actions">
                <span className="history-price" style={{ display: 'flex', alignItems: 'center' }}>
                  <RupeeIcon /> {session.cost.toFixed(2)}
                </span>
                <button className="download-button">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="button-group" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          type="button"
          className="button-secondary"
          style={{ borderColor: 'var(--color-primary-green)', color: 'var(--color-primary-green)' }}
        >
          <Download size={18} style={{ marginRight: '6px' }} />
          Download All Bills
        </button>

        <button
          type="button"
          className="button-primary"
          onClick={clearHistory}
          style={{ backgroundColor: 'var(--color-not-available)' }}
        >
          Clear History
        </button>
      </div>
    </>
  );
};

export default HistoryScreen;
