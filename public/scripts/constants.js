const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const QUESTION_COUNT = 3;

// These constans defined in timerWorker too.
// If you update, you need to update timeWorker's constants too
const MILISECONDS_PER_SECOND = 1000;
const QUESTION_DURATION = 5 * MILISECONDS_PER_SECOND;
const ENABLE_CHOICE_DURATION = 1 * MILISECONDS_PER_SECOND;

const TIMER_WORKER_SIGNALS = {
  'Time Update': 'time_update',
  'Enable Choices Duration': '10_sec_passed',
  'Force New Question Duration': '30_sec_passed'
};

const CHOICE_STATUS = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  UNKNOWN: 'unknown'
};

const ANSWER_STATUS = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  UNKNOWN: 'unknown'
};

const QUESTION_STATUS = {
  CORRECT: 'correct',
  WRONG: 'wrong',
  UNKNOWN: 'unknown'
};
