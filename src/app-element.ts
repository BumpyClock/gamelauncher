import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { routes } from './router';
import { Router } from '@lit-labs/router';
import { GamepadController } from './controllers/GamepadController';
import './components/sidebar-element';

@customElement('app-element')
export class AppElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .app-container {
      display: flex;
      height: 100%;
      background: #1a1a1a;
      color: #fff;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      background: #f0f0f0;
      color: #333;
    }

    .menu-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      background: #3a3a3a;
      border: none;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .menu-toggle:hover {
      background: #4a4a4a;
    }
  `;

  @state()
  private sidebarOpen = true;



  private gamepadController: GamepadController;
  private cleanupGamepadListener?: () => void;

  constructor() {
    super();
    this.gamepadController = new GamepadController(this);
    (window as any).gamepadContext = this.gamepadController;
    window.addEventListener('popstate', () => {
      // route change
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.cleanupGamepadListener = this.gamepadController.onButtonDown(
      (buttonIndex: number, gamepadIndex: number): boolean => {
        console.log(`App: Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`);
        if (buttonIndex === 9) {
          if (this.sidebarOpen) {
            console.log('App: Button 9 pressed, closing sidebar');
            this.sidebarOpen = false;
          } else {
            console.log('App: Button 9 pressed, opening sidebar');
            this.sidebarOpen = true;
          }
          return true;
        }
        return false;
      },
      5
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.cleanupGamepadListener) {
      this.cleanupGamepadListener();
      this.cleanupGamepadListener = undefined;
    }
  }

  private _router?: Router;

  firstUpdated() {
    const outlet = this.shadowRoot!.querySelector('#outlet')! as Element;
    this._router = new Router(this, routes);
    (this._router as any).outlet = outlet;
    this._router.goto(window.location.pathname);
    this.addEventListener('navigate', (e: Event) => {
      const customEvent = e as CustomEvent;
      const path = customEvent.detail.path as string;
      this._router?.goto(path);
    });
    this.addEventListener('close-sidebar', () => {
      this.sidebarOpen = false;
    });
  }

  private toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  render() {
    return html`
      <div class="app-container">
        <button class="menu-toggle" @click=${this.toggleSidebar}>
          ☰ Menu
        </button>
        <sidebar-element .isOpen=${this.sidebarOpen}></sidebar-element>
        <main class="content">
          <div id="outlet"></div>
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-element': AppElement;
  }
}
