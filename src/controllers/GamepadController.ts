import { ReactiveController, ReactiveControllerHost } from 'lit';

type ButtonHandler = (buttonIndex: number, gamepadIndex: number) => boolean;
type AxisHandler = (axisIndex: number, value: number, gamepadIndex: number) => boolean;

interface GamepadListener {
  callback: ButtonHandler;
  priority: number;
}

interface AxisListener {
  callback: AxisHandler;
  priority: number;
}

export class GamepadController implements ReactiveController {
  // private host: ReactiveControllerHost;
  private pollInterval: number;
  private intervalId: number | null = null;
  private previousButtons: boolean[][] = [];
  private previousAxes: number[][] = [];
  
  private downListeners: GamepadListener[] = [];
  private upListeners: GamepadListener[] = [];
  private axisListeners: AxisListener[] = [];

  constructor(host: ReactiveControllerHost, pollInterval: number = 100) {
    // this.host = host;
    this.pollInterval = pollInterval;
    host.addController(this);
  }

  hostConnected(): void {
    this.startPolling();
  }

  hostDisconnected(): void {
    this.stopPolling();
  }

  private startPolling(): void {
    if (this.intervalId) return;
    
    this.intervalId = window.setInterval(() => {
      this.handleGamepad();
    }, this.pollInterval);
  }

  private stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private handleGamepad(): void {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    for (let gpIndex = 0; gpIndex < gamepads.length; gpIndex++) {
      const gp = gamepads[gpIndex];
      if (!gp) continue;

      // Initialize arrays if needed
      if (!this.previousButtons[gpIndex]) {
        this.previousButtons[gpIndex] = gp.buttons.map(button => button.pressed);
      }
      if (!this.previousAxes[gpIndex]) {
        this.previousAxes[gpIndex] = gp.axes.slice();
      }

      // Handle buttons
      for (let buttonIndex = 0; buttonIndex < gp.buttons.length; buttonIndex++) {
        const button = gp.buttons[buttonIndex];
        const prevPressed = this.previousButtons[gpIndex][buttonIndex];
        const currPressed = button.pressed;

        if (prevPressed !== currPressed) {
          if (currPressed) {
            this.handleButtonDown(buttonIndex, gpIndex);
          } else {
            this.handleButtonUp(buttonIndex, gpIndex);
          }
          this.previousButtons[gpIndex][buttonIndex] = currPressed;
        }
      }

      // Handle axes
      for (let axisIndex = 0; axisIndex < gp.axes.length; axisIndex++) {
        const value = gp.axes[axisIndex];
        const prevValue = this.previousAxes[gpIndex][axisIndex];

        if (value !== prevValue) {
          this.handleAxisChange(axisIndex, value, gpIndex);
          this.previousAxes[gpIndex][axisIndex] = value;
        }
      }
    }
  }

  private handleButtonDown(buttonIndex: number, gamepadIndex: number): void {
    for (const listener of this.downListeners) {
      const handled = listener.callback(buttonIndex, gamepadIndex);
      if (handled) {
        break; // Stop propagation if event was handled
      }
    }
  }

  private handleButtonUp(buttonIndex: number, gamepadIndex: number): void {
    for (const listener of this.upListeners) {
      const handled = listener.callback(buttonIndex, gamepadIndex);
      if (handled) {
        break; // Stop propagation if event was handled
      }
    }
  }

  private handleAxisChange(axisIndex: number, value: number, gamepadIndex: number): void {
    for (const listener of this.axisListeners) {
      const handled = listener.callback(axisIndex, value, gamepadIndex);
      if (handled) {
        break; // Stop propagation if event was handled
      }
    }
  }

  /**
   * Register a button down event listener with optional priority
   * @param callback - Handler function that returns true if event was handled
   * @param priority - Higher number = higher priority (default: 0)
   * @returns Cleanup function to remove the listener
   */
  onButtonDown(callback: ButtonHandler, priority: number = 0): () => void {
    this.downListeners.push({ callback, priority });
    // Sort by priority (higher number = higher priority)
    this.downListeners.sort((a, b) => b.priority - a.priority);

    // Return cleanup function
    return () => {
      this.downListeners = this.downListeners.filter(
        listener => listener.callback !== callback
      );
    };
  }

  /**
   * Register a button up event listener with optional priority
   * @param callback - Handler function that returns true if event was handled
   * @param priority - Higher number = higher priority (default: 0)
   * @returns Cleanup function to remove the listener
   */
  onButtonUp(callback: ButtonHandler, priority: number = 0): () => void {
    this.upListeners.push({ callback, priority });
    // Sort by priority (higher number = higher priority)
    this.upListeners.sort((a, b) => b.priority - a.priority);

    // Return cleanup function
    return () => {
      this.upListeners = this.upListeners.filter(
        listener => listener.callback !== callback
      );
    };
  }

  /**
   * Register an axis change event listener with optional priority
   * @param callback - Handler function that returns true if event was handled
   * @param priority - Higher number = higher priority (default: 0)
   * @returns Cleanup function to remove the listener
   */
  onAxisChange(callback: AxisHandler, priority: number = 0): () => void {
    this.axisListeners.push({ callback, priority });
    // Sort by priority (higher number = higher priority)
    this.axisListeners.sort((a, b) => b.priority - a.priority);

    // Return cleanup function
    return () => {
      this.axisListeners = this.axisListeners.filter(
        listener => listener.callback !== callback
      );
    };
  }

  /**
   * Get current gamepad state
   */
  getGamepads(): (Gamepad | null)[] {
    return navigator.getGamepads ? Array.from(navigator.getGamepads()) : [];
  }

  /**
   * Check if a specific button is currently pressed
   */
  isButtonPressed(buttonIndex: number, gamepadIndex: number = 0): boolean {
    const gamepads = this.getGamepads();
    const gamepad = gamepads[gamepadIndex];
    
    if (!gamepad || buttonIndex >= gamepad.buttons.length) {
      return false;
    }
    
    return gamepad.buttons[buttonIndex].pressed;
  }

  /**
   * Get current axis value
   */
  getAxisValue(axisIndex: number, gamepadIndex: number = 0): number {
    const gamepads = this.getGamepads();
    const gamepad = gamepads[gamepadIndex];
    
    if (!gamepad || axisIndex >= gamepad.axes.length) {
      return 0;
    }
    
    return gamepad.axes[axisIndex];
  }
}