import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { animate } from '@lit-labs/motion';

@customElement('sidebar-element')
export class SidebarElement extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 250px;
      max-width: 80%;
      height: 100%;
      background-color: rgba(27, 27, 27, 0.95);
      transform: translateX(-100%);
      z-index: 1000;
      padding: 20px;
      box-sizing: border-box;
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .toggle-button {
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: #444;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }

    .toggle-button:hover {
      background-color: #555;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin-top: 60px;
    }

    nav ul li {
      margin-bottom: 20px;
    }

    nav ul li a {
      color: #66c0f4;
      text-decoration: none;
      font-size: 18px;
      display: block;
      padding: 10px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    nav ul li a:hover,
    nav ul li a.focused {
      background-color: rgba(102, 192, 244, 0.1);
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 999;
      background-color: rgba(0, 0, 0, 0.3);
    }
  `;

  @property({ type: Boolean })
  isOpen = false;

  @state()
  private focusedIndex = 0;

  private menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Library', path: '/library' },
    { label: 'Settings', path: '/settings' }
  ];

  private gamepadHandlerPriority = 4;
  private unsubscribeGamepad?: () => void;

  connectedCallback() {
    super.connectedCallback();
    if (this.isOpen) {
      this.subscribeToGamepad();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeFromGamepad();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('isOpen')) {
      if (this.isOpen) {
        this.subscribeToGamepad();
        this.animateSidebar(true);
      } else {
        this.unsubscribeFromGamepad();
        this.animateSidebar(false);
      }
    }
  }

  private animateSidebar(open: boolean) {
    const sidebar = this.shadowRoot?.querySelector('.sidebar');
    if (sidebar) {
      (animate as any)(sidebar, [
        { transform: open ? 'translateX(-100%)' : 'translateX(0)' },
        { transform: open ? 'translateX(0)' : 'translateX(-100%)' }
      ], {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });
    }
  }

  private subscribeToGamepad() {
    // Get gamepad context from global scope if available
    const gamepadContext = (window as any).gamepadContext;
    if (gamepadContext?.onButtonDown) {
      this.unsubscribeGamepad = gamepadContext.onButtonDown(
        this.handleGamepadInput.bind(this),
        this.gamepadHandlerPriority
      );
    }
  }

  private unsubscribeFromGamepad() {
    if (this.unsubscribeGamepad) {
      this.unsubscribeGamepad();
      this.unsubscribeGamepad = undefined;
    }
  }

  private handleGamepadInput(buttonIndex: number, gamepadIndex: number): boolean {
    if (!this.isOpen) return false;

    console.log(`Sidebar: Button ${buttonIndex} pressed on gamepad ${gamepadIndex}`);

    switch (buttonIndex) {
      case 0: // 'A' button to select menu item
        this.selectMenuItem();
        return true;
      case 1: // 'B' button to close sidebar
        this.close();
        return true;
      case 12: // D-Pad Up
        this.navigateUp();
        return true;
      case 13: // D-Pad Down
        this.navigateDown();
        return true;
      default:
        return false;
    }
  }

  private navigateUp() {
    this.focusedIndex = Math.max(0, this.focusedIndex - 1);
    this.requestUpdate();
  }

  private navigateDown() {
    this.focusedIndex = Math.min(this.menuItems.length - 1, this.focusedIndex + 1);
    this.requestUpdate();
  }

  private selectMenuItem() {
    const item = this.menuItems[this.focusedIndex];
    this.navigateTo(item.path);
    this.close();
  }

  private navigateTo(path: string) {
    // Dispatch custom event for navigation
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { path },
      bubbles: true,
      composed: true
    }));
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close-sidebar', {
      bubbles: true,
      composed: true
    }));
  }

  private handleMenuClick(path: string, event: Event) {
    event.preventDefault();
    this.navigateTo(path);
    this.close();
  }

  render() {
    return html`
      <div class="sidebar ${this.isOpen ? 'open' : ''}">
        <button class="toggle-button" @click=${this.close}>
          Close
        </button>
        <nav>
          <ul>
            ${this.menuItems.map((item, index) => html`
              <li>
                <a 
                  href=${item.path}
                  class=${index === this.focusedIndex ? 'focused' : ''}
                  @click=${(e: Event) => this.handleMenuClick(item.path, e)}
                >
                  ${item.label}
                </a>
              </li>
            `)}
          </ul>
        </nav>
      </div>
      ${this.isOpen ? html`<div class="overlay" @click=${this.close}></div>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sidebar-element': SidebarElement;
  }
}