// src/pages/Home.tsx

import React, {useState, useCallback, useContext, useEffect} from 'react';
import Spotlight from '../components/Spotlight/Spotlight.tsx';
import { GamepadContext } from '../contexts/GamepadContext';

import './Page.css';

const spotlightItems: string[] = [
  "tony hawks pro skater 3+4 Cross-Gen Edition",
  "Starfield",
  "Call of Duty black ops",
  "donut county",
  "Age of Empires IV",
  "Age of mythology retold standard edition",
  "Diablo Iv",
  "PalWorld",
  "Need for speed",
  "Star Wars Jedi fallen order ea",
  "Fallout 4"
];

const Home: React.FC = () => {
  const { onButtonDown } = useContext(GamepadContext);
  const [focusedComponent, setFocusedComponent] = useState<'spotlight' | 'sidebar'>('spotlight');

  // Handle global navigation
  const handleButtonDown = useCallback(
    (buttonIndex: number, gamepadIndex: number): boolean => {
      console.log(`Home: Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`);
      switch (buttonIndex) {
        case 13: // D-Pad Down
          if (focusedComponent === 'spotlight') {
            // Handle focus change if necessary
            return true;
          }
          break;
        case 12: // D-Pad Up
          if (focusedComponent === 'sidebar') {
            setFocusedComponent('spotlight');
            return true;
          }
          break;
        default:
          return false;
      }
      return false;
    },
    [focusedComponent]
  );

  useEffect(() => {
    const unsubscribe = onButtonDown(handleButtonDown, 0); // Lower priority
    return () => {
      unsubscribe();
    };
  }, [onButtonDown, handleButtonDown]);

  return (
    <div className="page">
      <Spotlight
        items={spotlightItems}
        isFocused={focusedComponent === 'spotlight'}
        onLoseFocus={() => {
          // Handle focus loss
        }}
      />
    </div>
  );
};

export default Home;