import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gamepad from 'react-gamepad';
import Home from './pages/Home';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import './App.css';

const App: React.FC = () => {
  const handleButtonChange = (buttonName: string, down: boolean) => {
    console.log(`Button ${buttonName} is ${down ? 'pressed' : 'released'}`);
  };

  return (
    <Gamepad
      onButtonChange={handleButtonChange}
      deadZone={0.1}
    >
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Gamepad>
  );
};

export default App;
