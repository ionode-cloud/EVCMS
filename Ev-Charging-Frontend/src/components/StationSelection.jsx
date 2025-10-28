import React from 'react';
import { MapPin, Zap, Plug, BatteryCharging } from 'lucide-react';
import { STATION_DATA, RATE_PER_KWH } from '../data/constants';
import { RupeeIcon } from '../data/utils';
import '../App.css'

const StationSelection = ({ setScreen, setStation }) => {
    const handleUseStation = (station) => {
        setStation(station);
        setScreen('charging');
    };

    return (
        <>
            <h2 className="page-title">Find a Charging Station</h2>
            <p style={{ color: 'var(--color-text-medium)', marginBottom: '30px' }}>
                Select an available station to start charging
            </p>
            <div className="station-grid">
                {STATION_DATA.map((station) => (
                    <div key={station.id} className="card station-card">
                        <div className={`status-bar ${station.available ? 'status-available' : 'status-occupied'}`}>
                            {station.available ? 'Available Now' : 'Occupied'}
                        </div>

                        <div className="station-details">
                            <h3>{station.name}</h3>
                            <p>
                                <MapPin size={16} style={{ marginRight: '6px' }} />{station.address}
                            </p>

                            <div className="station-features">
                                <div className="feature-item" style={{ color: station.available ? 'var(--color-available)' : 'var(--color-text-medium)' }}>
                                    <Zap size={18} />
                                    <span>{station.power}</span>
                                </div>
                                <div className="feature-item">
                                    <Plug size={18} />
                                    <span>{station.connector}</span>
                                </div>
                                <div className="feature-item">
                                    <span>
                                        <RupeeIcon /> {RATE_PER_KWH}/kWh
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button className="button-primary" onClick={() => handleUseStation(station)} disabled={!station.available}>
                            <BatteryCharging size={18} style={{ marginRight: '6px' }} />
                            {station.available ? 'Start Charging' : 'Station Occupied'}
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default StationSelection;
