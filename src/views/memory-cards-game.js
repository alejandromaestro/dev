import { LitElement, html, css } from 'lit-element';
import '../components/memory-cards-timer';
import '../components/memory-cards-board';

const difficultiesTime = {
  easy: { time: 10 },
  medium: { time: 5 },
  hard: { time: 2 },
};

class MemoryCardsGame extends LitElement {
  static get properties() {
    return {
      continue: { type: Boolean },
      difficulty: { type: String },
      hideNumbers: { type: Boolean },
      number: { type: Number },
      numberSelected: { type: Number },
      playerName: { type: String },
      points: { type: Number },
      seconds: { type: Number },
    };
  }

  constructor() {
    super();
    this.continue = false;
    this.seconds = 0;
    this.hideNumbers = false;
    this.addEventListener('continue-playing', this.handleContinuePlaying.bind(this));
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .question {
        font-size: 24px;
        margin-bottom: 20px;
      }
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('hideNumbers') && !this.hideNumbers) {
      this.setSeconds(this.difficulty);
    }
    if (changedProperties.has('points')) {
      this.setSeconds(this.difficulty);
    }
  }

  handleContinuePlaying() {
    this.hideNumbers = false;
  }

  handleTimerEnd() {
    this.hideNumbers = true;
  }

  guessNumber() {
    this.number = Math.floor(Math.random() * 9) + 1;
    return this.number;
  }

  setSeconds(difficulty) {
    this.seconds = difficultiesTime[difficulty].time;
  }

  render() {
    return html`
      <div class="container">
        ${this.hideNumbers
          ? html`
              <div class="question"><b>Where is ... ${this.guessNumber()}?</b></div>
            `
          : html`
              <memory-cards-timer .seconds="${this.seconds}" @timer-end="${this.handleTimerEnd}">
              </memory-cards-timer>
            `}
        <memory-cards-board
          ?hideNumbers="${this.hideNumbers}"
          .number="${this.number}"
          .difficulty="${this.difficulty}"
          .playerName="${this.playerName}"
          .points="${this.points}"
        ></memory-cards-board>
      </div>
    `;
  }
}

customElements.define('memory-cards-game', MemoryCardsGame);
