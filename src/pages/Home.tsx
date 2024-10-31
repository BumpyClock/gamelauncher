// src/pages/Home.tsx

import React, {useState, useCallback, useContext, useEffect} from 'react';
import Spotlight from '../components/Spotlight/Spotlight.tsx';
import { GamepadContext } from '../contexts/GamepadContext';

import './Page.css';

const spotlightItems: string[] = [
  "Dyson sphere program",
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
    (buttonIndex: number) => {
      switch (buttonIndex) {
        case 13: // D-Pad Down
          if (focusedComponent === 'spotlight') {
            // In this example, we only have the spotlight, so we might set focus to sidebar or another component
            // For now, we keep focus on the spotlight
          }
          break;
        case 12: // D-Pad Up
          if (focusedComponent === 'sidebar') {
            setFocusedComponent('spotlight');
          }
          break;
        default:
          break;
      }
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
          // If there is another component, set focus to it
          // For this example, we might toggle focus to 'sidebar' or keep it on 'spotlight'
        }}
      />
    </div>
  );
};

export default Home;