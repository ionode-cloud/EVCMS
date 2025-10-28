import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Clock, Check } from 'lucide-react';
import { MAX_CAPACITY_W, RATE_PER_KWH } from '../data/constants';
import { RupeeIcon } from '../data/utils';
import '../App.css';

const ChargingScreen = ({ station, userData, setScreen, setSessionData, currentSession }) => {
    const initialEnergy = currentSession?.energy || 0;
    const initialDuration = currentSession?.duration || 0;
    const initialWatts = currentSession?.watts || 0;

    const [isCharging, setIsCharging] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(initialDuration);
    const [energyConsumed, setEnergyConsumed] = useState(initialEnergy);
    const [currentWatts, setCurrentWatts] = useState(initialWatts);

    if (!station) {
        return (
            <div className="dialog-box card">
                <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Error</h2>
                <p>No station information available. Please go back.</p>
                <button className="button-primary" onClick={() => setScreen('stations')}>Go to Stations</button>
            </div>
        );
    }

    useEffect(() => {
        let interval;
        if (isCharging) {
            interval = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
                const minWatts = 10000;
                const maxRange = MAX_CAPACITY_W - minWatts;
                const newWatts = Math.round(Math.random() * maxRange + minWatts);
                setCurrentWatts(newWatts);
                setEnergyConsumed((prevEnergy) => prevEnergy + newWatts / 3600);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCharging]);

    const safeEnergyConsumed = isNaN(energyConsumed) ? 0 : energyConsumed;
    const energyInKWh = safeEnergyConsumed / 1000;
    const totalCost = (energyInKWh * RATE_PER_KWH).toFixed(2);

    const formattedTime = useMemo(() => {
        const min = Math.floor(elapsedTime / 60);
        const sec = elapsedTime % 60;
        return `${min < 10 ? '0' : ''}${min}m ${sec < 10 ? '0' : ''}${sec}s`;
    }, [elapsedTime]);

    const safeCurrentWatts = isNaN(currentWatts) ? 0 : currentWatts;
    const wattPercent = ((safeCurrentWatts / MAX_CAPACITY_W) * 100).toFixed(0);

    const handleStartStop = () => {
        if (isCharging) {
            setIsCharging(false);
            setSessionData({
                station: station.name,
                duration: elapsedTime,
                energy: parseFloat(safeEnergyConsumed.toFixed(3)),
                cost: parseFloat(totalCost),
                watts: safeCurrentWatts,
                timestamp: new Date().toLocaleString(),
            });
            setScreen('payment_due');
        } else {
            setIsCharging(true);
            setElapsedTime(0);
            setEnergyConsumed(0);
            setCurrentWatts(0);
            setSessionData({ station: station.name, energy: 0, cost: 0, duration: 0, watts: 0, timestamp: new Date().toLocaleString() });
        }
    };

    return (
        <div className="charging-view">
            <div className="charging-header">
                <h2 className="charging-title" style={{ marginBottom: '4px' }}>{station.name}</h2>
                <div className="status-tag">{station.power}</div>
            </div>
            <p style={{ color: 'var(--color-text-medium)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>
                <MapPin size={12} style={{ marginRight: '4px' }} />{station.address}
            </p>

            <div className="charging-stats-grid card">
                <div className="stat-item">
                    <div className="stat-value">{(MAX_CAPACITY_W / 1000).toFixed(0)}kW</div>
                    <div className="stat-label">Capacity (Max)</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{RATE_PER_KWH}<RupeeIcon />/kWh</div>
                    <div className="stat-label">Rate</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{userData.vehicle}</div>
                    <div className="stat-label">Vehicle No.</div>
                </div>
            </div>

            <div className="gauge-grid">
                <div className="gauge-card card" style={{ borderRight: '1px solid #2F2F2F' }}>
                    <p className="gauge-value" style={{ color: isCharging ? 'var(--color-primary-green)' : 'var(--color-text-medium)' }}>
                        {(safeCurrentWatts / 1000).toFixed(1)}
                    </p>
                    <p className="gauge-unit">kW</p>
                    <p className="gauge-label">(Current Power)</p>
                    <p className="instant-power">{station.connector}</p>
                </div>
                <div className="gauge-card card">
                    <p className="gauge-value">{(safeEnergyConsumed / 1000).toFixed(3)}</p>
                    <p className="gauge-unit">kWh</p>
                    <p className="gauge-label">Consumed</p>
                    <p className="instant-power">{station.power}</p>
                </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${wattPercent}%` }}></div>
                </div>
                <div className="progress-text">
                    <span>{(safeCurrentWatts / 1000).toFixed(1)}kW/{(MAX_CAPACITY_W / 1000).toFixed(0)}kW</span>
                    <span>{wattPercent}%</span>
                </div>

                <div className="session-details">
                    <span>
                        <Clock size={16} style={{ marginRight: '6px' }} />
                        Duration: <span className="duration-text">{formattedTime}</span>
                    </span>
                    <span className="amount-text"><RupeeIcon />{totalCost}</span>
                </div>
            </div>

            <div className="button-group" style={{ justifyContent: 'center', marginTop: '30px' }}>
                <button className="button-primary" onClick={handleStartStop} style={{ width: '100%', maxWidth: '400px', backgroundColor: isCharging ? 'var(--color-not-available)' : 'var(--color-primary-green)' }}>
                    {isCharging ? 'Stop & Pay' : 'Start Charging'}
                </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--color-text-medium)' }}>
                {isCharging ? 'Charging in progress... power updates every second' : 'Press Start Charging to begin session'}
            </div>

            {isCharging && <div className="toast"><Check size={16} color="var(--color-primary-green)" /> Charging started!</div>}
        </div>
    );
};

export default ChargingScreen;