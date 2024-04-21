import { LitElement, html, css } from 'lit-element';
import './views/memory-cards-home';
import './views/memory-cards-game';

class MemoryCards extends LitElement {
  static get properties() {
    return {
      difficulty: { type: String },
      gameVisible: { type: Boolean },
      homeVisible: { type: Boolean },
      menuVisible: { type: Boolean },
      playerName: { type: String },
      points: { type: Number },
    };
  }

  constructor() {
    super();
    this.gameVisible = false;
    this.homeVisible = true;
    this.menuVisible = false;
    this.playerName = '';
    this.points = 0;
    this.addEventListener('points-updated', this.handlePointsUpdated.bind(this));
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f5f5f5;
      }

      header {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: #6b0000;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        padding: 20px 0;
        text-align: center;
        flex-direction: column;
        transition: height 0.3s;
      }

      footer {
        display: flex;
        justify-content: space-between;
        background-color: #6b0000;
        color: white;
        text-align: center;
        padding: 20px 20px;
      }

      .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .menu-options {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #6b0000;
        color: white;
        padding: 10px;
      }

      button {
        margin-bottom: 10px;
        padding: 10px 20px;
        border: none;
        background-color: transparent;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    `;
  }

  render() {
    return html`
      <header @click="${this.toggleMenu}">
        ${this.menuVisible
          ? html`
              <div class="menu-options">
                <button @click="${this.goHome}">
                  <h1>Home</h1>
                </button>
                <button @click="${this.goGame}">
                  <h1>Game</h1>
                </button>
              </div>
            `
          : html`
              <h1>MEMORY CARDS</h1>
            `}
      </header>
      <div class="container">
        ${this.homeVisible
          ? html`
              <memory-cards-home
                .playerName="${this.playerName}"
                .points="${this.points}"
                @start-game="${this.handleStartGame}"
              ></memory-cards-home>
            `
          : ''}
        ${this.gameVisible
          ? html`
              <memory-cards-game
                .playerName="${this.playerName}"
                .points="${this.points}"
                .difficulty="${this.difficulty}"
              ></memory-cards-game>
            `
          : ''}
      </div>
      <footer>
        ${this.playerName
          ? html`
              <div>
                <p>PLAYER: ${this.playerName}</p>
              </div>
              <div>
                <p>POINTS: ${this.points}</p>
              </div>
            `
          : ''}
      </footer>
    `;
  }

  goGame() {
    if (this.playerName !== '') {
      this.homeVisible = false;
      this.gameVisible = true;
    } else {
      alert('Log in first');
    }
  }

  goHome() {
    this.gameVisible = false;
    this.homeVisible = true;
  }

  handleStartGame(event) {
    const { playerName } = event.detail;
    const { difficulty } = event.detail;
    const playerData = JSON.parse(localStorage.getItem(playerName));
    this.playerName = playerName;
    this.points = playerData.score;
    this.difficulty = difficulty;
    this.goGame();
  }

  handlePointsUpdated(event) {
    this.points = event.detail.points;
    this.requestUpdate('points');
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}

customElements.define('memory-cards', MemoryCards);
