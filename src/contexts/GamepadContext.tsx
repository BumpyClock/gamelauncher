// src/contexts/GamepadContext.tsx

import React, { createContext, useRef, ReactNode, useCallback } from 'react';
import useGamepad from '../hooks/useGamepad';

interface GamepadContextProps {
  onButtonDown: (
    callback: (buttonIndex: number, gamepadIndex: number) => boolean,
    priority?: number
  ) => () => void;
  onButtonUp: (
    callback: (buttonIndex: number, gamepadIndex: number) => boolean,
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
    { callback: (buttonIndex: number, gamepadIndex: number) => boolean; priority: number }[]
  >([]);
  const upListenersRef = useRef<
    { callback: (buttonIndex: number, gamepadIndex: number) => boolean; priority: number }[]
  >([]);

  const handleButtonDown = useCallback((buttonIndex: number, gamepadIndex: number) => {
    for (const listener of downListenersRef.current) {
      const handled = listener.callback(buttonIndex, gamepadIndex);
      if (handled) {
        // Stop after the event has been handled
        break;
      }
      // Otherwise, continue to the next listener
    }
  }, []);

  const handleButtonUp = useCallback((buttonIndex: number, gamepadIndex: number) => {
    for (const listener of upListenersRef.current) {
      const handled = listener.callback(buttonIndex, gamepadIndex);
      if (handled) {
        break;
      }
    }
  }, []);

  useGamepad(handleButtonDown, handleButtonUp);

  const onButtonDown = (
    callback: (buttonIndex: number, gamepadIndex: number) => boolean,
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
    callback: (buttonIndex: number, gamepadIndex: number) => boolean,
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
