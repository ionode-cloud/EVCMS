import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Plug, BatteryCharging } from 'lucide-react';
import { RATE_PER_KWH } from '../data/constants';
import { RupeeIcon } from '../data/utils';
import { BACKEND_URL } from '../data/constants';
import '../App.css';

const StationSelection = ({ setScreen, setStation }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/stations`);
        if (!res.ok) throw new Error("Failed to fetch stations");
        const data = await res.json();
        setStations(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load stations.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleUseStation = (station) => {
    setStation(station);
    setScreen('charging');
  };

  if (loading) return <p>Loading stations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h2 className="page-title">Find a Charging Station</h2>
      <p style={{ color: 'var(--color-text-medium)', marginBottom: '30px' }}>
        Select an available station to start charging
      </p>
      <div className="station-grid">
        {stations.map((station) => (
          <div key={station._id} className="card station-card">
            <div className={`status-bar ${station.occupancy ? 'status-occupied' : 'status-available'}`}>
              {station.occupancy ? 'Occupied' : 'Available Now'}
            </div>

            <div className="station-details">
              <h3>{station.name}</h3>
              <p>
                <MapPin size={16} style={{ marginRight: '6px' }} />{station.address || "N/A"}
              </p>

              <div className="station-features">
                <div className="feature-item" style={{ color: station.occupancy ? 'var(--color-text-medium)' : 'var(--color-available)' }}>
                  <Zap size={18} />
                  <span>{station.currPower} kW</span>
                </div>
                <div className="feature-item">
                  <Plug size={18} />
                  <span>{station.connector || "Type2"}</span>
                </div>
                <div className="feature-item">
                  <span>
                    <RupeeIcon /> {RATE_PER_KWH}/kWh
                  </span>
                </div>
              </div>
            </div>

            <button
              className="button-primary"
              onClick={() => handleUseStation(station)}
              disabled={station.occupancy}
            >
              <BatteryCharging size={18} style={{ marginRight: '6px' }} />
              {station.occupancy ? 'Station Occupied' : 'Start Charging'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default StationSelection;
