import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      height: 100%;
    }

    .page-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
    }

    .spotlight-section {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      min-height: 400px;
    }
  `;

  render() {
    return html`
      <div class="page-container">
        <h1>Home</h1>
        <div class="spotlight-section">
          <p>Welcome to Game Launcher!</p>
          <!-- Spotlight component will be integrated here -->
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'home-page': HomePage;
  }
}