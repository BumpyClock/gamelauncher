import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Gamepad from 'react-gamepad';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonChange = (buttonName, down) => {
    if (down) {
      if (buttonName === 'Start') {
        // Toggle sidebar
        setIsOpen((prev) => !prev);
      }

      if (isOpen) {
        switch (buttonName) {
          case 'A':
            navigate('/');
            setIsOpen(false);
            break;
          case 'B':
            navigate('/library');
            setIsOpen(false);
            break;
          case 'X':
            navigate('/settings');
            setIsOpen(false);
            break;
          default:
            break;
        }
      }
    }
  };

  return (
    <Gamepad onButtonChange={handleButtonChange}>
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
    </Gamepad>
  );
};

export default Sidebar;
