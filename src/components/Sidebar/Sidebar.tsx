// src/components/Sidebar/Sidebar.tsx
import React, { useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GamepadContext } from '../../contexts/GamepadContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { onButtonDown } = useContext(GamepadContext);
  const navigate = useNavigate();

  // Handle gamepad input when sidebar is open
  const handleButtonDown = useCallback(
    (buttonIndex: number, gamepadIndex: number): boolean => {
      if (!isOpen) return false;

      console.log(`Sidebar: Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`);

      switch (buttonIndex) {
        case 0: // 'A' button to select menu items
          // Implement logic to determine which menu item is selected
          // For simplicity, navigate to Home
          navigate('/');
          onClose();
          return true;
        case 1: // 'B' button to close sidebar
          onClose();
          return true;
        case 13: // D-Pad Down
          // Navigate down the menu items
          // Implement your logic here
          return true;
        case 12: // D-Pad Up
          // Navigate up the menu items
          // Implement your logic here
          return true;
        default:
          return false;
      }
    },
    [isOpen, navigate, onClose]
  );

  useEffect(() => {
    // Subscribe to gamepad events with high priority when sidebar is open
    if (isOpen) {
      const unsubscribe = onButtonDown(handleButtonDown, 4); // High priority
      return () => {
        unsubscribe();
      };
    }
  }, [onButtonDown, handleButtonDown, isOpen]);

  return (
    <>
      <motion.div
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <button className="toggle-button" onClick={onClose}>
          Close
        </button>
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={onClose}>Home</Link>
            </li>
            <li>
              <Link to="/library" onClick={onClose}>Library</Link>
            </li>
            <li>
              <Link to="/settings" onClick={onClose}>Settings</Link>
            </li>
          </ul>
        </nav>
      </motion.div>
      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;
