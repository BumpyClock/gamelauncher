// src/hooks/useGamepad.tsx
import { useEffect, useRef } from 'react';

type ButtonHandler = (buttonIndex: number, gamepadIndex: number) => void;
type AxisHandler = (axisIndex: number, value: number, gamepadIndex: number) => void;

const useGamepad = (
  onButtonDown?: ButtonHandler,
  onButtonUp?: ButtonHandler,
  onAxisChange?: AxisHandler,
  pollInterval: number = 100
) => {
  const onButtonDownRef = useRef(onButtonDown);
  const onButtonUpRef = useRef(onButtonUp);
  const onAxisChangeRef = useRef(onAxisChange);

  useEffect(() => {
    onButtonDownRef.current = onButtonDown;
  }, [onButtonDown]);

  useEffect(() => {
    onButtonUpRef.current = onButtonUp;
  }, [onButtonUp]);

  useEffect(() => {
    onAxisChangeRef.current = onAxisChange;
  }, [onAxisChange]);

  useEffect(() => {
    const previousButtons: boolean[][] = []; // [gamepadIndex][buttonIndex]
    const previousAxes: number[][] = [];     // [gamepadIndex][axisIndex]

    const handleGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      gamepads.forEach((gp, gpIndex) => {
        if (gp) {
          // Initialize previousButtons[gpIndex] if undefined
          if (!previousButtons[gpIndex]) {
            previousButtons[gpIndex] = gp.buttons.map(button => button.pressed);
          }
          // Handle buttons
          gp.buttons.forEach((button, index) => {
            const prevPressed = previousButtons[gpIndex][index];
            const currPressed = button.pressed;
            if (prevPressed !== currPressed) {
              console.log(`Gamepad ${gpIndex}, Button ${index}, Pressed: ${currPressed}`);
              if (currPressed) {
                if (onButtonDownRef.current) {
                  onButtonDownRef.current(index, gpIndex);
                }
              } else {
                if (onButtonUpRef.current) {
                  onButtonUpRef.current(index, gpIndex);
                }
              }
            }
            // Update previous button state
            previousButtons[gpIndex][index] = currPressed;
          });

          // Initialize previousAxes[gpIndex] if undefined
          if (!previousAxes[gpIndex]) {
            previousAxes[gpIndex] = gp.axes.slice();
          }
          // Handle axes
          gp.axes.forEach((value, index) => {
            const prevValue = previousAxes[gpIndex][index];
            if (value !== prevValue) {
              console.log(`Gamepad ${gpIndex}, Axis ${index}, Value: ${value}`);
              if (onAxisChangeRef.current) {
                onAxisChangeRef.current(index, value, gpIndex);
              }
              // Update previous axis value
              previousAxes[gpIndex][index] = value;
            }
          });
        }
      });
    };

    const interval = setInterval(handleGamepad, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);
};

export default useGamepad;
