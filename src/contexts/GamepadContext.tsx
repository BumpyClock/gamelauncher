// src/contexts/GamepadContext.tsx
import React, { createContext, useRef, ReactNode, useCallback } from 'react';
import useGamepad from '../hooks/useGamepad';

interface GamepadContextProps {
  onButtonDown: (
    callback: (buttonIndex: number, gamepadIndex: number) => void,
    priority?: number
  ) => () => void;
  onButtonUp: (
    callback: (buttonIndex: number, gamepadIndex: number) => void,
    priority?: number
  ) => () => void;
}

export const GamepadContext = createContext<GamepadContextProps>({
  onButtonDown: () => () => {},
  onButtonUp: () => () => {},
});

interface GamepadProviderProps {
  children: ReactNode;
}

export const GamepadProvider: React.FC<GamepadProviderProps> = ({ children }) => {
  const downListenersRef = useRef<
    { callback: (buttonIndex: number, gamepadIndex: number) => void; priority: number }[]
  >([]);
  const upListenersRef = useRef<
    { callback: (buttonIndex: number, gamepadIndex: number) => void; priority: number }[]
  >([]);

  const handleButtonDown = useCallback((buttonIndex: number, gamepadIndex: number) => {
    console.log(`GamepadContext: Button ${buttonIndex} down on gamepad ${gamepadIndex}`);
    for (const listener of downListenersRef.current) {
      listener.callback(buttonIndex, gamepadIndex);
      // Stop after the highest priority listener handles the event
      break;
    }
  }, []);

  const handleButtonUp = useCallback((buttonIndex: number, gamepadIndex: number) => {
    console.log(`GamepadContext: Button ${buttonIndex} up on gamepad ${gamepadIndex}`);
    for (const listener of upListenersRef.current) {
      listener.callback(buttonIndex, gamepadIndex);
      // Stop after the highest priority listener handles the event
      break;
    }
  }, []);

  useGamepad(handleButtonDown, handleButtonUp);

  const onButtonDown = (
    callback: (buttonIndex: number, gamepadIndex: number) => void,
    priority: number = 0
  ) => {
    downListenersRef.current.push({ callback, priority });
    // Sort listeners by priority (higher number = higher priority)
    downListenersRef.current.sort((a, b) => b.priority - a.priority);

    return () => {
      downListenersRef.current = downListenersRef.current.filter(
        (listener) => listener.callback !== callback
      );
    };
  };

  const onButtonUp = (
    callback: (buttonIndex: number, gamepadIndex: number) => void,
    priority: number = 0
  ) => {
    upListenersRef.current.push({ callback, priority });
    // Sort listeners by priority
    upListenersRef.current.sort((a, b) => b.priority - a.priority);

    return () => {
      upListenersRef.current = upListenersRef.current.filter(
        (listener) => listener.callback !== callback
      );
    };
  };

  return (
    <GamepadContext.Provider value={{ onButtonDown, onButtonUp }}>
      {children}
    </GamepadContext.Provider>
  );
};
