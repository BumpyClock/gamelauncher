// src/App.tsx
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { GamepadProvider, GamepadContext } from './contexts/GamepadContext';
import './App.css';

const App: React.FC = () => {
  return (
    <GamepadProvider>
      <MainApp />
    </GamepadProvider>
  );
};

const MainApp: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { onButtonDown } = useContext(GamepadContext);

  // Handle gamepad button down events
  const handleButtonDown = useCallback(
    (buttonIndex: number, gamepadIndex: number): boolean => {
      console.log(`App: Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`);
      if (buttonIndex === 9) {
        if (isSidebarOpen) {
          console.log('App: Button 9 pressed, closing sidebar');
          setIsSidebarOpen(false);
          return true;
        } else {
          console.log('App: Button 9 pressed, opening sidebar');
          setIsSidebarOpen(true);
          return true;
        }
      }
      return false;
    },
    [isSidebarOpen]
  );

  useEffect(() => {
    // Subscribe to gamepad events with the highest priority
    const unsubscribe = onButtonDown(handleButtonDown, 5);
    return () => {
      unsubscribe();
    };
  }, [onButtonDown, handleButtonDown]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
