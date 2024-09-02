const timerWorker = new Worker('/public/scripts/workers/timerWorker.js');

timerWorker.onmessage = (event) => {
  switch (event.data.type) {
    case TIMER_WORKER_SIGNALS['Time Update']:
      break;

    case TIMER_WORKER_SIGNALS['Enable Choices Duration']:
      enableChoices();
      break;

    case TIMER_WORKER_SIGNALS['Force New Question Duration']:
      forceNextQuestion();
      break;

    default:
      break;
  }
};

const startTimer = () => {
  timerWorker.postMessage('start_timer');
};

const resetTimer = () => {
  timerWorker.postMessage('reset_timer');
};

const stopTimer = () => {
  timerWorker.postMessage('stop_timer');
};
