import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { GamepadController } from './GamepadController';

/**
 * Example component demonstrating how to use the GamepadController
 */
@customElement('gamepad-example')
export class GamepadExample extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      font-family: monospace;
    }
    
    .status {
      margin-bottom: 16px;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 4px;
    }
    
    .button-status {
      margin: 4px 0;
    }
    
    .pressed {
      color: green;
      font-weight: bold;
    }
  `;

  // Create the controller instance
  private gamepad = new GamepadController(this);
  
  @state()
  private lastButtonPressed: string = 'None';
  
  @state()
  private buttonStates: Map<string, boolean> = new Map();
  
  private cleanupFunctions: Array<() => void> = [];

  connectedCallback() {
    super.connectedCallback();
    
    // Register button handlers with different priorities
    
    // High priority handler for special buttons (e.g., Home button)
    const cleanup1 = this.gamepad.onButtonDown((buttonIndex, gamepadIndex) => {
      if (buttonIndex === 16) { // Xbox Home button
        console.log('Home button pressed - high priority handler');
        this.lastButtonPressed = `Home (Gamepad ${gamepadIndex})`;
        this.requestUpdate();
        return true; // Handled, stop propagation
      }
      return false; // Not handled, continue to next handler
    }, 10); // Priority 10 (high)
    
    // Normal priority handler for all other buttons
    const cleanup2 = this.gamepad.onButtonDown((buttonIndex, gamepadIndex) => {
      console.log(`Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`);
      this.lastButtonPressed = `Button ${buttonIndex} (Gamepad ${gamepadIndex})`;
      this.buttonStates.set(`${gamepadIndex}-${buttonIndex}`, true);
      this.requestUpdate();
      return false; // Allow other handlers to process
    }, 0); // Priority 0 (normal)
    
    // Button up handler
    const cleanup3 = this.gamepad.onButtonUp((buttonIndex, gamepadIndex) => {
      console.log(`Button ${buttonIndex} released on gamepad ${gamepadIndex}`);
      this.buttonStates.set(`${gamepadIndex}-${buttonIndex}`, false);
      this.requestUpdate();
      return false;
    });
    
    // Axis change handler
    const cleanup4 = this.gamepad.onAxisChange((axisIndex, value, gamepadIndex) => {
      // Only log significant changes (deadzone)
      if (Math.abs(value) > 0.1) {
        console.log(`Axis ${axisIndex} on gamepad ${gamepadIndex}: ${value.toFixed(2)}`);
      }
      return false;
    });
    
    this.cleanupFunctions = [cleanup1, cleanup2, cleanup3, cleanup4];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up all listeners
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }

  render() {
    const gamepads = this.gamepad.getGamepads();
    const connectedCount = gamepads.filter(gp => gp !== null).length;
    
    return html`
      <div class="status">
        <h3>Gamepad Controller Example</h3>
        <p>Connected Gamepads: ${connectedCount}</p>
        <p>Last Button Pressed: <span class="${this.lastButtonPressed !== 'None' ? 'pressed' : ''}">${this.lastButtonPressed}</span></p>
      </div>
      
      <div>
        <h4>Current Button States:</h4>
        ${Array.from(this.buttonStates.entries()).map(([key, pressed]) => {
          const [gamepadIndex, buttonIndex] = key.split('-');
          return html`
            <div class="button-status">
              Gamepad ${gamepadIndex}, Button ${buttonIndex}: 
              <span class="${pressed ? 'pressed' : ''}">
                ${pressed ? 'PRESSED' : 'Released'}
              </span>
            </div>
          `;
        })}
      </div>
      
      <div>
        <h4>Instructions:</h4>
        <ul>
          <li>Connect a gamepad and press buttons</li>
          <li>The Home button (button 16 on Xbox) has high priority and will log a special message</li>
          <li>All button presses are displayed with their current state</li>
          <li>Check the console for axis movements</li>
        </ul>
      </div>
    `;
  }
}

// Type declaration for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'gamepad-example': GamepadExample;
  }
}