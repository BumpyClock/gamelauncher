// src/hooks/useGamepad.js

import { useState, useEffect } from 'react';

const useGamepad = () => {
  const [gamepads, setGamepads] = useState({});

  useEffect(() => {
    const updateGamepads = () => {
      const connectedGamepads = navigator.getGamepads();
      const gamepadsArray = {};
      for (let i = 0; i < connectedGamepads.length; i++) {
        const gp = connectedGamepads[i];
        if (gp) {
          gamepadsArray[gp.index] = gp;
        }
      }
      setGamepads(gamepadsArray);
    };

    window.addEventListener('gamepadconnected', updateGamepads);
    window.addEventListener('gamepaddisconnected', updateGamepads);

    const interval = setInterval(updateGamepads, 100); // Polling interval

    return () => {
      window.removeEventListener('gamepadconnected', updateGamepads);
      window.removeEventListener('gamepaddisconnected', updateGamepads);
      clearInterval(interval);
    };
  }, []);

  return gamepads;
};

export default useGamepad;
