import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('settings-page')
export class SettingsPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      height: 100%;
    }

    .page-container {
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 30px;
    }

    .settings-section {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .settings-section h2 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 1.2rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }
  `;

  @state()
  private gamepadEnabled = true;

  @state()
  private soundEnabled = true;

  @state()
  private notificationsEnabled = false;

  render() {
    return html`
      <div class="page-container">
        <h1>Settings</h1>
        
        <div class="settings-section">
          <h2>General</h2>
          <div class="setting-item">
            <span>Enable Gamepad</span>
            <label class="toggle">
              <input type="checkbox" 
                     ?checked=${this.gamepadEnabled}
                     @change=${() => this.gamepadEnabled = !this.gamepadEnabled}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span>Enable Sound</span>
            <label class="toggle">
              <input type="checkbox" 
                     ?checked=${this.soundEnabled}
                     @change=${() => this.soundEnabled = !this.soundEnabled}>
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span>Enable Notifications</span>
            <label class="toggle">
              <input type="checkbox" 
                     ?checked=${this.notificationsEnabled}
                     @change=${() => this.notificationsEnabled = !this.notificationsEnabled}>
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h2>Display</h2>
          <div class="setting-item">
            <span>Theme</span>
            <select>
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'settings-page': SettingsPage;
  }
}