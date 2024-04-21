import { LitElement, html, css } from 'lit-element';

class Timer extends LitElement {
  static get properties() {
    return {
      hideNumbers: { type: Boolean },
      seconds: { type: Number },
    };
  }

  constructor() {
    super();
    this.hideNumbers = false;
    this.seconds = 0;
    this.intervalId = null;
  }

  static get styles() {
    return css`
      .timer {
        font-size: 24px;
        margin-bottom: 20px;
      }
    `;
  }

  firstUpdated() {
    this.startTimer();
  }

  updated(changedProperties) {
    if (changedProperties.has('hideNumbers') && !this.hideNumbers) {
      this.startTimer();
    }
  }

  startTimer() {
    clearInterval(this.intervalId); // Detener el temporizador existente
    this.intervalId = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds -= 1;
      } else {
        clearInterval(this.intervalId);
        this.dispatchEvent(new CustomEvent('timer-end'));
      }
    }, 1000);
  }

  render() {
    return html`
      <div class="timer">Time: ${this.seconds}</div>
    `;
  }
}

customElements.define('memory-cards-timer', Timer);
