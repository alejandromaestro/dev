import { LitElement, html, css } from 'lit-element';

class MemoryCardsHome extends LitElement {
  static get properties() {
    return {
      difficulty: { type: String },
      playerName: { type: String },
      points: { type: Number },
    };
  }

  constructor() {
    super();
    this.difficulty = 'easy';
    this.playerName = '';
  }

  static get styles() {
    return css`
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      input,
      select {
        margin-bottom: 10px;
        padding: 10px;
        width: 200px;
        font-size: 1.5rem;
        border-radius: 20px;
      }

      button {
        padding: 15px 30px;
        font-size: 1.8rem;
        background-color: #6b0000;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: #4c0000;
      }
    `;
  }

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <input
          type="text"
          placeholder="Your name"
          .value="${this.playerName}"
          @input="${this.handleNameChange}"
        />
        <select @change="${this.handleDifficultyChange}">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="submit">Play</button>
      </form>
    `;
  }

  handleNameChange(event) {
    this.playerName = event.target.value;
  }

  handleDifficultyChange(event) {
    this.difficulty = event.target.value;
  }

  handleSubmit(event) {
    event.preventDefault();
    const { playerName } = this;
    if (playerName === '') {
      alert('Please enter a valid name');
    } else {
      const { difficulty } = this;
      let playerData = JSON.parse(localStorage.getItem(playerName));
      if (!playerData) {
        playerData = { playerName, score: 0 };
        localStorage.setItem(playerName, JSON.stringify(playerData));
      }

      this.dispatchEvent(new CustomEvent('start-game', { detail: { playerName, difficulty } }));
    }
  }
}

customElements.define('memory-cards-home', MemoryCardsHome);
