// src/components/TestGamepad.tsx
import React from 'react';
import Gamepad from 'react-gamepad';

const TestGamepad: React.FC = () => {
  const handleButtonDown = (buttonName: string, gamepadIndex: number) => {
    console.log(`Button ${buttonName} down on gamepad ${gamepadIndex}`);
  };
  const handleButtonUp = (buttonName: string, gamepadIndex: number) => {
    console.log(`Button ${buttonName} up on gamepad ${gamepadIndex}`);
  };

  return (
    <Gamepad onButtonDown={handleButtonDown} onButtonUp={handleButtonUp} deadZone={0.1}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Gamepad Test</h2>
        <p>Press any button on your gamepad.</p>
      </div>
    </Gamepad>
  );
};

export default TestGamepad;