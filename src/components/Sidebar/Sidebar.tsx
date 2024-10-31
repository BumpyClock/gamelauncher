// src/components/Sidebar/Sidebar.tsx

import React, { useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GamepadContext } from '../../contexts/GamepadContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { onButtonDown } = useContext(GamepadContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  // Handle gamepad input
  const handleButtonDown = useCallback(
    (buttonIndex: number) => {
      switch (buttonIndex) {
        case 9: // 'Start' button to toggle sidebar
          setIsOpen((prev) => !prev);
          break;
        case 0: // 'A' button to select menu items
          if (isOpen) {
            // Logic to determine which menu item is selected
            // For simplicity, let's navigate to Home
            navigate('/');
            setIsOpen(false);
          }
          break;
        case 1: // 'B' button to close sidebar
          if (isOpen) {
            setIsOpen(false);
          }
          break;
        // Add more cases as needed
        default:
          break;
      }
    },
    [isOpen, navigate]
  );

  useEffect(() => {
    // Subscribe to gamepad events with appropriate priority
    const unsubscribe = onButtonDown(handleButtonDown, 1); // Higher priority
    return () => {
      unsubscribe();
    };
  }, [onButtonDown, handleButtonDown]);

  return (
    <>
      <motion.div
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'}
        </button>
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/library" onClick={() => setIsOpen(false)}>Library</Link>
            </li>
            <li>
              <Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
            </li>
          </ul>
        </nav>
      </motion.div>
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
