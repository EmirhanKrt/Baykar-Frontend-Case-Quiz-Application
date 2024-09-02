// TimerWorker.js: Handles timer logic on the new thread

const MILISECONDS_PER_SECOND = 1000;
const QUESTION_DURATION = 5 * MILISECONDS_PER_SECOND;
const ENABLE_CHOICE_DURATION = 1 * MILISECONDS_PER_SECOND;

let currentQuestionRemainingTime = QUESTION_DURATION;

let currentQuestionTimerStartTime = null;
let requestAnimationFrameId = null;

let isEnableChoiceSignalSent = false;

/**
 * Start the timer using requestAnimationFrame.
 * This function checks the elapsed time and sends "10_sec_passed" and "30_sec_passed" signals to the main thread.
 */
const startTimer = () => {
  currentQuestionRemainingTime = QUESTION_DURATION;

  currentQuestionTimerStartTime = performance.now();

  isEnableChoiceSignalSent = false;

  /**
   * Timer worker function that continuously checks the elapsed time.
   * Sends signals "10_sec_passed" and "30_sec_passed" to the main thread when 10 seconds or 30 seconds have passed.
   */
  const timerWorker = () => {
    let elapsedTime = performance.now() - currentQuestionTimerStartTime;
    currentQuestionRemainingTime = QUESTION_DURATION - elapsedTime;

    postMessage({
      type: 'time_update',
      currentQuestionRemainingTime: Math.max(
        currentQuestionRemainingTime,
        MILISECONDS_PER_SECOND * 0
      )
    });

    // Send signal to main thread when enable choice duration is finished.
    if (!isEnableChoiceSignalSent && elapsedTime >= ENABLE_CHOICE_DURATION) {
      postMessage({ type: '10_sec_passed' });
      isEnableChoiceSignalSent = true;
    }

    // Send signal to main thread when question duration is finished.
    if (elapsedTime >= QUESTION_DURATION) {
      postMessage({ type: '30_sec_passed' });
      return;
    }

    requestAnimationFrameId = requestAnimationFrame(timerWorker);
  };

  requestAnimationFrameId = requestAnimationFrame(timerWorker);
};

/**
 * Reset the timer by canceling the current requestAnimationFrame call
 * and starting the timer again from zero.
 */
const resetTimer = () => {
  cancelAnimationFrame(requestAnimationFrameId);

  startTimer();
};

/**
 * Stops the timer by canceling the current requestAnimationFrame call
 */
const stopTimer = () => {
  cancelAnimationFrame(requestAnimationFrameId);
};

onmessage = (event) => {
  switch (event.data) {
    case 'start_timer':
      startTimer();
      break;

    case 'reset_timer':
      resetTimer();
      break;

    case 'stop_timer':
      stopTimer();
      break;
  }
};
