declare module 'react-gamepad' {
  import * as React from 'react';
  export interface GamepadProps {
    children?: React.ReactNode;
    onConnect?: (gamepadIndex: number) => void;
    onDisconnect?: (gamepadIndex: number) => void;
    onButtonDown?: (buttonName: string, gamepadIndex: number) => void;
    onButtonUp?: (buttonName: string, gamepadIndex: number) => void;
    onAxisChange?: (axisName: string, value: number, gamepadIndex: number) => void;
    deadZone?: number;
    stickThreshold?: number;
  }
  export default function Gamepad(props: GamepadProps): JSX.Element;
}
