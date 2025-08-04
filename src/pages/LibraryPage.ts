import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('library-page')
export class LibraryPage extends LitElement {
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

    .library-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }

    .game-card {
      background: #f0f0f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      transition: transform 0.2s;
    }

    .game-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  `;

  render() {
    return html`
      <div class="page-container">
        <h1>My Library</h1>
        <div class="library-grid">
          <div class="game-card">Game 1</div>
          <div class="game-card">Game 2</div>
          <div class="game-card">Game 3</div>
          <div class="game-card">Game 4</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'library-page': LibraryPage;
  }
}