// src/components/TestGamepad.tsx
import React from 'react';
import Gamepad from 'react-gamepad';

const TestGamepad: React.FC = () => {
  const handleButtonChange = (buttonName: string, down: boolean) => {
    console.log(`Button ${buttonName} is ${down ? 'pressed' : 'released'}`);
  };

  return (
    <Gamepad onButtonChange={handleButtonChange} deadZone={0.1}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Gamepad Test</h2>
        <p>Press any button on your gamepad.</p>
      </div>
    </Gamepad>
  );
};

export default TestGamepad;