// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { GamepadProvider } from './contexts/GamepadContext';
import './App.css';

const App: React.FC = () => {
  return (
    <GamepadProvider>
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
    </GamepadProvider>
  );
};

export default App;
