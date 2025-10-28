import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StationSelection from './components/StationSelection';
import ChargingScreen from './components/ChargingScreen';
import PaymentDue from './components/PaymentDue';
import PaymentSuccess from './components/PaymentSuccess';
import ProfileScreen from './components/ProfileScreen';
import HistoryScreen from './components/HistoryScreen';
import WalletScreen from './components/WalletScreen';
import LoginScreen from './components/LoginScreen';

import { STATION_DATA, INITIAL_BALANCE } from './data/constants';
import './App.css';

const App = () => {
  const [currentScreen, setScreen] = useState('login');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [selectedStation, setStation] = useState(STATION_DATA[0]);
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  // Load user data from localStorage
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    const logged = localStorage.getItem('isLoggedIn');

    if (savedUser && logged === 'true') {
      setLoggedIn(true);
      setScreen('stations');
      return JSON.parse(savedUser);
    }
    return { name: '', vehicle: '', mobile: '' };
  });

  // Load history from localStorage
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [currentSession, setSessionData] = useState({
    station: STATION_DATA[0].name,
    energy: 0,
    cost: 0,
    duration: 0,
    watts: 0,
    timestamp: null
  });

  const handleLogin = (data) => {
    setUserData(data);
    setLoggedIn(true);
    setScreen('stations');

    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData({ name: '', vehicle: '', mobile: '' });

    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');

    setScreen('login');
  };

  // Save history automatically when changed
  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const renderScreen = () => {
    if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

    switch (currentScreen) {
      case 'stations':
        return <StationSelection setScreen={setScreen} setStation={setStation} />;
      case 'charging':
        return (
          <ChargingScreen
            station={selectedStation}
            userData={userData}
            setScreen={setScreen}
            setSessionData={setSessionData}
            currentSession={currentSession}
          />
        );
      case 'payment_due':
        return (
          <PaymentDue
            setScreen={setScreen}
            sessionData={currentSession}
            setBalance={setBalance}
            history={history}
            setHistory={setHistory}
          />
        );
      case 'payment_success':
        return (
          <PaymentSuccess
            setScreen={setScreen}
            sessionData={currentSession}
            balance={balance}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            setScreen={setScreen}
            userData={userData}
            balance={balance}
            setLoggedIn={handleLogout}
          />
        );
      case 'history':
        return <HistoryScreen setScreen={setScreen} history={history} setHistory={setHistory} />;
      case 'wallet':
        return <WalletScreen setScreen={setScreen} balance={balance} setBalance={setBalance} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app-container">
      {isLoggedIn && (
        <Header currentScreen={currentScreen} setScreen={setScreen} balance={balance} />
      )}
      <main className="main-content">{renderScreen()}</main>
      {isLoggedIn && (
        <footer className="footer">
          Made with <span>⚡</span> for EV Charging • Max Power: 50kW
        </footer>
      )}
    </div>
  );
};

export default App;
