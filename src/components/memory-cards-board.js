import { LitElement, html, css } from 'lit-element';

const difficultiesPoints = {
  easy: { points: 10 },
  medium: { points: 20 },
  hard: { points: 30 },
};

class MemoryCardsBoard extends LitElement {
  static get properties() {
    return {
      difficulty: { type: String },
      hideNumbers: { type: Boolean },
      number: { type: Number },
      playerName: { type: String },
      points: { type: Number },
      showMessage: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.clicked = false;
    this.showMessage = false;
    this.randomNumbers = this.generateRandomNumbers();
  }

  static get styles() {
    return css`
      .board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        justify-items: center;
      }

      .cell {
        width: 80px;
        height: 80px;
        background-color: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
      }

      .cell:hover {
        background-color: #e0e0e0;
      }

      .message-container,
      .continue-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-size: 18px;
        display: none;
      }

      .continue {
        background-color: #6b0000;
      }

      .correct {
        background-color: rgb(0, 255, 0);
      }

      .wrong {
        background-color: rgb(171, 171, 171);
      }

      .correct-cell {
        background-color: rgb(0, 255, 0);
        transition: background-color 0.5s ease;
      }

      .wrong-cell {
        background-color: rgb(255, 0, 0);
        transition: background-color 0.5s ease;
      }
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('hideNumbers') && this.hideNumbers) {
      this.clearBoard();
    }
  }

  clearBoard() {
    const cells = this.shadowRoot.querySelectorAll('.cell');
    cells.forEach(cell => {
      const cellElement = cell;
      cellElement.innerText = '';
    });
  }

  /* eslint-disable class-methods-use-this */
  generateRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < 9) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  }

  handleClick(event) {
    if (this.hideNumbers && !this.clicked) {
      this.clicked = true;
      const clickedCell = event.target;
      const numberClicked = parseInt(clickedCell.dataset.number, 10);
      clickedCell.innerText = numberClicked;
      if (this.number === numberClicked) {
        clickedCell.classList.add('correct-cell');
        setTimeout(() => {
          clickedCell.classList.remove('correct-cell');
        }, 2000);
        this.correctNumber();
      } else {
        clickedCell.classList.add('wrong-cell');
        setTimeout(() => {
          clickedCell.classList.remove('wrong-cell');
        }, 2000);
        this.wrongNumber();
      }
    }
  }

  addPoints() {
    const playerData = JSON.parse(localStorage.getItem(this.playerName));
    let playerScore = playerData.score;
    playerScore += difficultiesPoints[this.difficulty].points;
    localStorage.setItem(this.playerName, JSON.stringify({ score: playerScore }));
    const pointsEvent = new CustomEvent('points-updated', {
      bubbles: true,
      composed: true,
      detail: { points: playerScore },
    });
    this.dispatchEvent(pointsEvent);
  }

  continue() {
    this.continueMessage = true;
    const messageField = this.renderRoot.querySelector('.continue-container');
    messageField.innerHTML = `Press to continue...`;
  }

  continuePlaying() {
    this.continueMessage = false;
    this.hideNumbers = false;
    const continueEvent = new CustomEvent('continue-playing', { bubbles: true, composed: true });
    this.dispatchEvent(continueEvent);
    this.restartBoard();
  }

  correctNumber() {
    const messageField = this.renderRoot.querySelector('.message-container');
    messageField.innerHTML = `Correct +${difficultiesPoints[this.difficulty].points}`;
    messageField.classList.remove('wrong');
    messageField.classList.add('correct');
    this.addPoints();
    this.show();
  }

  wrongNumber() {
    const messageField = this.renderRoot.querySelector('.message-container');
    messageField.innerHTML = `Wrong`;
    messageField.classList.remove('correct');
    messageField.classList.add('wrong');
    this.show();
  }

  show() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
      this.continue();
    }, 2000);
  }

  restartBoard() {
    const cells = this.shadowRoot.querySelectorAll('.cell');
    const randomNumbers = this.generateRandomNumbers();
    cells.forEach((cell, index) => {
      const cellElement = cell;
      cellElement.innerText = randomNumbers[index];
      cellElement.dataset.number = randomNumbers[index];
    });

    this.clicked = false;
  }

  renderCells() {
    const cellElements = this.randomNumbers.map(
      number =>
        html`
          <div class="cell" data-number="${number}" @click="${this.handleClick}">${number}</div>
        `,
    );
    return html`
      ${cellElements}
    `;
  }

  render() {
    return html`
      <div class="board">${this.renderCells()}</div>
      <div class="message-container" style="${this.showMessage ? 'display: block;' : ''}"></div>
      <div
        class="continue-container continue"
        style="${this.continueMessage ? 'display: block;' : ''}"
        @click="${this.continuePlaying}"
      ></div>
    `;
  }
}

customElements.define('memory-cards-board', MemoryCardsBoard);
